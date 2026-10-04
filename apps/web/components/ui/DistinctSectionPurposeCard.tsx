'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';

export interface TopResourceItem {
  icon: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
  onClick?: () => void;
}

interface DistinctSectionPurposeCardProps {
  sectionKey: 'platform' | 'library' | 'news' | 'contact';
  tag: string;
  tagColor?: string;
  title: string;
  purposeSentence: string;
  topResourcesTitle?: string;
  resources: [TopResourceItem, TopResourceItem, TopResourceItem];
  footerNotice?: string;
}

export default function DistinctSectionPurposeCard({
  sectionKey,
  tag,
  tagColor = 'bg-blue-50 text-blue-900 border-blue-200',
  title,
  purposeSentence,
  topResourcesTitle,
  resources,
  footerNotice,
}: DistinctSectionPurposeCardProps) {
  const { locale } = useTranslation();
  const isTr = locale === 'tr';

  const defaultTopResourcesTitle = isTr
    ? 'En Çok Aranan 3 Kaynak ve Hızlı Erişim'
    : 'Top 3 Most Searched Resources & Quick Access';

  return (
    <section
      aria-labelledby={`section-purpose-${sectionKey}`}
      className="bg-white border-2 border-slate-300 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6"
    >
      {/* 1. Purpose Anchor Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${tagColor}`}
          >
            <span>📌</span>
            <span>{tag}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span>✓</span>
            <span>{isTr ? 'Ayrışmış Bölüm Rolü' : 'Distinct Section Role'}</span>
          </span>
        </div>

        <div>
          <h2
            id={`section-purpose-${sectionKey}`}
            className="text-lg sm:text-xl font-black text-slate-950 tracking-tight m-0"
          >
            {title}
          </h2>
          <div className="mt-2 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed flex items-start gap-2.5">
            <span className="text-base select-none shrink-0 mt-0.5">🎯</span>
            <div>
              <strong className="font-extrabold text-slate-900 mr-1.5">
                {isTr ? 'Bölümün Özel Amacı:' : 'Section Objective:'}
              </strong>
              <span>{purposeSentence}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 3 Most Searched Resources Grid */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>{topResourcesTitle || defaultTopResourcesTitle}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {isTr ? 'Doğrudan Hızlı Bağlantılar' : 'Direct Quick Links'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {resources.map((res, idx) => {
            const cardContent = (
              <div className="h-full p-4 rounded-xl border border-slate-200/90 bg-white hover:bg-blue-50/40 hover:border-blue-300 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-base shrink-0 transition-colors">
                      {res.icon}
                    </span>
                    {res.badge ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                        {res.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors m-0">
                      {res.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-normal line-clamp-2 m-0">
                      {res.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-900">
                  <span>{isTr ? 'Hızlı Erişim' : 'Quick Access'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            );

            if (res.onClick) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={res.onClick}
                  className="text-left w-full cursor-pointer focus:outline-hidden"
                >
                  {cardContent}
                </button>
              );
            }

            return (
              <Link
                key={idx}
                href={res.href}
                className="block text-left w-full focus:outline-hidden"
                {...(res.isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>

      {footerNotice && (
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
          <span>ℹ️</span>
          <span>{footerNotice}</span>
        </div>
      )}
    </section>
  );
}
