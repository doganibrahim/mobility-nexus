-- ==============================================================================
-- 0012_mobility_dossier_and_document_export.sql
-- Migration: Official Mobility Dossier & Formal Document Export Engine (PKG-05)
-- Project: CAPPINNO Mobility Nexus (EMaaS)
-- ==============================================================================

-- 1. Mobility Dossier (Consolidated mobility file linking school, host, participants and ESCO competencies)
CREATE TABLE IF NOT EXISTS mobility_dossier (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    school_oid VARCHAR(20),
    school_city VARCHAR(100),
    host_id VARCHAR(100),
    host_name VARCHAR(255) NOT NULL,
    host_country VARCHAR(100) NOT NULL,
    host_city VARCHAR(100),
    host_contact_email VARCHAR(255),
    mobility_code VARCHAR(50) NOT NULL,
    mobility_type VARCHAR(50) NOT NULL DEFAULT 'VET_SHORT_TERM'
        CHECK (mobility_type IN (
            'VET_SHORT_TERM',
            'VET_LONG_TERM_PRO',
            'JOB_SHADOWING',
            'TEACHING_ASSIGNMENT',
            'VET_SKILLS_COMPETITION'
        )),
    vet_field_name VARCHAR(150) NOT NULL,
    isced_code VARCHAR(20) NOT NULL,
    esco_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    participant_count INTEGER NOT NULL DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 14,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'EXPORTED', 'ARCHIVED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_mobility_dossier_updated_at
    BEFORE UPDATE ON mobility_dossier
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_mobility_dossier_school ON mobility_dossier(school_id);
CREATE INDEX IF NOT EXISTS idx_mobility_dossier_code ON mobility_dossier(mobility_code);

-- 2. Dossier Official Documents (Learning Agreement, Europass Mobility, Inter-institutional Agreement)
CREATE TABLE IF NOT EXISTS dossier_document (
    id VARCHAR(100) PRIMARY KEY,
    dossier_id VARCHAR(100) NOT NULL REFERENCES mobility_dossier(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL
        CHECK (document_type IN (
            'LEARNING_AGREEMENT',
            'EUROPASS_MOBILITY',
            'INTER_INSTITUTIONAL_AGREEMENT',
            'QUALITY_COMMITMENT'
        )),
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'READY'
        CHECK (status IN ('DRAFT', 'READY', 'GENERATED', 'SIGNED')),
    template_version VARCHAR(50) NOT NULL DEFAULT 'EC_2026_OFFICIAL',
    file_format VARCHAR(20) NOT NULL DEFAULT 'PDF'
        CHECK (file_format IN ('PDF', 'DOCX', 'JSON')),
    document_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_exported_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_dossier_doc_type UNIQUE(dossier_id, document_type)
);

CREATE TRIGGER trg_dossier_document_updated_at
    BEFORE UPDATE ON dossier_document
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_dossier_document_dossier ON dossier_document(dossier_id);
CREATE INDEX IF NOT EXISTS idx_dossier_document_type ON dossier_document(document_type);

-- 3. Export Activity Log (Audit trail for official document exports)
CREATE TABLE IF NOT EXISTS export_log (
    id VARCHAR(100) PRIMARY KEY,
    dossier_id VARCHAR(100) NOT NULL REFERENCES mobility_dossier(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    exporter_user_id VARCHAR(100),
    exporter_name VARCHAR(150) NOT NULL DEFAULT 'Okul Koordinatörü',
    export_format VARCHAR(20) NOT NULL DEFAULT 'PDF',
    file_name VARCHAR(255) NOT NULL,
    file_size_kb INTEGER DEFAULT 145,
    exported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_export_log_dossier ON export_log(dossier_id);
CREATE INDEX IF NOT EXISTS idx_export_log_exported_at ON export_log(exported_at);
