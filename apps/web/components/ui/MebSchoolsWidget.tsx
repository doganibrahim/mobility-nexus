'use client';

import React from 'react';
import BeneficiariesModal, { BeneficiaryCategory } from './BeneficiariesModal';

export interface MebSchoolsWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: BeneficiaryCategory;
}

/**
 * Backward compatibility wrapper forwarding to unified BeneficiariesModal
 */
export default function MebSchoolsWidget({
  isOpen,
  onClose,
  initialCategory = 'MESLEK_LISELERI',
}: MebSchoolsWidgetProps) {
  return (
    <BeneficiariesModal
      isOpen={isOpen}
      onClose={onClose}
      initialCategory={initialCategory}
    />
  );
}
