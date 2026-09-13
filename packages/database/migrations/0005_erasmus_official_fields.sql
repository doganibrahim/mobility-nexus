-- ==============================================================================
-- 0005_erasmus_official_fields.sql
-- CAPPINNO Mobility Nexus - Data Gap Closure
-- Adds 7 official Erasmus+ VET activity types and logistics data.
-- ==============================================================================

-- 1. Drop existing check constraint and add the expanded one for activities
ALTER TABLE host_activity DROP CONSTRAINT IF EXISTS host_activity_activity_type_check;

ALTER TABLE host_activity ADD CONSTRAINT host_activity_activity_type_check 
    CHECK (activity_type IN (
        'VET_SHORT_TERM',       -- Short-term learning mobility of VET learners (10-89 days)
        'VET_LONG_TERM_PRO',    -- Long-term learning mobility of VET learners (ErasmusPro) (90-365 days)
        'JOB_SHADOWING',        -- Job shadowing (2-60 days)
        'TEACHING_ASSIGNMENT',  -- Teaching or training assignments (2-365 days)
        'INVITED_EXPERT',       -- Invited experts (2-60 days)
        'HOSTING_TEACHERS',     -- Hosting teachers and educators in training (10-365 days)
        'PREPARATORY_VISIT',    -- Preparatory visits
        'STUDY_VISIT'           -- Kept for legacy/broader scope if needed
    ));

-- 2. Add logistics and capacity fields to host_organisation
ALTER TABLE host_organisation
    ADD COLUMN IF NOT EXISTS provides_accommodation BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS accommodation_details TEXT, -- Optional details (e.g., Hotel, Dormitory)
    ADD COLUMN IF NOT EXISTS provides_meals BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS meals_details TEXT, -- Optional details (e.g., Full Board, Lunch only)
    ADD COLUMN IF NOT EXISTS provides_transfers BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS transfers_details TEXT, -- Optional details (e.g., Airport pick-up, local bus pass)
    ADD COLUMN IF NOT EXISTS accepts_under_18 BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN host_organisation.provides_accommodation IS 'Indicates if the host can arrange or provide accommodation';
COMMENT ON COLUMN host_organisation.accommodation_details IS 'Optional details about the accommodation type';
COMMENT ON COLUMN host_organisation.accepts_under_18 IS 'Indicates if the host is willing and legally able to host minors';
