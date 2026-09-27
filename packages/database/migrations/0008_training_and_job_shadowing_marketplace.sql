-- ==============================================================================
-- 0008_training_and_job_shadowing_marketplace.sql
-- Migration: Training Courses, Job Shadowing Offers & Institutional Applications
-- Project: CAPPINNO Mobility Nexus (EMaaS)
-- ==============================================================================

-- 1. Courses Table (Created and Managed by European Host Providers)
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(100) PRIMARY KEY,
    host_id VARCHAR(100) NOT NULL,
    host_name VARCHAR(255) NOT NULL,
    host_country VARCHAR(10) NOT NULL,
    host_city VARCHAR(100) NOT NULL,
    host_oid VARCHAR(20),
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description_tr TEXT NOT NULL,
    description_en TEXT NOT NULL,
    isced_code VARCHAR(20) NOT NULL,
    isced_name VARCHAR(150),
    target_audience VARCHAR(50) NOT NULL DEFAULT 'TEACHERS' CHECK (target_audience IN ('TEACHERS', 'VET_STAFF', 'TRAINERS', 'MIXED')),
    duration_days INTEGER NOT NULL DEFAULT 5,
    daily_fee_eur NUMERIC(10, 2) NOT NULL DEFAULT 80.00, -- Official Erasmus+ daily course fee rate (80 EUR/day)
    language VARCHAR(50) NOT NULL DEFAULT 'English',
    min_language_level VARCHAR(10) NOT NULL DEFAULT 'B1' CHECK (min_language_level IN ('A2', 'B1', 'B2', 'C1')),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    rating NUMERIC(2, 1) NOT NULL DEFAULT 4.8,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_courses_host_id ON courses(host_id);
CREATE INDEX IF NOT EXISTS idx_courses_isced_code ON courses(isced_code);
CREATE INDEX IF NOT EXISTS idx_courses_host_country ON courses(host_country);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);

-- 2. Course Learning Outcomes (Mapped to ESCO & ISCED)
CREATE TABLE IF NOT EXISTS course_learning_outcomes (
    id VARCHAR(100) PRIMARY KEY,
    course_id VARCHAR(100) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    outcome_tr TEXT NOT NULL,
    outcome_en TEXT NOT NULL,
    esco_skill_code VARCHAR(100),
    esco_skill_label VARCHAR(255),
    order_index INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_outcomes_course_id ON course_learning_outcomes(course_id);

-- 3. Course Sessions (Dates, Locations and Capacity Management)
CREATE TABLE IF NOT EXISTS course_sessions (
    id VARCHAR(100) PRIMARY KEY,
    course_id VARCHAR(100) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(10) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 15,
    enrolled_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'LIMITED', 'FULL', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_course_sessions_updated_at
    BEFORE UPDATE ON course_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_sessions_course_id ON course_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_sessions_dates ON course_sessions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON course_sessions(status);

-- 4. Job Shadowing Offers (Teacher Observation & Mentoring Slots)
CREATE TABLE IF NOT EXISTS job_shadowing_offers (
    id VARCHAR(100) PRIMARY KEY,
    host_id VARCHAR(100) NOT NULL,
    host_name VARCHAR(255) NOT NULL,
    country VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    vet_field VARCHAR(255) NOT NULL,
    isced_code VARCHAR(20),
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_tr TEXT NOT NULL,
    description_en TEXT NOT NULL,
    eligible_staff_types TEXT[] NOT NULL DEFAULT ARRAY['Vocational Teachers', 'Workshop Instructors']::TEXT[],
    duration_days INTEGER NOT NULL DEFAULT 5,
    max_capacity_per_slot INTEGER NOT NULL DEFAULT 4,
    languages TEXT[] NOT NULL DEFAULT ARRAY['English']::TEXT[],
    working_environment_details TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'FILLED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_job_shadowing_offers_updated_at
    BEFORE UPDATE ON job_shadowing_offers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_jso_host_id ON job_shadowing_offers(host_id);
CREATE INDEX IF NOT EXISTS idx_jso_country ON job_shadowing_offers(country);
CREATE INDEX IF NOT EXISTS idx_jso_status ON job_shadowing_offers(status);

-- 5. Marketplace Applications (Where Beneficiary School meets Host Provider)
CREATE TABLE IF NOT EXISTS marketplace_applications (
    id VARCHAR(100) PRIMARY KEY,
    application_type VARCHAR(30) NOT NULL CHECK (application_type IN ('COURSE', 'JOB_SHADOWING')),
    course_id VARCHAR(100) REFERENCES courses(id),
    session_id VARCHAR(100) REFERENCES course_sessions(id),
    job_shadowing_id VARCHAR(100) REFERENCES job_shadowing_offers(id),
    host_id VARCHAR(100) NOT NULL,
    host_name VARCHAR(255) NOT NULL,
    -- Beneficiary (Sending School) Details
    school_id VARCHAR(100),
    school_name VARCHAR(255) NOT NULL,
    school_oid VARCHAR(20) NOT NULL,
    school_city VARCHAR(100),
    contact_name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    project_type VARCHAR(20) NOT NULL CHECK (project_type IN ('KA121', 'KA122', 'NOT_YET_APPLIED')),
    participant_count INTEGER NOT NULL DEFAULT 1,
    duration_days INTEGER NOT NULL DEFAULT 5,
    total_grant_eur NUMERIC(10, 2) NOT NULL, -- Calculated: participant_count * duration_days * 80 (capped at 800 EUR/participant)
    special_notes TEXT,
    -- Host Review & Decision
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'DECLINED', 'CANCELLED')),
    host_decision_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_marketplace_applications_updated_at
    BEFORE UPDATE ON marketplace_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_mkt_apps_school_oid ON marketplace_applications(school_oid);
CREATE INDEX IF NOT EXISTS idx_mkt_apps_host_id ON marketplace_applications(host_id);
CREATE INDEX IF NOT EXISTS idx_mkt_apps_status ON marketplace_applications(status);
CREATE INDEX IF NOT EXISTS idx_mkt_apps_session_id ON marketplace_applications(session_id);
