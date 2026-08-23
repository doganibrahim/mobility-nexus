-- ==============================================================================
-- 0002_auth_identity.sql
-- Migration: Authentication, Identity, Multi-tenant RBAC & Invitation Flows
-- Project: CAPPINNO Mobility Nexus (EMaaS)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. User Account Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_account (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_user_account_updated_at
    BEFORE UPDATE ON user_account
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_user_account_email ON user_account(email);
CREATE INDEX IF NOT EXISTS idx_user_account_active ON user_account(is_active);

-- Link audit_event.user_id to user_account now that it exists
ALTER TABLE audit_event 
    ADD CONSTRAINT fk_audit_event_user 
    FOREIGN KEY (user_id) 
    REFERENCES user_account(id) 
    ON DELETE SET NULL;

-- ------------------------------------------------------------------------------
-- 2. Multi-tenant Membership & RBAC (Role-Based Access Control)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS membership (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisation(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL DEFAULT 'MEMBER' 
        CHECK (role IN ('PLATFORM_ADMIN', 'ORG_ADMIN', 'MEMBER', 'VIEWER')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_membership_org_user UNIQUE (organisation_id, user_id)
);

CREATE TRIGGER trg_membership_updated_at
    BEFORE UPDATE ON membership
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_membership_org_id ON membership(organisation_id);
CREATE INDEX IF NOT EXISTS idx_membership_user_id ON membership(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_role ON membership(role);

-- ------------------------------------------------------------------------------
-- 3. Invitation Table (Expiring, Single-Use Secure Tokens)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invitation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisation(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'MEMBER' 
        CHECK (role IN ('ORG_ADMIN', 'MEMBER', 'VIEWER')),
    token VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID REFERENCES user_account(id) ON DELETE SET NULL,
    accepted_by UUID REFERENCES user_account(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_invitation_updated_at
    BEFORE UPDATE ON invitation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_invitation_token ON invitation(token);
CREATE INDEX IF NOT EXISTS idx_invitation_org_id ON invitation(organisation_id);
CREATE INDEX IF NOT EXISTS idx_invitation_email ON invitation(email);
CREATE INDEX IF NOT EXISTS idx_invitation_status ON invitation(status);

-- ------------------------------------------------------------------------------
-- 4. Session & Refresh Token Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_token (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_session_token_user_id ON session_token(user_id);
CREATE INDEX IF NOT EXISTS idx_session_token_hash ON session_token(token_hash);
CREATE INDEX IF NOT EXISTS idx_session_token_expires_at ON session_token(expires_at);

-- Comments
COMMENT ON TABLE user_account IS 'Platform wide user accounts across all tenant organisations';
COMMENT ON TABLE membership IS 'Tenant-scoped RBAC mapping users to organisations with specific permissions';
COMMENT ON TABLE invitation IS 'Secure, tokenized, time-limited email invitations for onboarding organisation members';
COMMENT ON TABLE session_token IS 'OIDC/OAuth2 session tokens with revocation support';
