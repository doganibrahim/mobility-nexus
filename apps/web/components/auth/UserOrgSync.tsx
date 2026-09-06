'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '../../lib/store';
import { apiClient } from '../../lib/api-client';

/**
 * UserOrgSync
 * Global client component that ensures the user's active organisation
 * and role are always synced between PostgreSQL, Zustand, and localStorage.
 * Runs on initial app mount and across page refreshes.
 */
export default function UserOrgSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { initFromStorage, setCurrentOrg, setCurrentHost, clearOrg } = useAppStore();
  const lastCheckedUserId = useRef<string | null>(null);

  // 1. Hydrate immediately from localStorage on client mount
  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  // 2. When Clerk user status is resolved, sync with PostgreSQL backend
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      // User is signed out: clear organisation if any was cached
      if (lastCheckedUserId.current !== null) {
        lastCheckedUserId.current = null;
        clearOrg();
      }
      return;
    }

    const currentUserId = user.id;
    if (lastCheckedUserId.current === currentUserId) {
      return; // Already checked for this user session
    }

    let isMounted = true;

    async function syncOrgWithBackend() {
      try {
        // First check sending school organisation
        const { data: orgData } = await apiClient.getUserOrganisation(currentUserId);
        if (!isMounted) return;

        if (orgData && orgData.name) {
          setCurrentOrg(orgData, orgData.role || 'ORG_ADMIN');
          lastCheckedUserId.current = currentUserId;
          return;
        }

        // If not a school, check if user registered as a Host organisation
        const { data: hostData } = await apiClient.getUserHostOrganisation(currentUserId);
        if (!isMounted) return;

        if (hostData && hostData.name) {
          setCurrentHost(hostData);
          lastCheckedUserId.current = currentUserId;
          return;
        }

        // User has neither school nor host in DB yet
        lastCheckedUserId.current = currentUserId;
        clearOrg();
      } catch (err) {
        console.warn('[UserOrgSync] Backend sync error:', err);
      }
    }

    syncOrgWithBackend();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, user, setCurrentOrg, clearOrg]);

  return null;
}
