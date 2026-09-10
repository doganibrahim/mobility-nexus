-- ==============================================================================
-- 0004_host_extended_profile.sql
-- CAPPINNO Mobility Nexus - Extended Host Profile & Erasmus+ Portfolio
-- Supports 3-Tier Progressive Profiling:
-- 1. Onboarding Quick Setup (Identity, OID, Contact + Consent)
-- 2. Public Profile & Erasmus+ Portfolio (Experience, Metrics, Sample Programme)
-- 3. Verification & Compliance / KYC (Admin Only: Reg No, Tax, Evidence, Emergency)
-- ==============================================================================

-- 1. Extend host_organisation with Tier 1 & Tier 2 & Tier 3 fields
ALTER TABLE host_organisation
    ADD COLUMN IF NOT EXISTS legal_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS trading_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS organisation_type VARCHAR(100) DEFAULT 'Company',
    ADD COLUMN IF NOT EXISTS registered_address TEXT,
    ADD COLUMN IF NOT EXISTS operational_address TEXT,
    ADD COLUMN IF NOT EXISTS year_established INT,
    ADD COLUMN IF NOT EXISTS oid VARCHAR(30),
    ADD COLUMN IF NOT EXISTS pic_number VARCHAR(30),
    ADD COLUMN IF NOT EXISTS general_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS telephone VARCHAR(50),
    ADD COLUMN IF NOT EXISTS logo_url TEXT,
    ADD COLUMN IF NOT EXISTS short_description VARCHAR(1500),
    ADD COLUMN IF NOT EXISTS detailed_profile_url TEXT,
    
    -- Contact Person Details
    ADD COLUMN IF NOT EXISTS contact_title VARCHAR(150),
    ADD COLUMN IF NOT EXISTS contact_direct_phone VARCHAR(50),
    ADD COLUMN IF NOT EXISTS contact_whatsapp VARCHAR(50),
    ADD COLUMN IF NOT EXISTS contact_linkedin TEXT,
    ADD COLUMN IF NOT EXISTS contact_languages TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS contact_photo_url TEXT,
    ADD COLUMN IF NOT EXISTS consent_public_display BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS turkey_contact_person VARCHAR(255),
    
    -- Emergency 24/7 Contacts (Admin Only)
    ADD COLUMN IF NOT EXISTS emergency_contact_person VARCHAR(150),
    ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(50),
    
    -- Legal / KYC Data (Admin Only)
    ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100),
    ADD COLUMN IF NOT EXISTS registration_document_url TEXT,
    ADD COLUMN IF NOT EXISTS tax_vat_number VARCHAR(100),
    
    -- Erasmus+ Experience Data (Public Portfolio)
    ADD COLUMN IF NOT EXISTS years_of_experience INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_participants_hosted INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS groups_hosted_last_3_years INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS sending_countries TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS turkish_groups_hosted INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS turkish_participants_hosted INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS has_ka121 BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS has_ka122 BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS has_vet_learner BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS has_staff_mobility BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS completed_projects JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS project_results_links TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS national_agency_experience TEXT,
    ADD COLUMN IF NOT EXISTS sample_mobility_programme_url TEXT,
    
    -- Experience Verification Documents (Admin Only)
    ADD COLUMN IF NOT EXISTS participant_evidence_urls TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS sample_documents_urls TEXT[] DEFAULT '{}',
    
    -- Profile Completeness Metric (0 - 100)
    ADD COLUMN IF NOT EXISTS profile_completeness_score INT DEFAULT 30;

-- 2. Create Indexes for search and matching
CREATE INDEX IF NOT EXISTS idx_host_org_oid ON host_organisation(oid);
CREATE INDEX IF NOT EXISTS idx_host_org_type ON host_organisation(organisation_type);
CREATE INDEX IF NOT EXISTS idx_host_org_completeness ON host_organisation(profile_completeness_score);

COMMENT ON COLUMN host_organisation.consent_public_display IS 'Consent flag to publicly show named contact person, photo and direct contact info';
COMMENT ON COLUMN host_organisation.registration_document_url IS 'Admin Only: Legal registration document confirming establishment';
COMMENT ON COLUMN host_organisation.participant_evidence_urls IS 'Admin Only: Evidence docs supporting declared participant numbers';
