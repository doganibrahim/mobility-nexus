'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { VET_FIELDS } from '../../lib/constants';
import { useTranslation } from '../../lib/i18n';

interface EscoIscedMapperCardProps {
  data: {
    vetField: string;
    iscedCode: string;
    iscedName: string;
    escoTerm: string;
    iscoCode: string;
    escoUri: string;
    skills: string;
  };
  onSelectField: (fieldKey: string) => void;
  onChange: (field: string, value: string) => void;
}

export default function EscoIscedMapperCard({
  data,
  onSelectField,
  onChange,
}: EscoIscedMapperCardProps) {
  const { t } = useTranslation();

  const escoSearchUrl = data.escoTerm
    ? `https://esco.ec.europa.eu/en/classification/occupation-main?search=${encodeURIComponent(
        data.escoTerm.split('/')[0].trim(),
      )}`
    : 'https://esco.ec.europa.eu/en/classification/occupation-main';

  return (
    <NeoCard
      id="esco"
      title={t.esco.title}
      badge="AB ESCO v1.1"
      badgeType="primary"
    >
      <div className="space-y-4">
        {/* Info Box */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 leading-relaxed">
          {t.esco.info}
        </div>

        {/* Row 1: VET Field Selector, ISCED Code, ISCED Name */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.esco.fieldLabel}
            </label>
            <select
              className="edu-input bg-white cursor-pointer font-medium"
              value={data.vetField}
              onChange={(e) => onSelectField(e.target.value)}
            >
              <option value="">{t.esco.fieldDefault}</option>
              {Object.entries(VET_FIELDS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.esco.iscedCodeLabel}
            </label>
            <input
              type="text"
              readOnly
              className="edu-input bg-slate-50 text-slate-900 font-bold"
              placeholder="0714"
              value={data.iscedCode}
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.esco.iscedNameLabel}
            </label>
            <input
              type="text"
              readOnly
              className="edu-input bg-slate-50 text-slate-900 font-medium"
              placeholder="Electronics & automation"
              value={data.iscedName}
            />
          </div>
        </div>

        {/* Row 2: ESCO Term, ISCO-08 Code, ESCO URI */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.esco.escoTermLabel}
            </label>
            <input
              type="text"
              className="edu-input text-slate-900"
              placeholder="automation technician / mechatronics"
              value={data.escoTerm}
              onChange={(e) => onChange('escoTerm', e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.esco.iscoLabel}
            </label>
            <input
              type="text"
              className="edu-input"
              placeholder="Örn: 3115"
              value={data.iscoCode}
              onChange={(e) => onChange('iscoCode', e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.esco.escoUriLabel}
            </label>
            <input
              type="text"
              className="edu-input text-xs font-mono"
              placeholder="http://data.europa.eu/esco/..."
              value={data.escoUri}
              onChange={(e) => onChange('escoUri', e.target.value)}
            />
          </div>
        </div>

        {/* Row 3: Priority Skills & Competences */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.esco.skillsLabel}
          </label>
          <textarea
            className="edu-input min-h-[75px] resize-y text-xs"
            placeholder="PLC programlama, endustriyel haberlesme, robotik, ariza tespiti, onleyici bakim..."
            value={data.skills}
            onChange={(e) => onChange('skills', e.target.value)}
          />
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-100 no-print">
          <a
            href={escoSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="edu-btn-primary text-xs"
          >
            🔍 ESCO Doğrula ↗
          </a>
          <a
            href="https://esco.ec.europa.eu/en/classification"
            target="_blank"
            rel="noopener noreferrer"
            className="edu-btn-secondary text-xs"
          >
            🌐 Resmî ESCO Portalı ↗
          </a>
          <a
            href="https://uis.unesco.org/sites/default/files/documents/isced-fields-of-education-and-training-2013-en.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="edu-btn-secondary text-xs"
          >
            📄 ISCED-F 2013 Rehberi ↗
          </a>
        </div>
      </div>
    </NeoCard>
  );
}
