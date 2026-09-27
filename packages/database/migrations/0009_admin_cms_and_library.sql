-- ==============================================================================
-- 0009_admin_cms_and_library.sql
-- Migration: Admin CMS, Dynamic Content Revisions & Institutional Library
-- Project: CAPPINNO Mobility Nexus (EMaaS) - PKG-02
-- ==============================================================================

-- 1. Library Categories (Managed via Admin CMS)
CREATE TABLE IF NOT EXISTS library_category (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. FORMS, GUIDES, TEMPLATES, LEGAL, OFFICIAL
    name_tr VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description_tr TEXT,
    description_en TEXT,
    icon VARCHAR(100) NOT NULL DEFAULT 'FileText',
    color_badge VARCHAR(50) NOT NULL DEFAULT 'blue',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_library_category_updated_at
    BEFORE UPDATE ON library_category
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_lib_cat_code ON library_category(code);
CREATE INDEX IF NOT EXISTS idx_lib_cat_is_active ON library_category(is_active);

-- 2. Library Resources & Documents (Official Guides, PDF, Word, Excel Templates)
CREATE TABLE IF NOT EXISTS library_resource (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(100) REFERENCES library_category(id) ON DELETE SET NULL,
    category_code VARCHAR(50) NOT NULL, -- FK fallback or direct code
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description_tr TEXT NOT NULL,
    description_en TEXT NOT NULL,
    file_format VARCHAR(20) NOT NULL CHECK (file_format IN ('PDF', 'DOCX', 'XLSX', 'ZIP', 'LINK')),
    file_size VARCHAR(50) NOT NULL DEFAULT '1.0 MB',
    download_url TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT ARRAY['Erasmus+']::TEXT[],
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    download_count INTEGER NOT NULL DEFAULT 0,
    created_by VARCHAR(100) NOT NULL DEFAULT 'admin-cappinno',
    published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_library_resource_updated_at
    BEFORE UPDATE ON library_resource
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_lib_res_category_code ON library_resource(category_code);
CREATE INDEX IF NOT EXISTS idx_lib_res_is_published ON library_resource(is_published);
CREATE INDEX IF NOT EXISTS idx_lib_res_file_format ON library_resource(file_format);

-- 3. CMS Content Revision (Audit Trail for Course, Session & Document Mutations)
CREATE TABLE IF NOT EXISTS cms_content_revision (
    id VARCHAR(100) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('COURSE', 'COURSE_SESSION', 'JOB_SHADOWING', 'LIBRARY_RESOURCE', 'CATEGORY')),
    entity_id VARCHAR(100) NOT NULL,
    entity_title VARCHAR(255) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'ARCHIVE')),
    author_id VARCHAR(100) NOT NULL DEFAULT 'admin-cappinno',
    author_name VARCHAR(150) NOT NULL DEFAULT 'Platform Admin',
    author_role VARCHAR(50) NOT NULL DEFAULT 'PLATFORM_ADMIN',
    changes_summary TEXT NOT NULL,
    payload_before JSONB,
    payload_after JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cms_rev_entity ON cms_content_revision(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_cms_rev_created_at ON cms_content_revision(created_at DESC);

-- ==============================================================================
-- Initial Seeding for Library Categories & Official Resources
-- ==============================================================================

INSERT INTO library_category (id, code, name_tr, name_en, slug, description_tr, description_en, icon, color_badge, order_index)
VALUES
('cat-forms', 'FORMS', 'Resmi Başvuru Formları & Web Form Rehberleri', 'Official Application Forms & Web Form Guidelines', 'forms', 'KA121 akredite bütçe talebi ve KA122 kısa dönemli form kılavuzları.', 'Official field explanations for Erasmus+ web applications.', 'FileText', 'blue', 1),
('cat-guides', 'GUIDES', 'Uygulama, Konsorsiyum ve Kalite Standartları', 'Implementation, Consortium & Quality Standards', 'guides', 'Erasmus kalite standartları, konsorsiyum yönetim el kitapları.', 'Quality standards and mobility implementation handbooks.', 'BookOpen', 'emerald', 2),
('cat-templates', 'TEMPLATES', 'Resmi Sözleşme ve Öğrenme Anlaşması Şablonları', 'Official Learning Agreement & Contract Templates', 'templates', 'Learning Agreement VET, Kurumlararası Sözleşme ve Europass belgeleri.', 'Tripartite agreements and mobility validation templates.', 'Layers', 'purple', 3),
('cat-legal', 'LEGAL', 'Hukuki Metinler, KVKK ve Katılım Koşulları', 'Legal Texts, GDPR & Participation Terms', 'legal', 'Platform veri işleme, tekil katılım koşulları ve açık rıza beyanları.', 'Data governance and institutional participation agreements.', 'ShieldCheck', 'amber', 4),
('cat-official', 'OFFICIAL', 'Avrupa Komisyonu Program Rehberleri', 'European Commission Programme Guides', 'official', 'Her çağrı dönemi için yayımlanan resmi Erasmus+ kurallar el kitabı.', 'Official Commission handbook and unit cost matrices.', 'Sparkles', 'indigo', 5)
ON CONFLICT (id) DO NOTHING;

-- Initial Resources Seeding
INSERT INTO library_resource (id, category_code, title_tr, title_en, description_tr, description_en, file_format, file_size, download_url, tags, is_featured)
VALUES
('doc-ka121-guide', 'FORMS', 'KA121-VET Akredite Kurumlar Yıllık Hibe ve Bütçe Talep Formu Kılavuzu', 'KA121-VET Annual Grant Allocation Form & Budget Rules Official Guide', 'Erasmus Akreditasyonu sahibi mesleki eğitim kurumlarının her çağrı yılında resmi form üzerinde doldurduğu alanlar, hibe hesaplama ve seyahat matrisleri.', 'Official section-by-section guidelines for accredited VET organisations requesting annual mobility budget allocations.', 'PDF', '2.4 MB', '/guides/ka121-vet-guide-2026.pdf', ARRAY['KA121', 'VET', 'Akreditasyon', 'Bütçe'], TRUE),
('doc-ka122-guide', 'FORMS', 'KA122-VET Kısa Dönemli Öğrenici ve Personel Hareketliliği Başvuru Kılavuzu', 'KA122-VET Short-Term Mobility of Learners and Staff Application Guidelines', 'İlk kez veya münferit başvuru yapacak okullar için proje hedefleri, ihtiyaç analizi, seçim kriterleri ve risk yönetimi rehberi.', 'Comprehensive guide for schools applying for short-term European learner internships and staff training.', 'PDF', '3.1 MB', '/guides/ka122-vet-guide-2026.pdf', ARRAY['KA122', 'VET', 'Başvuru', 'İlk Başvuru'], TRUE),
('doc-learning-agreement-template', 'TEMPLATES', 'Resmi Avrupa Komisyonu VET Learning Agreement (Öğrenme Anlaşması) Şablonu', 'Official European Commission VET Learning Agreement Master Template', 'Gönderen okul, ev sahibi işletme ve öğrenici arasında imzalanması zorunlu olan EQF ve ECVET uyumlu resmi öğrenme sözleşmesi şablonu.', 'Standard tripartite learning agreement required for all VET work-based learning and internships abroad.', 'DOCX', '480 KB', '/templates/erasmus-vet-learning-agreement-template.docx', ARRAY['Learning Agreement', 'ECVET', 'EQF', 'Staj Sözleşmesi'], TRUE),
('doc-erasmus-programme-guide', 'OFFICIAL', '2026-2027 Erasmus+ Resmi Program Rehberi (Avrupa Komisyonu)', '2026-2027 Official Erasmus+ Programme Guide (European Commission)', 'Tüm Erasmus+ sektörlerini kapsayan resmi kurallar, öncelikler, hibe oranları ve uygunluk kriterleri ana el kitabı.', 'The definitive European Commission rulebook covering all key actions, grant unit costs, and accreditation criteria.', 'PDF', '6.8 MB', 'https://erasmus-plus.ec.europa.eu/programme-guide/erasmusplus-programme-guide', ARRAY['Program Rehberi', 'Resmi', 'Avrupa Komisyonu'], TRUE)
ON CONFLICT (id) DO NOTHING;

-- Initial Revision Audit Seeding
INSERT INTO cms_content_revision (id, entity_type, entity_id, entity_title, action, author_name, changes_summary)
VALUES
('rev-init-01', 'LIBRARY_RESOURCE', 'doc-ka121-guide', 'KA121-VET Akredite Kurumlar Yıllık Hibe ve Bütçe Talep Formu Kılavuzu', 'CREATE', 'Platform Admin', 'Sistem başlangıç kütüphane dokümanı yüklendi ve yayına alındı.'),
('rev-init-02', 'COURSE', 'crs-muc-01', 'Endüstri 4.0 ve Yapay Zeka Odaklı Mesleki Eğitimcisi Kursu', 'CREATE', 'Platform Admin', 'Bavaria VET Academy için ilk resmi eğitim kursu tanımlandı.');
