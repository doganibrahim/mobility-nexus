import { Organisation, AccreditationStatus } from '@mobility-nexus/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface CreateOrgPayload {
  name: string;
  oid?: string;
  city?: string;
  countryCode?: string;
  accreditationStatus?: AccreditationStatus;
  erasmusPlan?: string;
  institutionNeed?: string;
  userId?: string;
  userEmail?: string;
  userFullName?: string;
}

export interface CreateInvitePayload {
  email: string;
  role: 'ORG_ADMIN' | 'MEMBER' | 'VIEWER';
}

export interface RegisterHostPayload {
  name: string;
  countryCode: string;
  city: string;
  address?: string;
  websiteUrl?: string;
  primarySector: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  maxLearnersPerTerm?: number;
  totalAnnualCapacity?: number;
  activities?: string[];
  languages?: string[];
  userId?: string;
  userEmail?: string;
  userFullName?: string;
}

export interface InviteResponse {
  token: string;
  inviteUrl: string;
  email: string;
  role: string;
  expiresAt: string;
  isFallback?: boolean;
}

export const apiClient = {
  /**
   * Updates an existing organisation on the NestJS backend via PATCH.
   * Gracefully updates local state if the backend is unreachable.
   */
  async updateOrganisation(
    orgId: string,
    payload: Partial<CreateOrgPayload>,
  ): Promise<{ data: Organisation; isFallback: boolean }> {
    const correlationId = `web-upd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${API_BASE_URL}/organisations/${orgId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-Id': correlationId,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Sunucu hatası: HTTP ${response.status}`,
        );
      }

      const updatedOrg: Organisation = await response.json();
      return { data: updatedOrg, isFallback: false };
    } catch (err: any) {
      console.warn(
        'Backend API güncelleme sırasında ulaşılamadı. Yerel fallback uygulanıyor.',
        err.message,
      );

      const fallbackOrg: Organisation = {
        id: orgId,
        name: payload.name || 'Kurum',
        slug: 'kurum',
        oid: payload.oid || null,
        city: payload.city || null,
        countryCode: payload.countryCode || 'TR',
        accreditationStatus: payload.accreditationStatus || 'UNKNOWN',
        erasmusPlan: payload.erasmusPlan || null,
        institutionNeed: payload.institutionNeed || null,
        readinessScore: payload.oid ? 75 : 45,
        isActive: true,
        settings: { isFallback: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { data: fallbackOrg, isFallback: true };
    }
  },

  /**
   * Creates a new accredited/VET organisation on the NestJS backend.
   * If the backend is offline/unreachable, gracefully falls back to a locally generated record.
   */
  async createOrganisation(
    payload: CreateOrgPayload,
  ): Promise<{ data: Organisation; isFallback: boolean }> {
    const correlationId = `web-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${API_BASE_URL}/organisations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-Id': correlationId,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Sunucu hatası: HTTP ${response.status}`,
        );
      }

      const createdOrg: Organisation = await response.json();
      return { data: createdOrg, isFallback: false };
    } catch (err: any) {
      console.warn(
        'Backend API bağlantısı kurulamadı veya zaman aşımına uğradı. Güvenli yerel fallback modu kullanılıyor.',
        err.message,
      );

      // Fallback local organisation generator
      const fallbackId = `org-loc-${Date.now()}`;
      const slug = payload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const fallbackOrg: Organisation = {
        id: fallbackId,
        name: payload.name,
        slug: slug || 'kurum',
        oid: payload.oid || null,
        city: payload.city || null,
        countryCode: payload.countryCode || 'TR',
        accreditationStatus: payload.accreditationStatus || 'UNKNOWN',
        erasmusPlan: payload.erasmusPlan || null,
        institutionNeed: payload.institutionNeed || null,
        readinessScore: payload.oid ? 75 : 45,
        isActive: true,
        settings: { isFallback: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { data: fallbackOrg, isFallback: true };
    }
  },

  /**
   * Creates a single-use tokenized invitation for a new team member.
   */
  async createInvitation(
    orgId: string,
    payload: CreateInvitePayload,
  ): Promise<InviteResponse> {
    const correlationId = `inv-${Date.now()}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(
        `${API_BASE_URL}/organisations/${orgId}/invitations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Correlation-Id': correlationId,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Davet oluşturulamadı: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        token: result.token,
        inviteUrl: result.inviteUrl || `${window.location.origin}/invitations/accept?token=${result.token}`,
        email: result.email,
        role: result.role,
        expiresAt: result.expiresAt,
        isFallback: false,
      };
    } catch {
      // Fallback in-memory token
      const token = `inv-tok-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      const inviteUrl = `${window.location.origin}/invitations/accept?token=${token}`;
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        token,
        inviteUrl,
        email: payload.email,
        role: payload.role,
        expiresAt,
        isFallback: true,
      };
    }
  },

  /**
   * Fetches the organisation and role linked to a given user account.
   */
  async getUserOrganisation(
    userId: string,
  ): Promise<{ data: any | null }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        `${API_BASE_URL}/organisations/user/${encodeURIComponent(userId)}`,
        {
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) return { data: null };
      const org = await response.json();
      return { data: org };
    } catch {
      return { data: null };
    }
  },

  /**
   * Fetches the list of EU & Erasmus+ program countries.
   */
  async getCountries(): Promise<Array<{ code: string; nameTr: string; nameEn: string; flagEmoji?: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reference/countries`);
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return [
        { code: 'DE', nameTr: 'Almanya', nameEn: 'Germany', flagEmoji: '🇩🇪' },
        { code: 'TR', nameTr: 'Türkiye', nameEn: 'Turkey', flagEmoji: '🇹🇷' },
        { code: 'NL', nameTr: 'Hollanda', nameEn: 'Netherlands', flagEmoji: '🇳🇱' },
        { code: 'IT', nameTr: 'İtalya', nameEn: 'Italy', flagEmoji: '🇮🇹' },
        { code: 'ES', nameTr: 'İspanya', nameEn: 'Spain', flagEmoji: '🇪🇸' },
        { code: 'FR', nameTr: 'Fransa', nameEn: 'France', flagEmoji: '🇫🇷' },
        { code: 'BE', nameTr: 'Belçika', nameEn: 'Belgium', flagEmoji: '🇧🇪' },
        { code: 'AT', nameTr: 'Avusturya', nameEn: 'Austria', flagEmoji: '🇦🇹' },
        { code: 'PL', nameTr: 'Polonya', nameEn: 'Poland', flagEmoji: '🇵🇱' },
        { code: 'PT', nameTr: 'Portekiz', nameEn: 'Portugal', flagEmoji: '🇵🇹' },
        { code: 'CZ', nameTr: 'Çekya', nameEn: 'Czech Republic', flagEmoji: '🇨🇿' },
      ];
    }
  },

  /**
   * Fetches the list of VET sectors.
   */
  async getSectors(): Promise<Array<{ code: string; nameTr: string; nameEn: string; iscedField?: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reference/sectors`);
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return [
        { code: 'ict', nameTr: 'Bilişim ve Yazılım Teknolojileri', nameEn: 'Information & Communication Technology' },
        { code: 'automotive', nameTr: 'Otomotiv ve Raylı Sistemler', nameEn: 'Automotive & Rail Systems' },
        { code: 'electrical', nameTr: 'Elektrik, Elektronik ve Otomasyon', nameEn: 'Electrical, Electronics & Automation' },
        { code: 'machinery', nameTr: 'Makine, Mekatronik ve İmalat', nameEn: 'Machinery, Mechatronics & Manufacturing' },
        { code: 'health', nameTr: 'Sağlık Hizmetleri ve Biyoteknoloji', nameEn: 'Health Services & Biotechnology' },
        { code: 'tourism', nameTr: 'Turizm, Otelcilik ve Yiyecek-İçecek', nameEn: 'Tourism, Hospitality & Catering' },
        { code: 'logistics', nameTr: 'Ulaştırma, Lojistik ve Tedarik Zinciri', nameEn: 'Logistics, Transport & Supply Chain' },
        { code: 'green_energy', nameTr: 'Yenilenebilir Enerji ve Çevre Teknolojileri', nameEn: 'Renewable Energy & Green Tech' },
      ];
    }
  },

  /**
   * Registers a new Host Organisation (European enterprise / hosting provider) on the backend.
   */
  async registerHost(
    payload: RegisterHostPayload,
  ): Promise<{ data: any; isFallback: boolean }> {
    const correlationId = `web-host-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${API_BASE_URL}/hosts/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-Id': correlationId,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Sunucu hatası: HTTP ${response.status}`,
        );
      }

      const host = await response.json();
      return { data: host, isFallback: false };
    } catch (err: any) {
      console.warn('Host kaydı yerel fallback modu kullanılıyor:', err.message);

      const fallbackHost = {
        id: `host-loc-${Date.now()}`,
        name: payload.name,
        slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        countryCode: payload.countryCode || 'DE',
        city: payload.city,
        address: payload.address || null,
        websiteUrl: payload.websiteUrl || null,
        primarySector: payload.primarySector,
        verificationStatus: 'PENDING',
        contactPerson: payload.contactPerson,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone || null,
        languages: payload.languages || ['EN'],
        maxLearnersPerTerm: payload.maxLearnersPerTerm || 4,
        totalAnnualCapacity: payload.totalAnnualCapacity || 12,
        activities: payload.activities || ['VET_INTERNSHIP'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { data: fallbackHost, isFallback: true };
    }
  },

  /**
   * Checks if user has a registered host organisation.
   */
  async getUserHostOrganisation(
    userId: string,
  ): Promise<{ data: any | null }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        `${API_BASE_URL}/hosts/user/${encodeURIComponent(userId)}`,
        {
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) return { data: null };
      const host = await response.json();
      return { data: host };
    } catch {
      return { data: null };
    }
  },
};
