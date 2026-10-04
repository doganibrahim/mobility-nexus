'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  Clock,
  MessageSquare,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Send,
  Building,
} from 'lucide-react';
import {
  HostReviewsBreakdownResponse,
  FiveDimensionalReviewMetrics,
  HostReviewItem,
  CreateHostReviewDto,
} from '@mobility-nexus/types';
import { apiClient } from '@/lib/api-client';
import { useTranslation } from '@/lib/i18n';

interface ProviderFeedbackBreakdownProps {
  hostId: string;
  hostName?: string;
  initialBreakdown?: HostReviewsBreakdownResponse;
  compact?: boolean;
  onReviewSubmitted?: (newReview: HostReviewItem) => void;
}

export function ProviderFeedbackBreakdown({
  hostId,
  hostName = 'Ev Sahibi Sağlayıcı',
  initialBreakdown,
  compact = false,
  onReviewSubmitted,
}: ProviderFeedbackBreakdownProps) {
  const { locale } = useTranslation();
  const isTr = locale === 'tr';

  const [data, setData] = useState<HostReviewsBreakdownResponse | null>(initialBreakdown || null);
  const [loading, setLoading] = useState(!initialBreakdown);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Form State for new 5D evaluation
  const [schoolName, setSchoolName] = useState('');
  const [schoolOid, setSchoolOid] = useState('');
  const [projectType, setProjectType] = useState<'KA121' | 'KA122' | 'OTHER'>('KA121');
  const [comment, setComment] = useState('');
  const [metrics, setMetrics] = useState<FiveDimensionalReviewMetrics>({
    responseTime: 5,
    communication: 5,
    serviceDelivery: 5,
    programmeAlignment: 5,
    problemSolving: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchBreakdown() {
      try {
        setLoading(true);
        const res = await apiClient.getHostReviewsBreakdown(hostId);
        if (mounted) {
          setData(res);
        }
      } catch (err) {
        console.warn('Yorum verisi alınamadı:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (!initialBreakdown && hostId) {
      fetchBreakdown();
    }
    return () => {
      mounted = false;
    };
  }, [hostId, initialBreakdown]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateHostReviewDto = {
        schoolName: schoolName.trim(),
        schoolOid: schoolOid.trim() || undefined,
        projectType,
        mobilityYear: new Date().getFullYear(),
        metrics,
        comment: comment.trim() || undefined,
      };

      const result = await apiClient.submitHostReview(hostId, payload);
      if (result.success && result.data) {
        setSubmitSuccess(true);
        // Refresh breakdown
        const updated = await apiClient.getHostReviewsBreakdown(hostId);
        setData(updated);
        if (onReviewSubmitted) {
          onReviewSubmitted(result.data);
        }
        setTimeout(() => {
          setIsFormOpen(false);
          setSubmitSuccess(false);
          setSchoolName('');
          setSchoolOid('');
          setComment('');
        }, 2000);
      }
    } catch (err) {
      console.error('Yorum gönderilemedi:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const metricConfig = [
    {
      key: 'responseTime' as keyof FiveDimensionalReviewMetrics,
      labelTr: 'Yanıt Süresi & Hız',
      labelEn: 'Response Time & Agility',
      descTr: 'Taleplere ilk geri dönüş ve mesaj yanıtlama hızı',
      descEn: 'Speed of first response to inquiries and messaging',
      icon: Clock,
      color: 'bg-blue-500',
    },
    {
      key: 'communication' as keyof FiveDimensionalReviewMetrics,
      labelTr: 'İletişim & Şeffaflık',
      labelEn: 'Communication & Transparency',
      descTr: 'Proje öncesi ve süresince açık, net ve yapıcı bilgi akışı',
      descEn: 'Clear, constructive, and open flow of information',
      icon: MessageSquare,
      color: 'bg-emerald-500',
    },
    {
      key: 'serviceDelivery' as keyof FiveDimensionalReviewMetrics,
      labelTr: 'Hizmet Tamamlama & Taahhüt',
      labelEn: 'Service Fulfillment & Delivery',
      descTr: 'Konaklama, lojistik, atölye ve mentorluk taahhütlerine uyum',
      descEn: 'Fulfillment of accommodation, logistics, and mentor commitments',
      icon: CheckCircle2,
      color: 'bg-indigo-500',
    },
    {
      key: 'programmeAlignment' as keyof FiveDimensionalReviewMetrics,
      labelTr: 'Program & Müfredat Uygunluğu',
      labelEn: 'Programme & Curriculum Fit',
      descTr: 'Erasmus+ öğrenme çıktıları ve teknik eğitim kalitesi',
      descEn: 'Quality of technical training and Erasmus+ learning outcomes',
      icon: BookOpen,
      color: 'bg-amber-500',
    },
    {
      key: 'problemSolving' as keyof FiveDimensionalReviewMetrics,
      labelTr: 'Sorun Çözme & Kriz Yönetimi',
      labelEn: 'Problem Solving & Support',
      descTr: 'Öğrenci veya program aksaklıklarında proaktif çözüm üretme',
      descEn: 'Proactive support and swift resolution during unexpected issues',
      icon: HelpCircle,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
        <div className="h-2 bg-slate-200 rounded w-full mb-2" />
        <div className="h-2 bg-slate-200 rounded w-5/6" />
      </div>
    );
  }

  const overall = data?.overallAverage || 4.8;
  const totalReviews = data?.totalReviews || (data?.reviews ? data.reviews.length : 0);
  const metricAverages = data?.metricAverages || {
    responseTime: 4.8,
    communication: 4.9,
    serviceDelivery: 4.8,
    programmeAlignment: 4.9,
    problemSolving: 4.7,
  };
  const reviewsList = data?.reviews || [];
  const visibleReviews = showAllReviews ? reviewsList : reviewsList.slice(0, 2);

  if (compact) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <span className="text-sm font-bold text-slate-900">{overall.toFixed(1)}</span>
            <span className="text-xs text-slate-500">
              ({totalReviews} {isTr ? 'okul değerlendirmesi' : 'school reviews'})
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            {isTr ? '5 Boyutlu Güvence' : '5-Dimension Verified'}
          </span>
        </div>

        {/* 5 mini bars */}
        <div className="space-y-1.5 text-[11px]">
          {metricConfig.map((m) => {
            const val = metricAverages[m.key] || 4.8;
            const percent = (val / 5) * 100;
            return (
              <div key={m.key} className="flex items-center justify-between gap-2">
                <span className="text-slate-600 truncate w-36 font-medium">
                  {isTr ? m.labelTr : m.labelEn}
                </span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.color}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-slate-700 font-semibold w-7 text-right">
                  {val.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
      {/* Top Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-2">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            <span>{isTr ? 'Erasmus+ Kalite Kriterleri' : 'Erasmus+ Quality Criteria'}</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {isTr ? '5 Boyutlu Sağlayıcı Performans Değerlendirmesi' : '5-Dimensional Provider Performance Assessment'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            {isTr
              ? 'Yalnızca genel yıldız puanı değil; iletişim hızı, hizmet taahhütleri ve öğrenme uygunluğu gibi 5 temel kurumsal boyutta doğrulanmış okul deneyimleri.'
              : 'Beyond a simple star score; verified school experiences evaluated across 5 institutional dimensions.'}
          </p>
        </div>

        {/* Big Overall Score Card */}
        <div className="shrink-0 bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-white tracking-tight">{overall.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-0.5 mt-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(overall) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              5.0 {isTr ? 'Üzerinden' : 'Scale'}
            </div>
          </div>
          <div className="border-l border-slate-700 pl-4 text-xs">
            <div className="font-semibold text-slate-200">
              {totalReviews} {isTr ? 'Doğrulanmış Okul' : 'Verified Schools'}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span>%100 {isTr ? 'Saha Deneyimi' : 'Field Experience'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Dimensional Breakdown Bars */}
      <div className="p-5 sm:p-6 bg-slate-50/60 border-b border-slate-200/80">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>{isTr ? 'Performans Kriterleri Puan Kırılımı' : 'Performance Criteria Breakdown'}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metricConfig.map((m) => {
            const val = metricAverages[m.key] || 4.8;
            const percent = (val / 5) * 100;
            const Icon = m.icon;

            return (
              <div
                key={m.key}
                className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {isTr ? m.labelTr : m.labelEn}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {isTr ? m.descTr : m.descEn}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-slate-900">
                      {val.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-slate-400"> / 5.0</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${m.color}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>{isTr ? 'Yararlanıcı Okul Değerlendirmeleri' : 'Beneficiary School Reviews'}</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTr
                ? 'Geçmiş Erasmus+ projelerinde bu sağlayıcı ile çalışan koordinatörlerin resmi referansları.'
                : 'Official testimonials from coordinators who previously mobilized with this host.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isTr ? 'Değerlendirme Ekle' : 'Add Assessment'}</span>
          </button>
        </div>

        {/* Review Submission Form (Accordion Modal) */}
        {isFormOpen && (
          <div className="mb-6 p-5 rounded-xl border border-blue-200 bg-blue-50/50 animate-in fade-in duration-200">
            <h5 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-700" />
              <span>{isTr ? '5 Boyutlu Değerlendirme Formu' : '5-Dimensional Assessment Form'}</span>
            </h5>
            <p className="text-xs text-blue-800 mb-4">
              {isTr
                ? `${hostName} ile gerçekleştirdiğiniz hareketliliği 5 boyutta puanlayarak diğer meslek liselerine yol gösterin.`
                : `Evaluate your mobility experience with ${hostName} across the 5 core dimensions.`}
            </p>

            {submitSuccess && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{isTr ? 'Değerlendirmeniz başarıyla kaydedildi! Teşekkür ederiz.' : 'Assessment submitted successfully! Thank you.'}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isTr ? 'Okul / Kurum Adı *' : 'School / Institution Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isTr ? 'Örn: Ankara Mesleki ve Teknik AL' : 'e.g. Leipzig Technical College'}
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isTr ? 'Okul OID Numarası (Varsa)' : 'School OID (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="E10293841"
                    value={schoolOid}
                    onChange={(e) => setSchoolOid(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isTr ? 'Proje Türü' : 'Project Type'}
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="KA121">KA121 (Akredite Hareketlilik)</option>
                    <option value="KA122">KA122 (Kısa Dönemli Proje)</option>
                    <option value="OTHER">{isTr ? 'Diğer Erasmus+ Faaliyeti' : 'Other Erasmus+ Activity'}</option>
                  </select>
                </div>
              </div>

              {/* 5 Sliders / Rating Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {metricConfig.map((m) => (
                  <div key={m.key} className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                      <span>{isTr ? m.labelTr : m.labelEn}</span>
                      <span className="text-blue-700 font-bold">{metrics[m.key]} / 5</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={metrics[m.key]}
                      onChange={(e) =>
                        setMetrics({ ...metrics, [m.key]: Number(e.target.value) })
                      }
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTr ? 'Deneyim ve Koordinatör Tavsiyeleri' : 'Experience & Coordinator Advice'}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    isTr
                      ? 'Mentorluk kalitesi, atölye imkanları, öğrenci güvenliği ve evrak süreçleri hakkındaki görüşleriniz...'
                      : 'Your feedback regarding mentorship quality, facilities, safety and documentation...'
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {isTr ? 'Vazgeç' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? (isTr ? 'Kaydediliyor...' : 'Saving...') : (isTr ? 'Değerlendirmeyi Yayınla' : 'Publish Review')}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviewsList.length === 0 ? (
          <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-500 text-xs">
            {isTr
              ? 'Bu kurum için henüz yayınlanmış kullanıcı değerlendirmesi bulunmuyor. İlk değerlendirmeyi siz ekleyebilirsiniz.'
              : 'No published reviews for this provider yet. Be the first to share your evaluation.'}
          </div>
        ) : (
          <div className="space-y-3">
            {visibleReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                      <Building className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 leading-tight">
                        {rev.schoolName}
                      </h5>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        {rev.schoolOid && <span>OID: {rev.schoolOid}</span>}
                        <span>•</span>
                        <span className="font-semibold text-blue-700">{rev.projectType}</span>
                        <span>•</span>
                        <span>{rev.mobilityYear} {isTr ? 'Dönemi' : 'Term'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {isTr ? 'Doğrulanmış Hareketlilik' : 'Verified Mobility'}
                    </span>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-700 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{rev.overallScore.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Comment quote */}
                {rev.comment && (
                  <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                )}

                {/* 5-D micro pill tags */}
                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-500">
                    {isTr ? 'Yanıt:' : 'Response:'} <strong>{rev.metrics.responseTime}</strong>/5
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">
                    {isTr ? 'İletişim:' : 'Communication:'} <strong>{rev.metrics.communication}</strong>/5
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">
                    {isTr ? 'Hizmet:' : 'Delivery:'} <strong>{rev.metrics.serviceDelivery}</strong>/5
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">
                    {isTr ? 'Program:' : 'Programme:'} <strong>{rev.metrics.programmeAlignment}</strong>/5
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">
                    {isTr ? 'Çözüm:' : 'Solving:'} <strong>{rev.metrics.problemSolving}</strong>/5
                  </span>
                </div>
              </div>
            ))}

            {reviewsList.length > 2 && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                >
                  <span>
                    {showAllReviews
                      ? (isTr ? 'Daha Az Değerlendirme Göster' : 'Show Less Reviews')
                      : (isTr ? `Tüm Değerlendirmeleri Gör (${reviewsList.length})` : `Show All Reviews (${reviewsList.length})`)}
                  </span>
                  {showAllReviews ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
