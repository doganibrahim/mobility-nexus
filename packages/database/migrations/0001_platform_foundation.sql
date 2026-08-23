-- ==============================================================================
-- 0001_platform_foundation.sql
-- Migration: Platform Foundation, Multi-tenant Organisations & Audit Trail
-- Project: CAPPINNO Mobility Nexus (EMaaS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to handle auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ------------------------------------------------------------------------------
-- 1. Organisation (Tenant) Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organisation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    oid VARCHAR(12), -- Erasmus Organisation ID (e.g. E10234567)
    city VARCHAR(100),
    country_code VARCHAR(3) DEFAULT 'TR',
    accreditation_status VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN' 
        CHECK (accreditation_status IN ('YES', 'NO', 'UNKNOWN', 'PENDING')),
    erasmus_plan TEXT,
    institution_need TEXT,
    readiness_score SMALLINT NOT NULL DEFAULT 0 
        CHECK (readiness_score >= 0 AND readiness_score <= 100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_organisation_oid_format CHECK (
        oid IS NULL OR oid ~* '^E10[0-9]{5,7}$'
    )
);

-- Trigger for organisation updated_at
CREATE TRIGGER trg_organisation_updated_at
    BEFORE UPDATE ON organisation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_organisation_slug ON organisation(slug);
CREATE INDEX IF NOT EXISTS idx_organisation_oid ON organisation(oid);
CREATE INDEX IF NOT EXISTS idx_organisation_accreditation ON organisation(accreditation_status);
CREATE INDEX IF NOT EXISTS idx_organisation_active ON organisation(is_active);

-- ------------------------------------------------------------------------------
-- 2. Audit Trail (Immutable Log for GDPR/KVKK Compliance)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID REFERENCES organisation(id) ON DELETE SET NULL,
    user_id UUID, -- References user_account(id) (defined in 0002)
    action VARCHAR(64) NOT NULL, -- e.g., 'ORGANISATION_CREATED', 'INVITATION_SENT', 'PROFILE_UPDATED'
    resource_type VARCHAR(64) NOT NULL, -- e.g., 'organisation', 'membership', 'invitation'
    resource_id VARCHAR(128) NOT NULL,
    payload_before JSONB,
    payload_after JSONB,
    correlation_id VARCHAR(128) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for audit query performance & compliance investigations
CREATE INDEX IF NOT EXISTS idx_audit_event_org_id ON audit_event(organisation_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_user_id ON audit_event(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_correlation_id ON audit_event(correlation_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_action ON audit_event(action);
CREATE INDEX IF NOT EXISTS idx_audit_event_created_at ON audit_event(created_at DESC);

-- Comment metadata for schema documentation
COMMENT ON TABLE organisation IS 'Multi-tenant primary tenant entity for accredited and non-accredited VET institutions';
COMMENT ON TABLE audit_event IS 'Immutable audit trail logging all state mutations for GDPR/KVKK and security compliance';
