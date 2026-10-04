-- ==============================================================================
-- 0011_participant_preparation_lms.sql
-- Migration: Participant Mobility Preparation Portal (LMS - PKG-04)
-- Project: CAPPINNO Mobility Nexus (EMaaS)
-- ==============================================================================

-- 1. Micro-learning Preparation Modules (10 Official Preparatory Modules)
CREATE TABLE IF NOT EXISTS prep_module (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_tr TEXT,
    description_en TEXT,
    category VARCHAR(50) NOT NULL 
        CHECK (category IN (
            'CULTURAL_ADAPTATION',
            'LANGUAGE_PREP',
            'OHS_SAFETY',
            'TRAVEL_LOGISTICS',
            'ERASMUS_RIGHTS',
            'GREEN_DIGITAL',
            'ESCO_LEARNING',
            'CRISIS_INSURANCE',
            'MENTORSHIP_WORKPLACE',
            'DISSEMINATION'
        )),
    estimated_duration_minutes INTEGER NOT NULL DEFAULT 20,
    order_index INTEGER NOT NULL DEFAULT 1,
    required_role VARCHAR(20) NOT NULL DEFAULT 'ALL'
        CHECK (required_role IN ('STUDENT', 'STAFF', 'ALL')),
    badge_name VARCHAR(100) NOT NULL,
    badge_icon VARCHAR(50) NOT NULL DEFAULT 'Award',
    content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    quiz_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_prep_module_updated_at
    BEFORE UPDATE ON prep_module
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_prep_module_category ON prep_module(category);
CREATE INDEX IF NOT EXISTS idx_prep_module_order ON prep_module(order_index);

-- 2. Participant Preparation Assignments
CREATE TABLE IF NOT EXISTS prep_assignment (
    id VARCHAR(100) PRIMARY KEY,
    participant_id VARCHAR(100) NOT NULL,
    participant_name VARCHAR(150) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    participant_role VARCHAR(20) NOT NULL DEFAULT 'STUDENT'
        CHECK (participant_role IN ('STUDENT', 'TEACHER', 'STAFF')),
    school_id VARCHAR(100) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    destination_country VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100),
    mobility_project_code VARCHAR(50) NOT NULL,
    deadline_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED'
        CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE')),
    completion_percentage INTEGER NOT NULL DEFAULT 0,
    completed_modules_count INTEGER NOT NULL DEFAULT 0,
    total_modules_count INTEGER NOT NULL DEFAULT 10,
    certificate_issued_at TIMESTAMP WITH TIME ZONE,
    certificate_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_prep_assignment_updated_at
    BEFORE UPDATE ON prep_assignment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_prep_assignment_school_id ON prep_assignment(school_id);
CREATE INDEX IF NOT EXISTS idx_prep_assignment_participant_id ON prep_assignment(participant_id);
CREATE INDEX IF NOT EXISTS idx_prep_assignment_status ON prep_assignment(status);

-- 3. Participant Module Completions & Mini-Test Scores
CREATE TABLE IF NOT EXISTS prep_completion (
    id VARCHAR(100) PRIMARY KEY,
    assignment_id VARCHAR(100) NOT NULL REFERENCES prep_assignment(id) ON DELETE CASCADE,
    participant_id VARCHAR(100) NOT NULL,
    module_id VARCHAR(100) NOT NULL REFERENCES prep_module(id) ON DELETE RESTRICT,
    is_completed BOOLEAN NOT NULL DEFAULT true,
    quiz_score INTEGER NOT NULL DEFAULT 100,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    time_spent_minutes INTEGER DEFAULT 15,
    notes TEXT,
    CONSTRAINT uq_prep_assignment_module UNIQUE(assignment_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_prep_completion_assignment ON prep_completion(assignment_id);
CREATE INDEX IF NOT EXISTS idx_prep_completion_participant ON prep_completion(participant_id);
CREATE INDEX IF NOT EXISTS idx_prep_completion_module ON prep_completion(module_id);
