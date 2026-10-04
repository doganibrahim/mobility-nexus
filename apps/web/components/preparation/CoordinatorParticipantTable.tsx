'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { PrepAssignment } from '@mobility-nexus/types';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Mail,
  Plane,
  Building2,
  Eye,
  BellRing,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface CoordinatorParticipantTableProps {
  assignments: PrepAssignment[];
  onSelectParticipant: (participantId: string) => void;
  onOpenCertificate: (assignment: PrepAssignment) => void;
}

export function CoordinatorParticipantTable({
  assignments,
  onSelectParticipant,
  onOpenCertificate,
}: CoordinatorParticipantTableProps) {
  const { locale } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [reminderSentId, setReminderSentId] = useState<string | null>(null);

  const filtered = assignments.filter((a) => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (roleFilter !== 'ALL' && a.participantRole !== roleFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.participantName.toLowerCase().includes(q);
      const matchEmail = a.participantEmail.toLowerCase().includes(q);
      const matchSchool = a.schoolName.toLowerCase().includes(q);
      const matchCountry = a.destinationCountry.toLowerCase().includes(q);
      const matchProject = a.mobilityProjectCode.toLowerCase().includes(q);
      return matchName || matchEmail || matchSchool || matchCountry || matchProject;
    }
    return true;
  });

  const handleSendReminder = (assignmentId: string, name: string) => {
    setReminderSentId(assignmentId);
    setTimeout(() => {
      setReminderSentId(null);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Search & Filter Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'tr'
                ? 'İsim, e-posta, ülke veya proje kodu ara...'
                : 'Search name, email, country or project code...'
            }
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">
              {locale === 'tr' ? 'Durum:' : 'Status:'}
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">{locale === 'tr' ? 'Tümü' : 'All'}</option>
              <option value="COMPLETED">{locale === 'tr' ? 'Tamamlandı' : 'Completed'}</option>
              <option value="IN_PROGRESS">{locale === 'tr' ? 'Devam Ediyor' : 'In Progress'}</option>
              <option value="NOT_STARTED">{locale === 'tr' ? 'Başlamadı' : 'Not Started'}</option>
            </select>
          </div>

          {/* Role filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">
              {locale === 'tr' ? 'Rol:' : 'Role:'}
            </span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">{locale === 'tr' ? 'Tümü' : 'All'}</option>
              <option value="STUDENT">{locale === 'tr' ? 'Öğrenciler' : 'Students'}</option>
              <option value="TEACHER">{locale === 'tr' ? 'Öğretmenler' : 'Teachers'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">{locale === 'tr' ? 'Katılımcı' : 'Participant'}</th>
              <th className="py-3 px-4">{locale === 'tr' ? 'Kurum & Proje' : 'School & Project'}</th>
              <th className="py-3 px-4">{locale === 'tr' ? 'Hedef Ülke' : 'Destination'}</th>
              <th className="py-3 px-4">{locale === 'tr' ? 'Hazırlık İlerlemesi' : 'Preparation Progress'}</th>
              <th className="py-3 px-4">{locale === 'tr' ? 'Durum' : 'Status'}</th>
              <th className="py-3 px-4 text-right">{locale === 'tr' ? 'İşlem' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  {locale === 'tr'
                    ? 'Kriterlere uygun katılımcı bulunamadı.'
                    : 'No participants matched criteria.'}
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isDone = item.status === 'COMPLETED';
                const isPending = item.status === 'IN_PROGRESS';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    onClick={() => onSelectParticipant(item.participantId)}
                  >
                    {/* Participant info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-900">
                        {item.participantName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>{item.participantEmail}</span>
                      </div>
                    </td>

                    {/* School & Project */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1">
                        {item.schoolName}
                      </div>
                      <div className="text-[11px] text-blue-700 font-mono mt-0.5">
                        {item.mobilityProjectCode}
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Plane className="w-3.5 h-3.5 text-blue-600" />
                        <span>{item.destinationCountry}</span>
                      </div>
                      {item.destinationCity && (
                        <div className="text-[11px] text-slate-400">
                          {item.destinationCity}
                        </div>
                      )}
                    </td>

                    {/* Progress Bar */}
                    <td className="py-3.5 px-4 min-w-[160px]">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                        <span className="text-slate-600">
                          {item.completedModulesCount}/{item.totalModulesCount} {locale === 'tr' ? 'Modül' : 'Modules'}
                        </span>
                        <span className="text-blue-900 font-bold">
                          {item.completionPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isDone
                              ? 'bg-emerald-600'
                              : isPending
                              ? 'bg-blue-600'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${item.completionPercentage}%` }}
                        />
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{locale === 'tr' ? 'Hazır' : 'Ready'}</span>
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>{locale === 'tr' ? 'Sürüyor' : 'In Progress'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <span>{locale === 'tr' ? 'Başlamadı' : 'Not Started'}</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {isDone ? (
                          <button
                            type="button"
                            onClick={() => onOpenCertificate(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{locale === 'tr' ? 'Sertifika' : 'Certificate'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendReminder(item.id, item.participantName)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
                          >
                            <BellRing className="w-3.5 h-3.5 text-amber-600" />
                            <span>
                              {reminderSentId === item.id
                                ? locale === 'tr'
                                  ? 'Hatırlatıldı!'
                                  : 'Reminded!'
                                : locale === 'tr'
                                ? 'Hatırlat'
                                : 'Remind'}
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectParticipant(item.participantId)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title={locale === 'tr' ? 'Karnesini Görüntüle' : 'View Progress Dossier'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
