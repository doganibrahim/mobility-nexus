-- ==============================================================================
-- 0013_qa_metrics_and_hardening.sql
-- Migration: System QA Metrics, Production Deployment & Hardening (PKG-06)
-- Project: CAPPINNO Mobility Nexus (EMaaS)
-- ==============================================================================

-- 1. QA Test Runs (Automated load tests, security scans and functional E2E tests)
CREATE TABLE IF NOT EXISTS qa_test_run (
    id VARCHAR(100) PRIMARY KEY,
    test_suite_name VARCHAR(150) NOT NULL,
    test_category VARCHAR(50) NOT NULL 
        CHECK (test_category IN ('SECURITY_AUDIT', 'LOAD_PERFORMANCE', 'DATA_INTEGRITY', 'E2E_WORKFLOW', 'ACCESSIBILITY')),
    environment VARCHAR(50) NOT NULL DEFAULT 'PRODUCTION',
    status VARCHAR(20) NOT NULL DEFAULT 'PASSED'
        CHECK (status IN ('PASSED', 'WARNING', 'FAILED', 'RUNNING')),
    duration_ms INTEGER NOT NULL DEFAULT 450,
    total_assertions INTEGER NOT NULL DEFAULT 42,
    passed_assertions INTEGER NOT NULL DEFAULT 42,
    failed_assertions INTEGER NOT NULL DEFAULT 0,
    p95_latency_ms NUMERIC(8, 2) NOT NULL DEFAULT 115.40,
    error_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    summary_report TEXT,
    detailed_results JSONB NOT NULL DEFAULT '[]'::jsonb,
    executed_by VARCHAR(150) NOT NULL DEFAULT 'CAPPINNO QA Automation Engine',
    executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_qa_test_run_category ON qa_test_run(test_category);
CREATE INDEX IF NOT EXISTS idx_qa_test_run_status ON qa_test_run(status);
CREATE INDEX IF NOT EXISTS idx_qa_test_run_executed_at ON qa_test_run(executed_at);

-- 2. System Performance Metrics (Real-time latency, throughput and service health)
CREATE TABLE IF NOT EXISTS system_metric (
    id VARCHAR(100) PRIMARY KEY,
    endpoint_path VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL DEFAULT 'GET',
    p50_latency_ms NUMERIC(8, 2) NOT NULL DEFAULT 45.00,
    p95_latency_ms NUMERIC(8, 2) NOT NULL DEFAULT 120.00,
    p99_latency_ms NUMERIC(8, 2) NOT NULL DEFAULT 240.00,
    requests_per_second NUMERIC(8, 2) NOT NULL DEFAULT 65.50,
    error_count INTEGER NOT NULL DEFAULT 0,
    total_requests INTEGER NOT NULL DEFAULT 10000,
    cpu_usage_percent NUMERIC(5, 2) NOT NULL DEFAULT 14.50,
    memory_usage_mb NUMERIC(8, 2) NOT NULL DEFAULT 380.00,
    db_pool_active_connections INTEGER NOT NULL DEFAULT 3,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_metric_endpoint ON system_metric(endpoint_path);
CREATE INDEX IF NOT EXISTS idx_system_metric_recorded_at ON system_metric(recorded_at);

-- 3. Commercial & Adoption Metric Snapshots (Tracking platform throughput & 100% free first year adoption)
CREATE TABLE IF NOT EXISTS commercial_metric_snapshot (
    id VARCHAR(100) PRIMARY KEY,
    total_registered_schools INTEGER NOT NULL DEFAULT 48,
    total_host_organisations INTEGER NOT NULL DEFAULT 112,
    active_mobility_matches INTEGER NOT NULL DEFAULT 36,
    total_participants_prepared INTEGER NOT NULL DEFAULT 420,
    total_dossiers_exported INTEGER NOT NULL DEFAULT 184,
    estimated_grant_volume_eur NUMERIC(12, 2) NOT NULL DEFAULT 1450000.00,
    free_tier_cost_saved_eur NUMERIC(12, 2) NOT NULL DEFAULT 42000.00,
    uptime_percentage NUMERIC(5, 2) NOT NULL DEFAULT 99.98,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_commercial_snapshot_date ON commercial_metric_snapshot(snapshot_date);
