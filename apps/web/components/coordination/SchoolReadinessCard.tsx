'use client';

import React from 'react';
import { SchoolCoordinationRecord, SchoolCoordinationStatusType } from '@mobility-nexus/types';
import { MobilityGuidanceBadge } from './MobilityGuidanceBadge';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  FileCheck,
  Clock,
  ChevronRight,
  Sparkles,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface SchoolReadinessCardProps {
  school: SchoolCoordinationRecord;
  onSelect: (school: SchoolCoordinationRecord) => void;
  onAddNote: (school: SchoolCoordinationRecord) => void;
}

export function SchoolReadinessCard({ school, onSelect, onAddNote }: SchoolReadinessCardProps) {
  const getStatusBadge = (status: SchoolCoordinationStatusType) => {
    switch (status) {
      case 'NEW_REGISTRATION':
        return { label: 'Yeni Kayıt', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'IN_REVIEW':
        return { label: 'İnceleniyor', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'MEETING_SCHEDULED':
        return { label: 'Randevu Planlandı', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'CONSORTIUM_MATCHED':
        return { label: 'Konsorsiyuma Bağlandı', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'APPLICATION_READY':
        return { label: 'Başvuru Hazır', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'MOBILITY_ACTIVE':
        return { label: 'Hareketlilik Aktif', bg: 'bg-teal-50 text-teal-800 border-teal-200' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const statusBadge = getStatusBadge(school.status);
  const score = school.needAssessment.overallReadinessScore;

  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left Info Column */}
      <div className="space-y-2 max-w-2xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge.bg}`}
          >
            {statusBadge.label}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              school.accreditationStatus === 'YES'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {school.accreditationStatus === 'YES' ? '✓ Erasmus Akredite' : 'Akreditasyonsuz (KA122)'}
          </span>

          {school.schoolOid && (
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              OID: {school.schoolOid}
            </span>
          )}

          <MobilityGuidanceBadge path={school.needAssessment.recommendedPath} size="sm" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-950 m-0 flex items-center gap-1.5">
            <span>{school.schoolName}</span>
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 m-0 leading-relaxed">
            {school.needAssessment.evaluationSummary}
          </p>
        </div>

        {/* Contact & Meta Row */}
        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-medium flex-wrap">
          {school.schoolCity && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{school.schoolCity}</span>
            </span>
          )}

          {school.contactName && (
            <span>
              👤 {school.contactName}
              {school.contactEmail && ` (${school.contactEmail})`}
            </span>
          )}

          {school.inquiriesCount > 0 && (
            <span className="text-blue-700 font-bold">
              📬 {school.inquiriesCount} Başvuru/Talep
            </span>
          )}

          {school.lastContactedAt && (
            <span className="text-slate-400">
              🕒 Son Görüşme: {new Date(school.lastContactedAt).toLocaleDateString('tr-TR')}
            </span>
          )}
        </div>
      </div>

      {/* Right Column: Score & Action Buttons */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
        {/* Readiness Circular Badge */}
        <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[76px]">
          <span className="text-[10px] font-bold text-slate-500">Hazırlık</span>
          <span
            className={`text-lg font-black ${
              score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-blue-700' : 'text-amber-700'
            }`}
          >
            %{score}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={() => onAddNote(school)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Not / Durum</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(school)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Radar & Profil</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
