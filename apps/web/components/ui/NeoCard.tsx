'use client';

import React from 'react';

interface NeoCardProps {
  id?: string;
  title?: string;
  badge?: string;
  badgeType?: 'primary' | 'good' | 'warn' | 'bad' | 'ghost';
  featured?: boolean;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function NeoCard({
  id,
  title,
  badge,
  badgeType = 'primary',
  featured = false,
  children,
  className = '',
  headerAction,
}: NeoCardProps) {
  return (
    <section
      id={id}
      className={`edu-card ${
        featured ? 'edu-card-featured' : ''
      } ${className}`}
    >
      {title && (
        <div className="edu-card-header">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm sm:text-base font-bold tracking-tight text-inherit m-0">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {badge && (
              <span
                className={`edu-badge ${
                  badgeType === 'good'
                    ? 'edu-badge-good'
                    : badgeType === 'warn'
                      ? 'edu-badge-warn'
                      : badgeType === 'bad'
                        ? 'edu-badge-bad'
                        : ''
                }`}
              >
                {badge}
              </span>
            )}
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
