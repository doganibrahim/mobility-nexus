-- ==============================================================================
-- 0003_host_network.sql
-- Migration: Host Organisations, Capacity, Activities, Verification & Taxonomy
-- Project: CAPPINNO Mobility Nexus (EMaaS) - Sprint 2
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Reference Taxonomies (Countries & Sectors)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS country_ref (
    code VARCHAR(3) PRIMARY KEY,
    name_tr VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    flag_emoji VARCHAR(8),
    is_program_country BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sector_ref (
    code VARCHAR(50) PRIMARY KEY,
    name_tr VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    isced_field VARCHAR(20),
    icon_name VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Country Reference Data (Erasmus+ Program & Partner Nations)
INSERT INTO country_ref (code, name_tr, name_en, flag_emoji, is_program_country) VALUES
    ('TR', 'Türkiye', 'Turkey', '🇹🇷', TRUE),
    ('DE', 'Almanya', 'Germany', '🇩🇪', TRUE),
    ('FR', 'Fransa', 'France', '🇫🇷', TRUE),
    ('IT', 'İtalya', 'Italy', '🇮🇹', TRUE),
    ('ES', 'İspanya', 'Spain', '🇪🇸', TRUE),
    ('NL', 'Hollanda', 'Netherlands', '🇳🇱', TRUE),
    ('BE', 'Belçika', 'Belgium', '🇧🇪', TRUE),
    ('AT', 'Avusturya', 'Austria', '🇦🇹', TRUE),
    ('PL', 'Polonya', 'Poland', '🇵🇱', TRUE),
    ('CZ', 'Çekya', 'Czech Republic', '🇨🇿', TRUE),
    ('PT', 'Portekiz', 'Portugal', '🇵🇹', TRUE),
    ('SE', 'İsveç', 'Sweden', '🇸🇪', TRUE),
    ('HU', 'Macaristan', 'Hungary', '🇭🇺', TRUE),
    ('RO', 'Romanya', 'Romania', '🇷🇴', TRUE),
    ('IE', 'İrlanda', 'Ireland', '🇮🇪', TRUE),
    ('DK', 'Danimarka', 'Denmark', '🇩🇰', TRUE),
    ('FI', 'Finlandiya', 'Finland', '🇫🇮', TRUE),
    ('EL', 'Yunanistan', 'Greece', '🇬🇷', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Seed VET Sector Reference Data
INSERT INTO sector_ref (code, name_tr, name_en, isced_field, icon_name) VALUES
    ('ict', 'Bilişim ve Yazılım Teknolojileri', 'Information & Communication Technology', '061', 'code'),
    ('automotive', 'Otomotiv ve Raylı Sistemler', 'Automotive & Rail Systems', '0716', 'truck'),
    ('electrical', 'Elektrik, Elektronik ve Otomasyon', 'Electrical, Electronics & Automation', '0713', 'cpu'),
    ('machinery', 'Makine, Mekatronik ve İmalat', 'Machinery, Mechatronics & Manufacturing', '0714', 'settings'),
    ('health', 'Sağlık Hizmetleri ve Biyoteknoloji', 'Health Services & Biotechnology', '091', 'activity'),
    ('tourism', 'Turizm, Otelcilik ve Yiyecek-İçecek', 'Tourism, Hospitality & Catering', '1013', 'compass'),
    ('logistics', 'Ulaştırma, Lojistik ve Tedarik Zinciri', 'Logistics, Transport & Supply Chain', '1041', 'package'),
    ('green_energy', 'Yenilenebilir Enerji ve Çevre Teknolojileri', 'Renewable Energy & Green Tech', '0712', 'sun')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. Host Organisation Table (European Host Companies & Institutes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS host_organisation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    country_code VARCHAR(3) NOT NULL REFERENCES country_ref(code),
    city VARCHAR(100) NOT NULL,
    address TEXT,
    website_url VARCHAR(255),
    primary_sector VARCHAR(50) NOT NULL REFERENCES sector_ref(code),
    verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING'
        CHECK (verification_status IN ('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'NEEDS_UPDATE', 'REJECTED', 'SUSPENDED')),
    contact_person VARCHAR(150),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    languages TEXT[] NOT NULL DEFAULT '{"EN"}',
    accessibility_features JSONB NOT NULL DEFAULT '{"wheelchairAccessible": false, "specialDiet": false, "visualAid": false}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by_user_id UUID REFERENCES user_account(id) ON DELETE SET NULL,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_host_organisation_updated_at
    BEFORE UPDATE ON host_organisation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_host_org_slug ON host_organisation(slug);
CREATE INDEX IF NOT EXISTS idx_host_org_country ON host_organisation(country_code);
CREATE INDEX IF NOT EXISTS idx_host_org_sector ON host_organisation(primary_sector);
CREATE INDEX IF NOT EXISTS idx_host_org_status ON host_organisation(verification_status);
CREATE INDEX IF NOT EXISTS idx_host_org_user ON host_organisation(created_by_user_id);

-- ------------------------------------------------------------------------------
-- 3. Host Capacity Table (Term-based & Annual Capacity)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS host_capacity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES host_organisation(id) ON DELETE CASCADE,
    max_learners_per_term INT NOT NULL DEFAULT 4 CHECK (max_learners_per_term > 0),
    total_annual_capacity INT NOT NULL DEFAULT 12 CHECK (total_annual_capacity >= max_learners_per_term),
    available_terms JSONB NOT NULL DEFAULT '["AUTUMN", "SPRING", "SUMMER"]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_host_capacity UNIQUE (host_id)
);

CREATE TRIGGER trg_host_capacity_updated_at
    BEFORE UPDATE ON host_capacity
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_host_capacity_host ON host_capacity(host_id);

-- ------------------------------------------------------------------------------
-- 4. Host Activity Table (Offered VET Placement & Shadowing Opportunities)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS host_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES host_organisation(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL 
        CHECK (activity_type IN ('VET_INTERNSHIP', 'JOB_SHADOWING', 'INVITED_EXPERT', 'STUDY_VISIT')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    min_duration_days INT NOT NULL DEFAULT 10,
    max_duration_days INT NOT NULL DEFAULT 90,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_host_activity_updated_at
    BEFORE UPDATE ON host_activity
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_host_activity_host ON host_activity(host_id);
CREATE INDEX IF NOT EXISTS idx_host_activity_type ON host_activity(activity_type);

-- ------------------------------------------------------------------------------
-- 5. Host Verification & Evidence Log (15+ Audit Criteria)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS host_verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES host_organisation(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'NEEDS_UPDATE', 'REJECTED', 'SUSPENDED')),
    reviewer_id UUID REFERENCES user_account(id) ON DELETE SET NULL,
    criteria_checklist JSONB NOT NULL DEFAULT '{
        "taxRegistrationVerified": false,
        "physicalWorkplaceVerified": false,
        "occupationalSafetyStandards": false,
        "mentorAssigned": false,
        "englishMentorAvailable": false,
        "learningAgreementCompliant": false,
        "emergencyProtocolInPlace": false,
        "insuranceCoverageConfirmed": false,
        "noPastFraudHistory": true,
        "euSanctionsChecked": true,
        "workHoursCompliant": true,
        "suitableTrainingEquipment": false,
        "transportationAccessConfirmed": false,
        "evaluationFeedbackSigned": false,
        "dataProtectionCompliant": true
    }'::jsonb,
    reviewer_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_host_verification_host ON host_verification(host_id);
CREATE INDEX IF NOT EXISTS idx_host_verification_status ON host_verification(status);

COMMENT ON TABLE host_organisation IS 'European host companies, institutions and VET placement providers';
COMMENT ON TABLE host_capacity IS 'Learner capacity quotas for European host organisations';
COMMENT ON TABLE host_activity IS 'Specific internship, job shadowing and training placement activities';
COMMENT ON TABLE host_verification IS 'Audit record of 15+ criteria verification for quality control';
