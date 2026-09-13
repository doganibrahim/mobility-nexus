-- ==============================================================================
-- 0006_complete_vet_activities.sql
-- CAPPINNO Mobility Nexus - Complete Official VET Activities
-- Adds the 3 missing official Erasmus+ VET activity types to complete the full 10:
-- 1. VET_SKILLS_COMPETITION (Participation in VET skills competitions, 1-10 days)
-- 2. VET_GROUP_MOBILITY (Group mobility of VET learners, 2-30 days)
-- 3. STAFF_COURSE_TRAINING (Courses and training for staff, 2-10 days)
-- ==============================================================================

ALTER TABLE host_activity DROP CONSTRAINT IF EXISTS host_activity_activity_type_check;

ALTER TABLE host_activity ADD CONSTRAINT host_activity_activity_type_check 
    CHECK (activity_type IN (
        -- 1. VET Öğrenicileri
        'VET_SKILLS_COMPETITION', -- Participation in VET skills competitions (1-10 days)
        'VET_GROUP_MOBILITY',     -- Group mobility of VET learners (2-30 days)
        'VET_SHORT_TERM',         -- Short-term learning mobility of VET learners (10-89 days)
        'VET_LONG_TERM_PRO',      -- Long-term learning mobility of VET learners (ErasmusPro) (90-365 days)
        
        -- 2. Personel
        'JOB_SHADOWING',          -- Job shadowing (2-60 days)
        'TEACHING_ASSIGNMENT',    -- Teaching or training assignments (2-365 days)
        'STAFF_COURSE_TRAINING',  -- Courses and training (2-10 days)
        
        -- 3. Kuruma Gelen
        'INVITED_EXPERT',         -- Invited experts (2-60 days)
        'HOSTING_TEACHERS',       -- Hosting teachers and educators in training (10-365 days)
        
        -- 4. Proje Ekibi
        'PREPARATORY_VISIT',      -- Preparatory visits (1 visit per host, max 3 persons)
        
        -- Legacy fallback if needed
        'STUDY_VISIT'
    ));
