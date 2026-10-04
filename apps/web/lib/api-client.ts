import { Organisation, AccreditationStatus } from '@mobility-nexus/types';
import { ERASMUS_COUNTRIES } from './countries';

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
  tradingName?: string;
  organisationType: string;
  countryCode: string;
  city: string;
  registeredAddress: string;
  operationalAddress?: string;
  address?: string;
  yearEstablished: number;
  oid: string;
  picNumber?: string;
  websiteUrl: string;
  generalEmail: string;
  telephone: string;
  primarySector: string;
  contactPerson: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone?: string;
  consentPublicDisplay: boolean;
  maxLearnersPerTerm?: number;
  totalAnnualCapacity?: number;
  activities?: string[];
  languages?: string[];
  workingLanguages?: string[];
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
   * Updates an existing organisation.
   */
  async updateOrganisation(
    orgId: string,
    payload: Partial<CreateOrgPayload>,
  ): Promise<{ data: Organisation; isFallback: boolean }> {
    try {
      const response = await fetch('/api/organisations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: orgId }),
      });
      if (response.ok) {
        const org = await response.json();
        return { data: org, isFallback: false };
      }
    } catch {}

    // Fallback local organisation
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
  },

  /**
   * Creates a new accredited/VET organisation.
   */
  async createOrganisation(
    payload: CreateOrgPayload,
  ): Promise<{ data: Organisation; isFallback: boolean }> {
    try {
      const response = await fetch('/api/organisations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const createdOrg: Organisation = await response.json();
        return { data: createdOrg, isFallback: false };
      }
    } catch {}

    // Fallback local organisation generator
    const fallbackId = `org-loc-${Date.now()}`;
    const slug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const isValidOid = Boolean(payload.oid && /^E10[0-9]{5,7}$/i.test(payload.oid.trim()));
    let calculatedReadiness = 0;
    if (payload.name && payload.name.trim().length >= 3 && payload.city && payload.city.trim().length >= 2) calculatedReadiness += 30;
    if (payload.accreditationStatus === 'YES') calculatedReadiness += 35;
    else if (payload.accreditationStatus === 'NO') calculatedReadiness += 20;
    if (isValidOid) calculatedReadiness += 35;

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
      readinessScore: calculatedReadiness,
      isActive: true,
      settings: { isFallback: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { data: fallbackOrg, isFallback: true };
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
      const response = await fetch(`/api/organisations/user/${encodeURIComponent(userId)}`);
      if (response.ok) {
        const org = await response.json();
        return { data: org };
      }
    } catch {}

    return { data: null };
  },

  /**
   * Fetches the list of all EU & Erasmus+ program countries.
   */
  async getCountries(): Promise<Array<{ code: string; nameTr: string; nameEn: string; flagEmoji?: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reference/countries`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}

    return ERASMUS_COUNTRIES;
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
    try {
      const response = await fetch('/api/hosts/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const host = await response.json();
        return { data: host, isFallback: false };
      }
    } catch {}

    const fallbackHost = {
      id: `host-loc-${Date.now()}`,
      name: payload.name,
      tradingName: payload.tradingName || payload.name,
      organisationType: payload.organisationType || 'Company',
      countryCode: payload.countryCode || 'DE',
      city: payload.city,
      address: payload.registeredAddress || payload.address || null,
      websiteUrl: payload.websiteUrl || null,
      primarySector: payload.primarySector,
      verificationStatus: 'PENDING',
      contactPerson: payload.contactPerson,
      contactEmail: payload.contactEmail,
      contactPhone: payload.telephone || payload.contactPhone || null,
      languages: payload.languages || payload.workingLanguages || ['EN'],
      maxLearnersPerTerm: payload.maxLearnersPerTerm || 4,
      totalAnnualCapacity: payload.totalAnnualCapacity || 12,
      activities: payload.activities || ['VET_INTERNSHIP'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { data: fallbackHost, isFallback: true };
  },

  /**
   * Checks if user has a registered host organisation.
   */
  async getUserHostOrganisation(
    userId: string,
  ): Promise<{ data: any | null }> {
    try {
      const response = await fetch(`/api/hosts/user/${encodeURIComponent(userId)}`);
      if (response.ok) {
        const host = await response.json();
        return { data: host };
      }
    } catch {}

    return { data: null };
  },

  /**
   * Updates host organisation portfolio and Erasmus+ experience metrics (Tier 2).
   */
  async updateHostPortfolio(
    hostId: string,
    payload: any,
  ): Promise<{ data: any; isFallback: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/hosts/${hostId}/portfolio`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      const host = await response.json();
      return { data: host, isFallback: false };
    } catch {
      return { data: payload, isFallback: true };
    }
  },

  /**
   * Submits official legal & verification KYC documents (Tier 3 - Admin Only).
   */
  async submitHostVerification(
    hostId: string,
    payload: any,
  ): Promise<{ data: any; isFallback: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/hosts/${hostId}/verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      const host = await response.json();
      return { data: host, isFallback: false };
    } catch {
      return { data: { ...payload, verificationStatus: 'UNDER_REVIEW' }, isFallback: true };
    }
  },

  /**
   * Fetches the admin verification review queue.
   */
  async getVerificationQueue(status?: string, userEmail?: string, adminKey?: string): Promise<any[]> {
    try {
      const url = status
        ? `${API_BASE_URL}/hosts/verifications/queue?status=${status}`
        : `${API_BASE_URL}/hosts/verifications/queue`;
      
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const secret = adminKey || process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY;
      if (secret) headers['x-admin-key'] = secret;
      if (userEmail) headers['x-user-email'] = userEmail;

      const response = await fetch(url, { headers });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        return [];
      }
      return await response.json();
    } catch (err: any) {
      console.warn('Doğrulama kuyruğu yüklenirken hata:', err.message);
      return [];
    }
  },

  /**
   * Admin approves, rejects, or requests updates for host verification.
   */
  async reviewHostVerification(
    hostId: string,
    payload: { status: 'VERIFIED' | 'NEEDS_UPDATE' | 'REJECTED'; reviewerNotes?: string; criteriaChecklist?: Record<string, boolean> },
    userEmail?: string,
    adminKey?: string,
  ): Promise<{ data: any; isFallback: boolean }> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const secret = adminKey || process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY;
      if (secret) headers['x-admin-key'] = secret;
      if (userEmail) headers['x-user-email'] = userEmail;

      const response = await fetch(`${API_BASE_URL}/hosts/${hostId}/verification/review`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const host = await response.json();
      return { data: host, isFallback: false };
    } catch {
      return { data: payload, isFallback: true };
    }
  },

  /**
   * Uploads a file (PDF, image, document) to Cloudflare R2 / Local storage.
   */
  async uploadFile(
    file: File,
    folder = 'documents',
    isPrivate = false,
  ): Promise<{ url: string; key: string; filename: string; sizeBytes: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${API_BASE_URL}/storage/upload?folder=${encodeURIComponent(folder)}&isPrivate=${isPrivate}`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) throw new Error('Upload error');
      return await response.json();
    } catch {
      // Mock / fallback url for offline development
      return {
        url: URL.createObjectURL(file),
        key: `${folder}/${Date.now()}-${file.name}`,
        filename: file.name,
        sizeBytes: file.size,
      };
    }
  },

  /**
   * Matches candidate European host organisations based on school's requirements.
   * Calls POST /hosts/match with graceful fallback to local client matching engine.
   */
  async matchHosts(
    payload: import('@mobility-nexus/types').MatchHostsRequestDto,
  ): Promise<{ data: import('@mobility-nexus/types').MatchHostsResponseDto; isFallback: boolean }> {
    const correlationId = `web-match-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${API_BASE_URL}/hosts/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-Id': correlationId,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { data, isFallback: false };
    } catch {
      // Resilient client-side fallback
      const { matchHostsClientSide } = await import('./matching-engine');
      const fallbackData = matchHostsClientSide(payload);
      return { data: fallbackData, isFallback: true };
    }
  },

  /**
   * Evaluates 7 matching criteria with transparent score breakdown & mismatch diagnostics (PKG-IMP-03)
   * Calls POST /matching/evaluate-criteria (with graceful fallback to client engine).
   */
  async evaluateCriteria(
    payload: import('@mobility-nexus/types').EvaluateCriteriaRequestDto,
  ): Promise<{ data: import('@mobility-nexus/types').EvaluateCriteriaResponseDto; isFallback: boolean }> {
    const correlationId = `web-eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${API_BASE_URL}/matching/evaluate-criteria`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-Id': correlationId,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { data, isFallback: false };
    } catch {
      // Resilient client-side fallback
      const { evaluateCriteriaClient } = await import('./matching-engine');
      const fallbackData = evaluateCriteriaClient(payload);
      return { data: fallbackData, isFallback: true };
    }
  },

  /**
   * Fetches all mobility inquiries from server/database
   */
  async getInquiries(params?: { status?: string; hostId?: string; schoolOid?: string }): Promise<any[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.hostId) query.set('hostId', params.hostId);
      if (params?.schoolOid) query.set('schoolOid', params.schoolOid);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const response = await fetch(`/api/inquiries${qs}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        return [];
      }
      const result = await response.json();
      return result.data || [];
    } catch (err: any) {
      console.warn('API getInquiries hatası:', err.message);
      return [];
    }
  },

  /**
   * Submits a new school inquiry to the server/database
   */
  async createInquiry(inquiry: any): Promise<{ data: any; success: boolean }> {
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      return { data: result.data || inquiry, success: true };
    } catch (err: any) {
      console.warn('API createInquiry hatası:', err.message);
      return { data: inquiry, success: false };
    }
  },

  /**
   * Updates inquiry status and reply note on the server/database
   */
  async updateInquiryStatus(
    id: string,
    status: 'PENDING' | 'ACCEPTED' | 'REVISED' | 'DECLINED',
    hostReplyNote?: string,
  ): Promise<{ data: any; success: boolean }> {
    return this.updateInquiry(id, { status, hostReplyNote });
  },

  /**
   * Updates inquiry with partial data (e.g. resubmitting a revised inquiry)
   */
  async updateInquiry(
    id: string,
    updates: Record<string, any>,
  ): Promise<{ data: any; success: boolean }> {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      return { data: result.data, success: true };
    } catch (err: any) {
      console.warn('API updateInquiry hatası:', err.message);
      return { data: null, success: false };
    }
  },

  /**
   * Deletes an inquiry on the server/database
   */
  async deleteInquiry(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (err: any) {
      console.warn('API deleteInquiry hatası:', err.message);
      return false;
    }
  },

  /**
   * Fetches 5-dimensional performance assessment breakdown for a host (PKG-IMP-05)
   */
  async getHostReviewsBreakdown(
    hostId: string
  ): Promise<import('@mobility-nexus/types').HostReviewsBreakdownResponse> {
    try {
      const response = await fetch(`/api/hosts/${hostId}/reviews-breakdown`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err: any) {
      console.warn('API getHostReviewsBreakdown hatası:', err.message);
    }

    const { ProviderReviewsDb } = await import('./provider-reviews-db');
    return ProviderReviewsDb.getReviewsBreakdown(hostId);
  },

  /**
   * Submits a 5-dimensional performance review for a host organisation (PKG-IMP-05)
   */
  async submitHostReview(
    hostId: string,
    payload: import('@mobility-nexus/types').CreateHostReviewDto
  ): Promise<{ data: import('@mobility-nexus/types').HostReviewItem; success: boolean }> {
    try {
      const response = await fetch(`/api/hosts/${hostId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        return { data, success: true };
      }
    } catch (err: any) {
      console.warn('API submitHostReview hatası:', err.message);
    }

    const { ProviderReviewsDb } = await import('./provider-reviews-db');
    const fallbackReview = ProviderReviewsDb.addReview(hostId, payload);
    return { data: fallbackReview, success: true };
  },
};

