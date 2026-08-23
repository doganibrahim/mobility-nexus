import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Membership,
  Invitation,
  UserAccount,
  Role,
} from '@mobility-nexus/types';
import {
  CreateInvitationDto,
  AcceptInvitationDto,
} from './dto/create-invitation.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class MembersService {
  private users: Map<string, UserAccount> = new Map();
  private memberships: Map<string, Membership> = new Map();
  private invitations: Map<string, Invitation> = new Map();

  constructor(private readonly auditService: AuditService) {
    // Seed initial admin user and membership
    const demoOrgId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    const demoUserId = 'u1111111-2222-3333-4444-555555555555';

    this.users.set(demoUserId, {
      id: demoUserId,
      email: 'erasmus.koordinator@ankaramtal.edu.tr',
      fullName: 'Mustafa Demir',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const memId = uuidv4();
    this.memberships.set(memId, {
      id: memId,
      organisationId: demoOrgId,
      userId: demoUserId,
      role: 'ORG_ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async getMembers(organisationId: string): Promise<
    (Membership & { user: UserAccount | undefined })[]
  > {
    const list = Array.from(this.memberships.values()).filter(
      (m) => m.organisationId === organisationId && m.isActive,
    );

    return list.map((m) => ({
      ...m,
      user: this.users.get(m.userId),
    }));
  }

  async createInvitation(
    organisationId: string,
    dto: CreateInvitationDto,
    correlationId: string,
    currentUserId?: string,
  ): Promise<{ invitation: Invitation; inviteUrl: string }> {
    // Check if user is already a member
    const existingUser = Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === dto.email.toLowerCase(),
    );
    if (existingUser) {
      const isMember = Array.from(this.memberships.values()).some(
        (m) =>
          m.organisationId === organisationId &&
          m.userId === existingUser.id &&
          m.isActive,
      );
      if (isMember) {
        throw new ConflictException('Bu kullanıcı zaten bu kurumun üyesidir.');
      }
    }

    const invitationId = uuidv4();
    const token = `inv-tok-${uuidv4().replace(/-/g, '')}`;
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 hours

    const invitation: Invitation = {
      id: invitationId,
      organisationId,
      email: dto.email.toLowerCase(),
      role: dto.role,
      token,
      status: 'PENDING',
      expiresAt,
      createdBy: currentUserId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.invitations.set(token, invitation);

    await this.auditService.logEvent({
      organisationId,
      userId: currentUserId,
      action: 'INVITATION_SENT',
      resourceType: 'invitation',
      resourceId: invitationId,
      payloadAfter: { email: dto.email, role: dto.role, expiresAt },
      correlationId,
    });

    const inviteUrl = `http://localhost:3000/invitations/accept?token=${token}`;

    return { invitation, inviteUrl };
  }

  async acceptInvitation(
    dto: AcceptInvitationDto,
    correlationId: string,
  ): Promise<{ user: UserAccount; membership: Membership }> {
    const invitation = this.invitations.get(dto.token);
    if (!invitation) {
      throw new NotFoundException('Geçersiz veya bulunamayan davet bağlantısı.');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('Bu davet daha önce kullanılmış veya iptal edilmiş.');
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      invitation.status = 'EXPIRED';
      throw new BadRequestException('Bu davet bağlantısının süresi dolmuş.');
    }

    // Find or create user
    let user = Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === invitation.email.toLowerCase(),
    );

    if (!user) {
      const userId = uuidv4();
      user = {
        id: userId,
        email: invitation.email,
        fullName: dto.fullName,
        isActive: true,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.users.set(userId, user);
    }

    // Create membership
    const membershipId = uuidv4();
    const membership: Membership = {
      id: membershipId,
      organisationId: invitation.organisationId,
      userId: user.id,
      role: invitation.role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.memberships.set(membershipId, membership);

    // Update invitation status
    invitation.status = 'ACCEPTED';
    invitation.acceptedBy = user.id;
    invitation.updatedAt = new Date().toISOString();

    await this.auditService.logEvent({
      organisationId: invitation.organisationId,
      userId: user.id,
      action: 'INVITATION_ACCEPTED',
      resourceType: 'membership',
      resourceId: membershipId,
      payloadAfter: { userId: user.id, role: invitation.role },
      correlationId,
    });

    return { user, membership };
  }

  async removeMember(
    organisationId: string,
    userId: string,
    correlationId: string,
  ): Promise<{ success: boolean }> {
    const memEntry = Array.from(this.memberships.entries()).find(
      ([, m]) =>
        m.organisationId === organisationId &&
        m.userId === userId &&
        m.isActive,
    );

    if (!memEntry) {
      throw new NotFoundException('Kullanıcı üyeliği bulunamadı.');
    }

    const [memId, membership] = memEntry;
    membership.isActive = false;
    membership.updatedAt = new Date().toISOString();

    await this.auditService.logEvent({
      organisationId,
      userId,
      action: 'MEMBER_REMOVED',
      resourceType: 'membership',
      resourceId: memId,
      correlationId,
    });

    return { success: true };
  }
}
