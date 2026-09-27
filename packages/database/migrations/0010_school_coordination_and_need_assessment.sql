-- ==============================================================================
-- 0010_school_coordination_and_need_assessment.sql
-- Migration: School Support, Inquiry Coordination & S1-S8 Need Assessment
-- Project: CAPPINNO Mobility Nexus (EMaaS) - PKG-03 (100% Free First Year)
-- ==============================================================================

-- 1. School Coordination Status (Tracking Institutional Support Process)
CREATE TABLE IF NOT EXISTS school_coordination_status (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    school_oid VARCHAR(20),
    school_city VARCHAR(100),
    contact_name VARCHAR(150),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    accreditation_status VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN',
    status VARCHAR(30) NOT NULL DEFAULT 'NEW_REGISTRATION' 
        CHECK (status IN ('NEW_REGISTRATION', 'IN_REVIEW', 'MEETING_SCHEDULED', 'CONSORTIUM_MATCHED', 'APPLICATION_READY', 'MOBILITY_ACTIVE')),
    assigned_coordinator_id VARCHAR(100) DEFAULT 'coord-cappinno',
    assigned_coordinator_name VARCHAR(150) DEFAULT 'CAPPINNO Destek Ekibi',
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    notes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_school_coordination_status_updated_at
    BEFORE UPDATE ON school_coordination_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_scs_school_id ON school_coordination_status(school_id);
CREATE INDEX IF NOT EXISTS idx_scs_status ON school_coordination_status(status);

-- 2. School S1-S8 Need Assessment (Radar Dimensions & Readiness Evaluation)
CREATE TABLE IF NOT EXISTS school_need_assessment (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL,
    -- S1-S8 Dimensions (0-100 scores)
    s1_accreditation_alignment INTEGER NOT NULL DEFAULT 60, -- Akreditasyon ve Erasmus Plan Uyumu
    s2_host_matching_gap INTEGER NOT NULL DEFAULT 40,       -- Ev Sahibi Ağı & Eşleştirme İhtiyacı
    s3_grant_budget_capacity INTEGER NOT NULL DEFAULT 50,   -- Hibe Yönetimi & Bütçe Büyüklüğü
    s4_participant_prep_level INTEGER NOT NULL DEFAULT 45,  -- Katılımcı Dil ve Kültürel Hazırlık
    s5_learning_agreement_quality INTEGER NOT NULL DEFAULT 55, -- ESCO/ECVET Öğrenme Çıktıları
    s6_risk_and_inclusion INTEGER NOT NULL DEFAULT 70,      -- İçerme Desteği & Risk Yönetimi
    s7_consortium_synergy INTEGER NOT NULL DEFAULT 65,      -- Konsorsiyum Ortaklık İhtiyacı
    s8_green_and_digital_shift INTEGER NOT NULL DEFAULT 50, -- Yeşil Seyahat ve Dijitalleşme
    overall_readiness_score INTEGER NOT NULL DEFAULT 54,    -- 0-100 Genel Hazırlık Puanı
    recommended_path VARCHAR(50) NOT NULL DEFAULT 'CONSORTIUM_SUPPORT', 
    evaluation_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_school_need_assessment_updated_at
    BEFORE UPDATE ON school_need_assessment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_sna_school_id ON school_need_assessment(school_id);

-- 3. Coordination Activity Log (Coordinator Call Notes, Action Items & Status Transitions)
CREATE TABLE IF NOT EXISTS coordination_activity_log (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL,
    inquiry_id VARCHAR(100),
    coordinator_id VARCHAR(100) NOT NULL DEFAULT 'coord-cappinno',
    coordinator_name VARCHAR(150) NOT NULL DEFAULT 'CAPPINNO Destek Ekibi',
    activity_type VARCHAR(50) NOT NULL DEFAULT 'PHONE_CALL'
        CHECK (activity_type IN ('PHONE_CALL', 'ONLINE_MEETING', 'NOTE', 'CONSORTIUM_ASSIGNMENT', 'STATUS_CHANGE')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    previous_status VARCHAR(30),
    new_status VARCHAR(30),
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cal_school_id ON coordination_activity_log(school_id);
CREATE INDEX IF NOT EXISTS idx_cal_created_at ON coordination_activity_log(created_at DESC);

-- ==============================================================================
-- Initial Seeding for Demo Schools & Coordination Records
-- ==============================================================================

INSERT INTO school_coordination_status (id, school_id, school_name, school_oid, school_city, contact_name, contact_email, accreditation_status, status)
VALUES
('scs-01', 'org-oibmtal', 'OİB Mesleki ve Teknik Anadolu Lisesi', 'E10123456', 'Bursa', 'Metin Demir', 'm.demir@oibmtal.k12.tr', 'YES', 'MEETING_SCHEDULED'),
('scs-02', 'org-haydarpasa', 'Haydarpaşa Mesleki ve Teknik Anadolu Lisesi', 'E10294821', 'İstanbul', 'Ayşe Kaya', 'a.kaya@haydarpasa.k12.tr', 'NO', 'IN_REVIEW'),
('scs-03', 'org-etimesgut', 'Cezeri Yeşil Teknoloji MTAL', 'E10384729', 'Ankara', 'Bülent Yılmaz', 'b.yilmaz@cezeri.k12.tr', 'YES', 'CONSORTIUM_MATCHED'),
('scs-04', 'org-bornova', 'Bornova Mazhar Zorlu MTAL', 'E10492837', 'İzmir', 'Selin Aktaş', 's.aktas@mazharzorlu.k12.tr', 'NO', 'NEW_REGISTRATION')
ON CONFLICT (id) DO NOTHING;

INSERT INTO school_need_assessment (id, school_id, s1_accreditation_alignment, s2_host_matching_gap, s3_grant_budget_capacity, s4_participant_prep_level, s5_learning_agreement_quality, s6_risk_and_inclusion, s7_consortium_synergy, s8_green_and_digital_shift, overall_readiness_score, recommended_path, evaluation_summary)
VALUES
('sna-01', 'org-oibmtal', 90, 85, 80, 75, 85, 90, 70, 85, 83, 'KA121_BUDGET_REQUEST', 'Akredite kurum, yüksek hibe potansiyeline sahip. Otomotiv ve batarya teknolojilerinde Almanya ev sahipliği önerilmektedir.'),
('sna-02', 'org-haydarpasa', 35, 75, 50, 60, 65, 70, 85, 60, 62, 'KA122_SHORT_TERM', 'İlk kez münferit başvuru yapacak okul. Konsorsiyum desteği ve ihtiyaç analizi güçlendirilmelidir.'),
('sna-03', 'org-etimesgut', 95, 90, 85, 80, 90, 85, 90, 95, 89, 'CONSORTIUM_PARTNER', 'Yeşil beceriler ve yenilenebilir enerjide öncü akredite okul. Doğrudan uluslararası konsorsiyum lideri yapılabilir.'),
('sna-04', 'org-bornova', 40, 80, 45, 50, 55, 65, 80, 55, 58, 'ACCREDITATION_PREP', 'Endüstriyel otomasyon alanında güçlü ancak akreditasyon hazırlığı ve ev sahibi ağı desteği gerekmektedir.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO coordination_activity_log (id, school_id, title, content, activity_type)
VALUES
('cal-01', 'org-oibmtal', 'İlk Tanışma ve İhtiyaç Görüşmesi', 'Okul koordinatörü Metin Bey ile görüşüldü. 15 öğrenci ve 3 öğretmen için Almanya ve İspanya staj talebi mevcut. 2026 KA121 çağrısına dahil edilecek.', 'PHONE_CALL'),
('cal-02', 'org-haydarpasa', 'KA122 Başvuru Destek Toplantısı', 'Okulun akreditasyonu olmadığı için kısa dönemli hareketlilik başvuru taslağı üzerinde çalışılıyor. Çevrim içi randevu planlandı.', 'ONLINE_MEETING');
