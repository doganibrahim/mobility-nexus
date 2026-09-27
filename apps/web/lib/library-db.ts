import fs from 'fs/promises';
import path from 'path';
import {
  LibraryCategory,
  CreateLibraryCategoryDto,
  CmsContentRevision,
  CreateCmsRevisionDto,
} from '@mobility-nexus/types';

export interface LibraryDocument {
  id: string;
  titleTr: string;
  titleEn: string;
  category: 'FORMS' | 'GUIDES' | 'TEMPLATES' | 'LEGAL' | 'OFFICIAL' | string;
  fileFormat: 'PDF' | 'DOCX' | 'XLSX' | 'ZIP' | 'LINK';
  fileSize?: string;
  downloadUrl: string;
  descriptionTr: string;
  descriptionEn: string;
  tags: string[];
  isFeatured?: boolean;
  publishedAt: string;
  updatedAt: string;
}

export interface CreateLibraryDocumentDto {
  titleTr: string;
  titleEn?: string;
  category: 'FORMS' | 'GUIDES' | 'TEMPLATES' | 'LEGAL' | 'OFFICIAL' | string;
  fileFormat: 'PDF' | 'DOCX' | 'XLSX' | 'ZIP' | 'LINK';
  fileSize?: string;
  downloadUrl: string;
  descriptionTr: string;
  descriptionEn?: string;
  tags?: string[];
  isFeatured?: boolean;
}

const DOCS_FILE_PATH = path.join(process.cwd(), 'data', 'library_documents.json');
const CATS_FILE_PATH = path.join(process.cwd(), 'data', 'library_categories.json');
const REVS_FILE_PATH = path.join(process.cwd(), 'data', 'cms_revisions.json');

const INITIAL_CATEGORIES: LibraryCategory[] = [
  {
    id: 'cat-forms',
    code: 'FORMS',
    nameTr: 'Resmi Başvuru Formları & Web Form Rehberleri',
    nameEn: 'Official Application Forms & Web Form Guidelines',
    slug: 'forms',
    descriptionTr: 'KA121 akredite bütçe talebi ve KA122 kısa dönemli form kılavuzları.',
    descriptionEn: 'Official field explanations for Erasmus+ web applications.',
    icon: 'FileText',
    colorBadge: 'blue',
    orderIndex: 1,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-guides',
    code: 'GUIDES',
    nameTr: 'Uygulama, Konsorsiyum ve Kalite Standartları',
    nameEn: 'Implementation, Consortium & Quality Standards',
    slug: 'guides',
    descriptionTr: 'Erasmus kalite standartları, konsorsiyum yönetim el kitapları.',
    descriptionEn: 'Quality standards and mobility implementation handbooks.',
    icon: 'BookOpen',
    colorBadge: 'emerald',
    orderIndex: 2,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-templates',
    code: 'TEMPLATES',
    nameTr: 'Resmi Sözleşme ve Öğrenme Anlaşması Şablonları',
    nameEn: 'Official Learning Agreement & Contract Templates',
    slug: 'templates',
    descriptionTr: 'Learning Agreement VET, Kurumlararası Sözleşme ve Europass belgeleri.',
    descriptionEn: 'Tripartite agreements and mobility validation templates.',
    icon: 'Layers',
    colorBadge: 'purple',
    orderIndex: 3,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-legal',
    code: 'LEGAL',
    nameTr: 'Hukuki Metinler, KVKK ve Katılım Koşulları',
    nameEn: 'Legal Texts, GDPR & Participation Terms',
    slug: 'legal',
    descriptionTr: 'Platform veri işleme, tekil katılım koşulları ve açık rıza beyanları.',
    descriptionEn: 'Data governance and institutional participation agreements.',
    icon: 'ShieldCheck',
    colorBadge: 'amber',
    orderIndex: 4,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-official',
    code: 'OFFICIAL',
    nameTr: 'Avrupa Komisyonu Program Rehberleri',
    nameEn: 'European Commission Programme Guides',
    slug: 'official',
    descriptionTr: 'Her çağrı dönemi için yayımlanan resmi Erasmus+ kurallar el kitabı.',
    descriptionEn: 'Official Commission handbook and unit cost matrices.',
    icon: 'Sparkles',
    colorBadge: 'indigo',
    orderIndex: 5,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

const INITIAL_DOCUMENTS: LibraryDocument[] = [
  {
    id: 'doc-ka121-guide',
    titleTr: 'KA121-VET Akredite Kurumlar Yıllık Hibe ve Bütçe Talep Formu Kılavuzu',
    titleEn: 'KA121-VET Annual Grant Allocation Form & Budget Rules Official Guide',
    category: 'FORMS',
    fileFormat: 'PDF',
    fileSize: '2.4 MB',
    downloadUrl: '/guides/ka121-vet-guide-2026.pdf',
    descriptionTr: 'Erasmus Akreditasyonu sahibi mesleki eğitim kurumlarının her çağrı yılında resmi form üzerinde doldurduğu alanlar, hibe hesaplama ve seyahat matrisleri.',
    descriptionEn: 'Official section-by-section guidelines for accredited VET organisations requesting annual mobility budget allocations.',
    tags: ['KA121', 'VET', 'Akreditasyon', 'Bütçe'],
    isFeatured: true,
    publishedAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'doc-ka122-guide',
    titleTr: 'KA122-VET Kısa Dönemli Öğrenici ve Personel Hareketliliği Başvuru Kılavuzu',
    titleEn: 'KA122-VET Short-Term Mobility of Learners and Staff Application Guidelines',
    category: 'FORMS',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    downloadUrl: '/guides/ka122-vet-guide-2026.pdf',
    descriptionTr: 'İlk kez veya münferit başvuru yapacak okullar için proje hedefleri, ihtiyaç analizi, seçim kriterleri ve risk yönetimi rehberi.',
    descriptionEn: 'Comprehensive guide for schools applying for short-term European learner internships and staff training.',
    tags: ['KA122', 'VET', 'Başvuru', 'İlk Başvuru'],
    isFeatured: true,
    publishedAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-03-05T10:00:00.000Z',
  },
  {
    id: 'doc-learning-agreement-template',
    titleTr: 'Resmi Avrupa Komisyonu VET Learning Agreement (Öğrenme Anlaşması) Şablonu',
    titleEn: 'Official European Commission VET Learning Agreement Master Template',
    category: 'TEMPLATES',
    fileFormat: 'DOCX',
    fileSize: '480 KB',
    downloadUrl: '/templates/erasmus-vet-learning-agreement-template.docx',
    descriptionTr: 'Gönderen okul, ev sahibi işletme ve öğrenici arasında imzalanması zorunlu olan EQF ve ECVET uyumlu resmi öğrenme sözleşmesi şablonu.',
    descriptionEn: 'Standard tripartite learning agreement required for all VET work-based learning and internships abroad.',
    tags: ['Learning Agreement', 'ECVET', 'EQF', 'Staj Sözleşmesi'],
    isFeatured: true,
    publishedAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'doc-europass-mobility-sample',
    titleTr: 'Europass Mobility Belgesi Doldurma ve Yetkinlik Doğrulama Rehberi',
    titleEn: 'Europass Mobility Document Issuance and Skills Validation Guide',
    category: 'TEMPLATES',
    fileFormat: 'PDF',
    fileSize: '1.2 MB',
    downloadUrl: '/templates/europass-mobility-sample-guide.pdf',
    descriptionTr: 'Yurtdışı stajı tamamlayan öğrencilerin mesleki becerilerini Avrupa düzeyinde belgeleyen Europass hareketlilik kayıt rehberi.',
    descriptionEn: 'Field-level guide for issuing official Europass Mobility certificates recognizing European internship outcomes.',
    tags: ['Europass', 'Sertifika', 'Kazanım Doğrulama'],
    isFeatured: false,
    publishedAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'doc-erasmus-programme-guide',
    titleTr: '2026-2027 Erasmus+ Resmi Program Rehberi (Avrupa Komisyonu)',
    titleEn: '2026-2027 Official Erasmus+ Programme Guide (European Commission)',
    category: 'OFFICIAL',
    fileFormat: 'PDF',
    fileSize: '6.8 MB',
    downloadUrl: 'https://erasmus-plus.ec.europa.eu/programme-guide/erasmusplus-programme-guide',
    descriptionTr: 'Tüm Erasmus+ sektörlerini kapsayan resmi kurallar, öncelikler, hibe oranları ve uygunluk kriterleri ana el kitabı.',
    descriptionEn: 'The definitive European Commission rulebook covering all key actions, grant unit costs, and accreditation criteria.',
    tags: ['Program Rehberi', 'Resmi', 'Avrupa Komisyonu'],
    isFeatured: true,
    publishedAt: '2025-11-20T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'doc-budget-calculator-matrix',
    titleTr: '2026 Erasmus+ Mesleki Eğitim Birim Maliyet & Seyahat Bütçesi Hesaplayıcı',
    titleEn: '2026 Erasmus+ VET Unit Cost & Travel Distance Budget Calculator Matrix',
    category: 'TEMPLATES',
    fileFormat: 'XLSX',
    fileSize: '320 KB',
    downloadUrl: '/templates/erasmus-vet-budget-calculator-2026.xlsx',
    descriptionTr: 'Mesafe bandı, yeşil seyahat ek hibesi ve bireysel destek harcırahlarını otomatik hesaplayan resmi formül tablosu.',
    descriptionEn: 'Pre-formulated Excel spreadsheet calculating travel distances, individual daily allowances, and green travel top-ups.',
    tags: ['Bütçe', 'Mesafe Bandı', 'Harcırah', 'Yeşil Seyahat'],
    isFeatured: false,
    publishedAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-02-15T10:00:00.000Z',
  },
];

const INITIAL_REVISIONS: CmsContentRevision[] = [
  {
    id: 'rev-init-01',
    entityType: 'LIBRARY_RESOURCE',
    entityId: 'doc-ka121-guide',
    entityTitle: 'KA121-VET Akredite Kurumlar Yıllık Hibe ve Bütçe Talep Formu Kılavuzu',
    action: 'CREATE',
    authorId: 'admin-cappinno',
    authorName: 'Platform Admin',
    authorRole: 'PLATFORM_ADMIN',
    changesSummary: 'Sistem başlangıç kütüphane dokümanı yüklendi ve yayına alındı.',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'rev-init-02',
    entityType: 'COURSE',
    entityId: 'crs-muc-01',
    entityTitle: 'Endüstri 4.0 ve Yapay Zeka Odaklı Mesleki Eğitimcisi Kursu',
    action: 'CREATE',
    authorId: 'admin-cappinno',
    authorName: 'Platform Admin',
    authorRole: 'PLATFORM_ADMIN',
    changesSummary: 'Bavaria VET Academy için ilk resmi eğitim kursu tanımlandı.',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
];

let docMemoryStore: LibraryDocument[] = [...INITIAL_DOCUMENTS];
let catMemoryStore: LibraryCategory[] = [...INITIAL_CATEGORIES];
let revMemoryStore: CmsContentRevision[] = [...INITIAL_REVISIONS];

// Helpers for reading/writing JSON data
async function readDocsFromFile(): Promise<LibraryDocument[]> {
  try {
    const content = await fs.readFile(DOCS_FILE_PATH, 'utf-8');
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      docMemoryStore = data;
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await writeDocsToFile(docMemoryStore);
    }
  }
  return docMemoryStore;
}

async function writeDocsToFile(data: LibraryDocument[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DOCS_FILE_PATH), { recursive: true });
    await fs.writeFile(DOCS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing library docs to file:', err);
  }
}

async function readCatsFromFile(): Promise<LibraryCategory[]> {
  try {
    const content = await fs.readFile(CATS_FILE_PATH, 'utf-8');
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      catMemoryStore = data;
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await writeCatsToFile(catMemoryStore);
    }
  }
  return catMemoryStore;
}

async function writeCatsToFile(data: LibraryCategory[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(CATS_FILE_PATH), { recursive: true });
    await fs.writeFile(CATS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing library categories to file:', err);
  }
}

async function readRevsFromFile(): Promise<CmsContentRevision[]> {
  try {
    const content = await fs.readFile(REVS_FILE_PATH, 'utf-8');
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      revMemoryStore = data;
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await writeRevsToFile(revMemoryStore);
    }
  }
  return revMemoryStore;
}

async function writeRevsToFile(data: CmsContentRevision[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(REVS_FILE_PATH), { recursive: true });
    await fs.writeFile(REVS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing CMS revisions to file:', err);
  }
}

export const LibraryDb = {
  // ---------------------------------------------------------------------------
  // Documents
  // ---------------------------------------------------------------------------
  async getAllDocuments(category?: string): Promise<LibraryDocument[]> {
    await readDocsFromFile();
    if (!category || category === 'ALL') {
      return [...docMemoryStore];
    }
    return docMemoryStore.filter((d) => d.category.toUpperCase() === category.toUpperCase());
  },

  async getDocumentById(id: string): Promise<LibraryDocument | null> {
    await readDocsFromFile();
    return docMemoryStore.find((d) => d.id === id) || null;
  },

  async createDocument(dto: CreateLibraryDocumentDto): Promise<LibraryDocument> {
    await readDocsFromFile();
    const id = `doc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newDoc: LibraryDocument = {
      id,
      titleTr: dto.titleTr,
      titleEn: dto.titleEn || dto.titleTr,
      category: dto.category,
      fileFormat: dto.fileFormat,
      fileSize: dto.fileSize || '1.0 MB',
      downloadUrl: dto.downloadUrl,
      descriptionTr: dto.descriptionTr,
      descriptionEn: dto.descriptionEn || dto.descriptionTr,
      tags: dto.tags || ['Erasmus+'],
      isFeatured: !!dto.isFeatured,
      publishedAt: now,
      updatedAt: now,
    };

    docMemoryStore.unshift(newDoc);
    await writeDocsToFile(docMemoryStore);

    // Record CMS revision
    await this.logRevision({
      entityType: 'LIBRARY_RESOURCE',
      entityId: newDoc.id,
      entityTitle: newDoc.titleTr,
      action: 'CREATE',
      changesSummary: `Yeni ${newDoc.fileFormat} dokümanı yüklendi ve ${newDoc.category} kategorisinde yayına alındı.`,
      payloadAfter: newDoc as any,
    });

    return newDoc;
  },

  async updateDocument(id: string, dto: Partial<CreateLibraryDocumentDto>): Promise<LibraryDocument | null> {
    await readDocsFromFile();
    const index = docMemoryStore.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const existing = docMemoryStore[index];
    const updated: LibraryDocument = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    docMemoryStore[index] = updated;
    await writeDocsToFile(docMemoryStore);

    // Record CMS revision
    await this.logRevision({
      entityType: 'LIBRARY_RESOURCE',
      entityId: id,
      entityTitle: updated.titleTr,
      action: 'UPDATE',
      changesSummary: `Doküman güncellendi (${Object.keys(dto).join(', ')} alanları revize edildi).`,
      payloadBefore: existing as any,
      payloadAfter: updated as any,
    });

    return updated;
  },

  async deleteDocument(id: string): Promise<boolean> {
    await readDocsFromFile();
    const existing = docMemoryStore.find((d) => d.id === id);
    if (!existing) return false;

    docMemoryStore = docMemoryStore.filter((d) => d.id !== id);
    await writeDocsToFile(docMemoryStore);

    // Record CMS revision
    await this.logRevision({
      entityType: 'LIBRARY_RESOURCE',
      entityId: id,
      entityTitle: existing.titleTr,
      action: 'DELETE',
      changesSummary: `Doküman kütüphaneden ve yayından kaldırıldı.`,
      payloadBefore: existing as any,
    });

    return true;
  },

  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------
  async getAllCategories(): Promise<LibraryCategory[]> {
    await readCatsFromFile();
    return [...catMemoryStore].sort((a, b) => a.orderIndex - b.orderIndex);
  },

  async getCategoryById(id: string): Promise<LibraryCategory | null> {
    await readCatsFromFile();
    return catMemoryStore.find((c) => c.id === id || c.code === id) || null;
  },

  async createCategory(dto: CreateLibraryCategoryDto): Promise<LibraryCategory> {
    await readCatsFromFile();
    const now = new Date().toISOString();
    const id = `cat-${dto.slug || dto.code.toLowerCase()}-${Date.now().toString(36)}`;

    const newCat: LibraryCategory = {
      id,
      code: dto.code.toUpperCase(),
      nameTr: dto.nameTr,
      nameEn: dto.nameEn,
      slug: dto.slug || dto.code.toLowerCase(),
      descriptionTr: dto.descriptionTr || null,
      descriptionEn: dto.descriptionEn || null,
      icon: dto.icon || 'FileText',
      colorBadge: dto.colorBadge || 'blue',
      orderIndex: dto.orderIndex ?? (catMemoryStore.length + 1),
      isActive: dto.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    catMemoryStore.push(newCat);
    await writeCatsToFile(catMemoryStore);

    await this.logRevision({
      entityType: 'CATEGORY',
      entityId: newCat.id,
      entityTitle: newCat.nameTr,
      action: 'CREATE',
      changesSummary: `Yeni kategori oluşturuldu (${newCat.code} - ${newCat.nameTr}).`,
      payloadAfter: newCat as any,
    });

    return newCat;
  },

  async updateCategory(id: string, dto: Partial<CreateLibraryCategoryDto>): Promise<LibraryCategory | null> {
    await readCatsFromFile();
    const index = catMemoryStore.findIndex((c) => c.id === id || c.code === id);
    if (index === -1) return null;

    const existing = catMemoryStore[index];
    const updated: LibraryCategory = {
      ...existing,
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : existing.code,
      updatedAt: new Date().toISOString(),
    };

    catMemoryStore[index] = updated;
    await writeCatsToFile(catMemoryStore);

    await this.logRevision({
      entityType: 'CATEGORY',
      entityId: id,
      entityTitle: updated.nameTr,
      action: 'UPDATE',
      changesSummary: `Kategori tanımı güncellendi.`,
      payloadBefore: existing as any,
      payloadAfter: updated as any,
    });

    return updated;
  },

  async deleteCategory(id: string): Promise<boolean> {
    await readCatsFromFile();
    const existing = catMemoryStore.find((c) => c.id === id || c.code === id);
    if (!existing) return false;

    catMemoryStore = catMemoryStore.filter((c) => c.id !== id && c.code !== id);
    await writeCatsToFile(catMemoryStore);

    await this.logRevision({
      entityType: 'CATEGORY',
      entityId: id,
      entityTitle: existing.nameTr,
      action: 'DELETE',
      changesSummary: `Kategori kaldırıldı (${existing.nameTr}).`,
      payloadBefore: existing as any,
    });

    return true;
  },

  // ---------------------------------------------------------------------------
  // Revision History / Audit Trail
  // ---------------------------------------------------------------------------
  async logRevision(dto: CreateCmsRevisionDto): Promise<CmsContentRevision> {
    await readRevsFromFile();
    const id = `rev-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newRev: CmsContentRevision = {
      id,
      entityType: dto.entityType,
      entityId: dto.entityId,
      entityTitle: dto.entityTitle,
      action: dto.action,
      authorId: dto.authorId || 'admin-cappinno',
      authorName: dto.authorName || 'Platform Admin',
      authorRole: dto.authorRole || 'PLATFORM_ADMIN',
      changesSummary: dto.changesSummary,
      payloadBefore: dto.payloadBefore || null,
      payloadAfter: dto.payloadAfter || null,
      createdAt: new Date().toISOString(),
    };

    revMemoryStore.unshift(newRev);
    // Keep max 200 revisions in memory/file
    if (revMemoryStore.length > 200) {
      revMemoryStore = revMemoryStore.slice(0, 200);
    }
    await writeRevsToFile(revMemoryStore);
    return newRev;
  },

  async getAllRevisions(limit = 50): Promise<CmsContentRevision[]> {
    await readRevsFromFile();
    return revMemoryStore.slice(0, limit);
  },
};
