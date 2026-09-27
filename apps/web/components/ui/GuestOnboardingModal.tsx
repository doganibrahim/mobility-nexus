'use client';

import React from 'react';
import PlatformGuideModal, { PlatformGuideModalProps } from './PlatformGuideModal';

export type GuestOnboardingModalProps = PlatformGuideModalProps;

/**
 * GuestOnboardingModal:
 * Formerly the simple 4-step tour, now upgraded to the full-featured,
 * modular ErasmusMobility Platform User Guide & Manual (PlatformGuideModal).
 */
export default function GuestOnboardingModal(props: GuestOnboardingModalProps) {
  return <PlatformGuideModal {...props} />;
}
