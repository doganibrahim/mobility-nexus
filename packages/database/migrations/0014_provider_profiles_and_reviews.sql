-- ==============================================================================
-- 0014_provider_profiles_and_reviews.sql
-- Migration: Comprehensive Provider Profiles, Cancellation Policies & 5-Dimensional Review Assessment (PKG-IMP-05)
-- Project: CAPPINNO Mobility Nexus (EMaaS)
-- ==============================================================================

-- 1. Host Cancellation Policy Table
CREATE TABLE IF NOT EXISTS host_cancellation_policy (
    id VARCHAR(100) PRIMARY KEY,
    host_id VARCHAR(100) NOT NULL,
    policy_type VARCHAR(50) NOT NULL DEFAULT 'FLEXIBLE'
        CHECK (policy_type IN ('FLEXIBLE', 'MODERATE', 'STRICT', 'CUSTOM')),
    refund_percentage_full NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    days_before_full_refund INTEGER NOT NULL DEFAULT 30,
    refund_percentage_partial NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
    days_before_partial_refund INTEGER NOT NULL DEFAULT 14,
    force_majeure_covered BOOLEAN NOT NULL DEFAULT TRUE,
    policy_details_tr TEXT,
    policy_details_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cancellation_policy_host ON host_cancellation_policy(host_id);

-- 2. Host Review Metric Table (5-Dimensional Assessment: Response Time, Communication, Service Delivery, Programme Alignment, Problem Solving)
CREATE TABLE IF NOT EXISTS host_review_metric (
    id VARCHAR(100) PRIMARY KEY,
    host_id VARCHAR(100) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    school_oid VARCHAR(50),
    project_type VARCHAR(50) NOT NULL DEFAULT 'KA121',
    mobility_year INTEGER NOT NULL DEFAULT 2025,
    overall_score NUMERIC(3, 2) NOT NULL,
    response_time_score NUMERIC(3, 2) NOT NULL CHECK (response_time_score BETWEEN 1.0 AND 5.0),
    communication_score NUMERIC(3, 2) NOT NULL CHECK (communication_score BETWEEN 1.0 AND 5.0),
    service_delivery_score NUMERIC(3, 2) NOT NULL CHECK (service_delivery_score BETWEEN 1.0 AND 5.0),
    programme_alignment_score NUMERIC(3, 2) NOT NULL CHECK (programme_alignment_score BETWEEN 1.0 AND 5.0),
    problem_solving_score NUMERIC(3, 2) NOT NULL CHECK (problem_solving_score BETWEEN 1.0 AND 5.0),
    comment TEXT,
    verified_mobility BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_host_review_host ON host_review_metric(host_id);
CREATE INDEX IF NOT EXISTS idx_host_review_year ON host_review_metric(mobility_year);

-- 3. Seed Realistic Initial Cancellation Policies
INSERT INTO host_cancellation_policy (
    id, host_id, policy_type, refund_percentage_full, days_before_full_refund, 
    refund_percentage_partial, days_before_partial_refund, force_majeure_covered, 
    policy_details_tr, policy_details_en
) VALUES 
(
    'pol-bavaria-01',
    'host-de-bavaria',
    'FLEXIBLE',
    100.00,
    30,
    50.00,
    14,
    TRUE,
    'Hareketlilik başlangıcından 30 gün öncesine kadar ücretsiz %100 iade. 14 güne kadar %50 iade. Ulusal Ajans mücbir sebep halleri tam koruma altındadır.',
    'Free 100% cancellation up to 30 days before mobility start. 50% refund up to 14 days. Full National Agency force majeure protection.'
),
(
    'pol-technordic-02',
    'host-de-technordic',
    'MODERATE',
    100.00,
    45,
    50.00,
    21,
    TRUE,
    'Hareketlilik başlangıcından 45 gün öncesine kadar %100 iade; 21 güne kadar %50 iade. Erasmus+ vize ret veya resmi hibe iptallerinde tam iade sağlanır.',
    '100% refund up to 45 days before start; 50% refund up to 21 days. Full refund in case of Erasmus+ visa denial or NA grant revocation.'
),
(
    'pol-nordic-03',
    'host-fi-nordic',
    'FLEXIBLE',
    100.00,
    30,
    60.00,
    10,
    TRUE,
    '30 gün öncesine kadar kesintisiz tam iade; 10 gün öncesine kadar %60 iade veya sonraki döneme ücretsiz transfer hakkı.',
    'Full refund up to 30 days before mobility; 60% refund up to 10 days or free transfer to the next available session.'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Realistic Initial 5-Dimensional Reviews
INSERT INTO host_review_metric (
    id, host_id, school_name, school_oid, project_type, mobility_year,
    overall_score, response_time_score, communication_score, service_delivery_score,
    programme_alignment_score, problem_solving_score, comment, verified_mobility
) VALUES
(
    'rev-bavaria-01',
    'host-de-bavaria',
    'Bursa Nilüfer Mesleki ve Teknik Anadolu Lisesi',
    'E10023451',
    'KA121',
    2025,
    4.90,
    4.80,
    5.00,
    4.90,
    5.00,
    4.80,
    'Atölye mentörleri ve lojistik koordinasyonu olağanüstüydü. Endüstri 4.0 PLC istasyonlarında öğrencilerimiz doğrudan pratik yaptı. Sorunsuz bir hareketlilikti.',
    TRUE
),
(
    'rev-bavaria-02',
    'host-de-bavaria',
    'İzmir Mazhar Zorlu MTAL',
    'E10194823',
    'KA121',
    2025,
    4.85,
    4.70,
    4.90,
    4.90,
    4.90,
    4.90,
    'Ön hazırlık evrakları ve Europass sertifikasyon süreçleri gününde tamamlandı. Öğretmenlerimiz için çok verimli bir işbaşı gözlem ortamı sağlandı.',
    TRUE
),
(
    'rev-technordic-01',
    'host-de-technordic',
    'Ankara Ostim Şehit Alper Zor MTAL',
    'E10283741',
    'KA122',
    2025,
    4.75,
    4.60,
    4.80,
    4.80,
    4.90,
    4.70,
    'Yazılım ve IoT atölyelerinde harika bir eğitim aldık. Ulaşım kartları ve konaklama rezervasyonları önceden eksiksiz ayarlanmıştı.',
    TRUE
),
(
    'rev-nordic-01',
    'host-fi-nordic',
    'Eskişehir Atatürk MTAL',
    'E10123984',
    'KA121',
    2025,
    4.95,
    5.00,
    5.00,
    4.90,
    5.00,
    4.90,
    'Helsinki çevre teknolojileri laboratuvarında gerçekleştirilen eğitim tüm beklentilerimizin üzerindeydi. Özel diyet ve erişilebilirlik hassasiyetleri çok iyiydi.',
    TRUE
)
ON CONFLICT (id) DO NOTHING;
