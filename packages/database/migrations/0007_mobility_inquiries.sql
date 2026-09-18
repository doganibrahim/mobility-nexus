-- ==============================================================================
-- 0007_mobility_inquiries.sql
-- Migration: Mobility Inquiries, School-Host Placement Requests & Messages
-- Project: CAPPINNO Mobility Nexus (EMaaS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS mobility_inquiries (
    id VARCHAR(100) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_mock BOOLEAN NOT NULL DEFAULT FALSE,
    -- Sending School Details
    school_name VARCHAR(255) NOT NULL,
    school_city VARCHAR(100) NOT NULL,
    school_oid VARCHAR(20) NOT NULL,
    school_contact_name VARCHAR(150),
    school_contact_email VARCHAR(255),
    project_type VARCHAR(20) NOT NULL CHECK (project_type IN ('KA121', 'KA122')),
    -- Target European Host Details
    host_id VARCHAR(100) NOT NULL,
    host_name VARCHAR(255) NOT NULL,
    host_country VARCHAR(10) NOT NULL,
    -- Placement Parameters
    vet_field VARCHAR(255) NOT NULL,
    isced_code VARCHAR(20),
    participant_count INTEGER NOT NULL DEFAULT 1,
    accompanying_persons_count INTEGER NOT NULL DEFAULT 0,
    duration_days INTEGER NOT NULL DEFAULT 14,
    target_start_date DATE NOT NULL,
    target_end_date DATE NOT NULL,
    logistics_required JSONB NOT NULL DEFAULT '{"accommodation": true, "meals": true, "transfers": false}'::jsonb,
    -- Inquiry Message & Response
    notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REVISED', 'DECLINED')),
    host_reply_note TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_mobility_inquiries_updated_at
    BEFORE UPDATE ON mobility_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_inquiries_school_oid ON mobility_inquiries(school_oid);
CREATE INDEX IF NOT EXISTS idx_inquiries_host_id ON mobility_inquiries(host_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON mobility_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON mobility_inquiries(created_at DESC);
