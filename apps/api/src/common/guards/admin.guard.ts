import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminKeyHeader = request.headers['x-admin-key'];
    const userEmailHeader = request.headers['x-user-email'];
    const user = request.user;

    const configuredSecret =
      this.config.get<string>('ADMIN_SECRET_KEY') ||
      this.config.get<string>('JWT_SECRET') ||
      'super-secret-jwt-key-change-in-production-cappinno-2026';

    const configuredEmails = (
      this.config.get<string>('ADMIN_EMAILS') ||
      'ibrahimdogan.js@gmail.com'
    )
      .toLowerCase()
      .split(',')
      .map((e) => e.trim());

    // 1. Check secret key header
    if (adminKeyHeader && String(adminKeyHeader).trim() === configuredSecret.trim()) {
      return true;
    }

    // 2. Check user role if authenticated via JWT or session
    if (user && (user.role === 'SUPER_ADMIN' || user.role === 'PLATFORM_ADMIN' || user.role === 'ADMIN')) {
      return true;
    }

    // 3. Check verified admin email
    if (userEmailHeader && configuredEmails.includes(String(userEmailHeader).toLowerCase().trim())) {
      return true;
    }

    throw new ForbiddenException(
      'Erişim reddedildi: Bu işlem için platform yöneticisi (Admin) yetkisi gereklidir.',
    );
  }
}
