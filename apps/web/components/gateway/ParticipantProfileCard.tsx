'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { ParticipantType, MobilityGoal } from '@mobility-nexus/types';
import { useTranslation } from '../../lib/i18n';

interface ParticipantProfileCardProps {
  data: {
    participantType: ParticipantType;
    mobilityGoal: MobilityGoal;
    participantName: string;
    language: number;
    country: string;
    duration: string;
  };
  onChange: (field: string, value: string | number) => void;
}

export default function ParticipantProfileCard({
  data,
  onChange,
}: ParticipantProfileCardProps) {
  const { t } = useTranslation();

  return (
    <NeoCard
      id="participant"
      title={t.participant.title}
      badge="Hedef Kitle"
      badgeType="primary"
    >
      <div className="space-y-4">
        {/* Row 1: Participant Type & Mobility Goal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.participant.typeLabel}
            </label>
            <select
              className="edu-input bg-white cursor-pointer font-medium"
              value={data.participantType}
              onChange={(e) => onChange('participantType', e.target.value as ParticipantType)}
            >
              <option value="teacher">{t.participant.teacher}</option>
              <option value="student">{t.participant.student}</option>
            </select>
          </div>
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.participant.goalLabel}
            </label>
            <select
              className="edu-input bg-white cursor-pointer font-medium"
              value={data.mobilityGoal}
              onChange={(e) => onChange('mobilityGoal', e.target.value as MobilityGoal)}
            >
              <option value="Job shadowing / observation">İşbaşı gözlem (Job Shadowing)</option>
              <option value="Work-based learner mobility">Öğrenici stajı (VET Learners)</option>
              <option value="Skills training">Beceri ve yetkinlik eğitimi</option>
              <option value="Teaching/training assignment">Eğitmenlik / ders verme görevi</option>
              <option value="Mixed / not decided">Karma / henüz belirlenmedi</option>
            </select>
          </div>
        </div>

        {/* Row 2: Participant Name/Code and Language Readiness */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.participant.nameLabel}
            </label>
            <input
              type="text"
              className="edu-input"
              placeholder={t.participant.namePlaceholder}
              value={data.participantName}
              onChange={(e) => onChange('participantName', e.target.value)}
            />
          </div>
          <div className="md:col-span-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {t.participant.langLabel}
              </label>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                {data.language}/100
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              className="w-full accent-blue-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
              value={data.language}
              onChange={(e) => onChange('language', parseInt(e.target.value, 10))}
            />
          </div>
        </div>

        {/* Row 3: Target Country & Planned Duration */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.participant.countryLabel}
            </label>
            <input
              type="text"
              className="edu-input"
              placeholder={t.participant.countryPlaceholder}
              value={data.country}
              onChange={(e) => onChange('country', e.target.value)}
            />
          </div>
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.participant.durationLabel}
            </label>
            <input
              type="text"
              className="edu-input"
              placeholder={t.participant.durationPlaceholder}
              value={data.duration}
              onChange={(e) => onChange('duration', e.target.value)}
            />
          </div>
        </div>
      </div>
    </NeoCard>
  );
}
