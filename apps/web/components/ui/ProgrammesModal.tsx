'use client';

import React, { useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';

export interface ProgrammesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'KA120' | 'KA121' | 'KA122' | 'COMPARISON';
}

export default function ProgrammesModal({
  isOpen,
  onClose,
  initialTab = 'COMPARISON',
}: ProgrammesModalProps) {
  const { locale } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<'KA120' | 'KA121' | 'KA122' | 'COMPARISON'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity z-0"
          aria-hidden="true"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>

        <div className="relative z-10 inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 w-full sm:max-w-4xl sm:align-middle border-2 border-slate-300">
          {/* Header */}
          <div className="bg-white px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2.5 rounded-xl text-slate-800 border border-slate-300">
                <span className="text-xl">🇪🇺</span>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 tracking-tight m-0" id="modal-title">
                  {locale === 'tr' ? 'Erasmus+ Mesleki Eğitim (VET) Programları' : 'Erasmus+ VET Programmes'}
                </h2>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  {locale === 'tr'
                    ? 'KA120 Akreditasyon, KA121 ve KA122 proje türleri, uygunluk kuralları ve başvuru kriterleri'
                    : 'KA120 Accreditation, KA121 and KA122 project types, eligibility criteria and standards'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200"
              onClick={onClose}
              title="Kapat"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-slate-100 px-4 sm:px-6 pt-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('COMPARISON')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'COMPARISON'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>⚖️</span>
              <span>{locale === 'tr' ? 'Karşılaştırma & Kriterler' : 'Comparison & Criteria'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('KA120')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'KA120'
                  ? 'bg-white border-slate-300 text-purple-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>⭐</span>
              <span>KA120-VET</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800 border border-purple-300">
                {locale === 'tr' ? 'Akreditasyon' : 'Accreditation'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('KA121')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'KA121'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🎖️</span>
              <span>KA121-VET</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
                {locale === 'tr' ? 'Yıllık Hibe' : 'Annual Grant'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('KA122')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'KA122'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🚀</span>
              <span>KA122-VET</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
                {locale === 'tr' ? 'Kısa Dönem' : 'Short-term'}
              </span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed bg-white">
            {activeTab === 'COMPARISON' ? (
              <div className="space-y-6">
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-[520px] w-full divide-y divide-slate-200 text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="py-3 px-4 font-bold text-slate-900 text-xs">
                          {locale === 'tr' ? 'Özellik / Kriter' : 'Feature / Criteria'}
                        </th>
                        <th className="py-3 px-4 font-bold text-blue-900 text-xs bg-blue-50/50">
                          KA121-VET ({locale === 'tr' ? 'Akredite' : 'Accredited'})
                        </th>
                        <th className="py-3 px-4 font-bold text-amber-900 text-xs bg-amber-50/50">
                          KA122-VET ({locale === 'tr' ? 'Kısa Dönem' : 'Short-term'})
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {locale === 'tr' ? 'Kimler Başvurabilir?' : 'Eligible Applicants'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {locale === 'tr'
                            ? 'Erasmus Akreditasyon belgesi olan kurumlar & konsorsiyum liderleri'
                            : 'Organisations holding Erasmus Accreditation & consortium coordinators'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {locale === 'tr'
                            ? 'Akredite olmayan tüm mesleki eğitim kurumları (MTAL, ÇPAL, HEM)'
                            : 'All non-accredited vocational training schools and VET institutions'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {locale === 'tr' ? 'Hibe Alma Süreci' : 'Grant Allocation Flow'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {locale === 'tr'
                            ? 'Erasmus Planı hedeflerine ve performansa dayalı yıllık bütçe tahsisatı'
                            : 'Annual budget allocation based on Erasmus Plan goals and track record'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {locale === 'tr'
                            ? 'Yarışmalı teklif çağrısı (Puanlama usulüyle ilk sıralara hibe verilir)'
                            : 'Competitive call for proposals (Assessed and ranked by quality score)'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {locale === 'tr' ? 'Katılımcı Kotası' : 'Participant Quota'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {locale === 'tr'
                            ? 'Kurumsal kapasiteye göre esnek ve yüksek kontenjan'
                            : 'Flexible and high volume aligned with institutional capacity'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {locale === 'tr'
                            ? 'Proje başına maksimum 30 katılımcı sınırı'
                            : 'Capped at a maximum of 30 participants per project'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {locale === 'tr' ? 'Başvuru Sıklığı' : 'Application Frequency'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {locale === 'tr'
                            ? 'Yılda 1 kez standart talep formu doldurulur'
                            : 'Once annually via simplified grant request form'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {locale === 'tr'
                            ? '5 ardışık çağrı yılı içinde en fazla 3 proje hakkı'
                            : 'Maximum 3 approved projects within 5 consecutive call years'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {locale === 'tr' ? 'Staj & Öğrenme Çıktıları' : 'Internship & Outcomes'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {locale === 'tr'
                            ? 'ESCO ve ECVET standartlarında kurumsal stratejik entegrasyon'
                            : 'Strategic curriculum integration with ESCO skill taxonomies'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {locale === 'tr'
                            ? 'Kısa vadeli somut beceri açığı kapatma odaklı'
                            : 'Targeted short-term competence gap closure and skill acquisition'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">
                    {locale === 'tr' ? '💡 Hangi Program Kurumunuz İçin Uygun?' : '💡 Which Programme Best Fits Your School?'}
                  </div>
                  <p className="m-0 text-slate-600 text-xs">
                    {locale === 'tr'
                      ? 'Kurumunuzun OID numarası ve Erasmus Akreditasyonu varsa KA121 yıllık tahsisatından faydalanabilirsiniz. Eğer henüz akreditasyon almadıysanız ve tek seferlik/küçük ölçekli başlayacaksanız KA122, düzenli ve sürekli hareketlilik hedefliyorsanız ya da 30 kişi sınırını aşıyorsanız KA120 Akreditasyonu sizin için en doğru yoldur.'
                      : 'If your organisation has an active OID and holds Erasmus Accreditation, you can access the KA121 annual budget allocation. If you are starting fresh with short-term cohorts, choose KA122. For long-term continuous mobilities exceeding 30 participants, KA120 Accreditation is the recommended pathway.'}
                  </p>
                </div>
              </div>
            ) : activeTab === 'KA120' ? (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                  <div className="font-bold text-purple-950 text-sm">
                    {locale === 'tr' ? '⭐ KA120-VET: Erasmus Mesleki Eğitim Akreditasyonu' : '⭐ KA120-VET: Erasmus VET Accreditation'}
                  </div>
                  <div className="text-[11px] text-purple-900">
                    {locale === 'tr'
                      ? 'Kurumsal uluslararasılaşma pasaportu: Yıllık bütçe tahsisatına açılan stratejik kapı'
                      : 'Strategic internationalisation passport: Direct gateway to yearly grant allocations'}
                  </div>
                </div>
                <p className="m-0">
                  {locale === 'tr'
                    ? 'Erasmus Akreditasyonu, mesleki eğitim kurumlarının (MTAL, MEM, ÇPAL) uzun vadeli stratejik hedefler doğrultusunda yüksek kaliteli öğrenici ve personel hareketliliklerini düzenli olarak organize edebileceğini belgeleyen resmi bir kurumsal üyeliktir.'
                    : 'Erasmus Accreditation is a formal membership confirming that a VET organisation possesses the operational capacity to manage high-quality learner and staff mobilities on an ongoing, strategic basis.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <div className="font-bold text-slate-900 mb-0.5">
                      {locale === 'tr' ? '🎯 3–5 Yıllık Erasmus Planı' : '🎯 3–5 Year Erasmus Plan'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {locale === 'tr'
                        ? 'Kurumun ihtiyaç analizi, hedefleri, beklenen etkileri ve kalite taahhütlerini içeren stratejik yol haritası.'
                        : 'Strategic roadmap outlining institutional needs, objectives, target impacts, and quality standards.'}
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <div className="font-bold text-slate-900 mb-0.5">
                      {locale === 'tr' ? '💰 Yıllık Hibe Tahsisatı' : '💰 Annual Budget Allocation'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {locale === 'tr'
                        ? 'Bir kez akredite olduktan sonra her yıl yeniden karmaşık teklif yazmadan doğrudan KA121 yıllık tahsisatı talep edilir.'
                        : 'Once accredited, schools request annual funds directly via KA121 without competing in annual project drafting.'}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl">
                  <div className="font-bold text-purple-950 mb-1">
                    {locale === 'tr' ? 'Kimler KA120 Akreditasyonuna Başvurmalı?' : 'Who Should Apply for KA120 Accreditation?'}
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px]">
                    <li>
                      {locale === 'tr'
                        ? '5 ardışık çağrı yılında azami 3 KA122 hibesi hakkını dolduran veya doldurmak üzere olan okullar.'
                        : 'Schools that have reached or are nearing the 3-grant limit within 5 consecutive KA122 call years.'}
                    </li>
                    <li>
                      {locale === 'tr'
                        ? 'Her yıl düzenli olarak öğrenci ve personelini Avrupa stajına göndermek isteyen kurumlar.'
                        : 'Institutions seeking regular, recurring European internship placements for trainees and trainers.'}
                    </li>
                    <li>
                      {locale === 'tr'
                        ? 'Tek bir çağrı döneminde 30 katılımcı sınırından daha yüksek kontenjan hedefleyen kurumlar.'
                        : 'Organisations requiring mobility quotas higher than the 30-participant single-project ceiling.'}
                    </li>
                  </ul>
                </div>
              </div>
            ) : activeTab === 'KA121' ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                  <div className="font-bold text-blue-950 text-sm">
                    {locale === 'tr'
                      ? 'KA121-VET: Akredite Kuruluşlar İçin Hareketlilik Projeleri'
                      : 'KA121-VET: Mobility Projects for Accredited Organisations'}
                  </div>
                  <div className="text-[11px] text-blue-800">
                    {locale === 'tr'
                      ? 'Erasmus Planı ile bağlantılı stratejik, sürdürülebilir ve sürekli uluslararasılaşma'
                      : 'Strategic, sustainable, and continuous internationalisation tied to the Erasmus Plan'}
                  </div>
                </div>
                <p className="m-0">
                  {locale === 'tr'
                    ? 'Erasmus Akreditasyonu, mesleki eğitim alanında yüksek kaliteli hareketlilik faaliyetlerini düzenli olarak organize etme kapasitesini kanıtlamış kurumlara verilir. Akredite kurumlar her yıl karmaşık ve yarışmalı proje yazma süreçlerine girmeden, doğrudan yıllık hibe talep formu ile bütçelerini alırlar.'
                    : 'Accredited organisations bypass competitive selection rounds each year and request funding directly through a simplified annual grant agreement based on their institutional milestones.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <div className="font-bold text-slate-900 mb-0.5">
                      {locale === 'tr' ? '✓ Öğrenci Hareketliliği (VET Learners)' : '✓ Learner Mobilities (VET Learners)'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {locale === 'tr'
                        ? 'Kısa dönemli staj (10-89 gün) veya ErasmusPro uzun dönemli staj (90-365 gün).'
                        : 'Short-term training (10-89 days) or ErasmusPro long-term internships (90-365 days).'}
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <div className="font-bold text-slate-900 mb-0.5">
                      {locale === 'tr' ? '✓ Personel Hareketliliği (VET Staff)' : '✓ Staff Mobilities (VET Staff)'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {locale === 'tr'
                        ? 'İşbaşı izleme (Job Shadowing) veya eğitim/öğretim görevlendirmeleri.'
                        : 'Job shadowing, teaching assignments, or professional training visits.'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="font-bold text-amber-950 text-sm">
                    {locale === 'tr'
                      ? 'KA122-VET: Mesleki Eğitimde Kısa Dönemli Hareketlilik Projeleri'
                      : 'KA122-VET: Short-Term Projects for Mobility of VET Learners and Staff'}
                  </div>
                  <div className="text-[11px] text-amber-900">
                    {locale === 'tr'
                      ? 'Uluslararasılaşmaya ilk adım atan kurumlar için yalın başvuru yolu'
                      : 'Straightforward entry path for schools initiating international mobilities'}
                  </div>
                </div>
                <p className="m-0">
                  {locale === 'tr'
                    ? 'KA122 projeleri, henüz akreditasyona sahip olmayan okulların küçük ölçekli ve yüksek etkili hareketlilikler gerçekleştirmesini hedefler. Başvuruda okulun mevcut ihtiyaçları, katılımcı profili, ev sahibi işletmeyle planlanan iş takvimi ve beklenen somut mesleki kazanımlar detaylandırılır.'
                    : 'KA122 empowers non-accredited schools to carry out high-impact, small-scale mobilities. Applications detail institutional needs, participant profiles, workplace learning programmes, and tangible ESCO competencies.'}
                </p>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 mb-1">
                    {locale === 'tr' ? 'Kurallar & Kısıtlamalar' : 'Eligibility Rules & Constraints'}
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                    <li>
                      {locale === 'tr' ? 'Maksimum katılımcı sayısı: 30 kişi' : 'Maximum participants: 30 individuals per project'}
                    </li>
                    <li>
                      {locale === 'tr' ? 'Proje süresi: 6 ila 18 ay' : 'Project duration: 6 to 18 months'}
                    </li>
                    <li>
                      {locale === 'tr'
                        ? 'Ardışık başvuru limiti: 5 ardışık çağrı yılı içinde en fazla 3 proje'
                        : 'Application cap: Maximum 3 approved projects within 5 consecutive call years'}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
            >
              {locale === 'tr' ? 'Kapat' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
