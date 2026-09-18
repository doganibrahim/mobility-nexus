'use client';

import React from 'react';
import { ApplicationDraftDeclarations, FormType } from '../../../lib/application-draft-schema';

interface DeclarationsSectionProps {
  data: ApplicationDraftDeclarations;
  formType: FormType;
  onChange: (updated: Partial<ApplicationDraftDeclarations>) => void;
}

export default function DeclarationsSection({
  data,
  formType,
  onChange,
}: DeclarationsSectionProps) {
  const isKa121 = formType === 'KA121';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>⚖️</span>
            <span>Bölüm 6: Resmi Beyanlar ve Doğruluk Onayları</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Erasmus+ Program Rehberi ve Ulusal Ajans resmi başvuru kuralları doğrultusunda taahhütler
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Son Adım
        </span>
      </div>

      <div className="space-y-3">
        {/* 1. Akreditasyon / Proje Uygunluğu */}
        <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-xs">
          <input
            type="checkbox"
            checked={data.confirmAccreditationOrPlan}
            onChange={(e) => onChange({ confirmAccreditationOrPlan: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 accent-blue-700"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-900">
              {isKa121
                ? 'Kurumsal Akreditasyon ve Erasmus Planı Uygunluğu (FIN-01 / FIN-02)'
                : 'KA122 Başvuru Uygunluk ve Bütçe Kuralları (CTX-06 / DEC-01)'}
            </span>
            <p className="text-slate-600 mt-0.5">
              {isKa121
                ? 'Kurumumuzun onaylı Erasmus Akreditasyonundaki hedeflere uygun hareket ettiğimizi ve katılımcı sayılarının kurumsal kapasitemizle orantılı olduğunu onaylıyorum.'
                : 'Kurumumuzun son 36 ayda en fazla 2 KA122 hibesi kuralına uyduğunu, talep edilen katılımcı ve gün sayısının kurumsal kapasitemizle örtüştüğünü beyan ederim.'}
            </p>
          </div>
        </label>

        {/* 2. Kapasite ve Absorpsiyon */}
        <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-xs">
          <input
            type="checkbox"
            checked={data.confirmAbsorptionCapacity}
            onChange={(e) => onChange({ confirmAbsorptionCapacity: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 accent-blue-700"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-900">
              Operasyonel ve Mali Yönetim Kapasitesi Teyidi (DEC-02)
            </span>
            <p className="text-slate-600 mt-0.5">
              Kurumumuzun hareketliliği yürütecek yeterli idari, mali ve pedagojik personele sahip olduğunu, katılımcıların güvenliğini sağlayacak imkanların mevcut olduğunu teyit ederim.
            </p>
          </div>
        </label>

        {/* 3. Erasmus Kalite Standartları */}
        <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-xs">
          <input
            type="checkbox"
            checked={data.confirmErasmusQualityStandards}
            onChange={(e) => onChange({ confirmErasmusQualityStandards: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 accent-blue-700"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-900">
              Erasmus Kalite Standartlarına Bağlılık (FIN-03 / DEC-03)
            </span>
            <p className="text-slate-600 mt-0.5">
              Tüm faaliyet aşamalarında temel kalite standartlarına (katılımcıların ücretsiz katılımı, şeffaf seçim, adil mentörlük, sonuçların tanınması) tam riayet edileceğini taahhüt ederim.
            </p>
          </div>
        </label>

        {/* 4. Çıkar Çatışması */}
        <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-xs">
          <input
            type="checkbox"
            checked={data.confirmNoConflictOfInterest}
            onChange={(e) => onChange({ confirmNoConflictOfInterest: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 accent-blue-700"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-900">
              Çıkar Çatışması Bulunmadığı Beyanı (FIN-04)
            </span>
            <p className="text-slate-600 mt-0.5">
              Katılımcı seçimi, hizmet alımı veya refakatçi görevlendirmelerinde hiçbir kişisel veya kurumsal çıkar çatışması bulunmadığını beyan ederim.
            </p>
          </div>
        </label>

        {/* 5. Çifte Finansman */}
        <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-xs">
          <input
            type="checkbox"
            checked={data.confirmNoDoubleFunding}
            onChange={(e) => onChange({ confirmNoDoubleFunding: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 accent-blue-700"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-900">
              Çifte Finansman (Double Funding) Olmadığı Beyanı (FIN-05)
            </span>
            <p className="text-slate-600 mt-0.5">
              Bu başvuru kapsamında talep edilen faaliyet ve maliyet kalemlerinin başka hiçbir AB veya kamu kaynağından finanse edilmediğini beyan ederim.
            </p>
          </div>
        </label>

        {/* 6. Declaration on Honour */}
        <label className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer shadow-xs">
          <input
            type="checkbox"
            checked={data.confirmDeclarationOnHonour}
            onChange={(e) => onChange({ confirmDeclarationOnHonour: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-blue-400 text-blue-700 focus:ring-blue-600 accent-blue-700"
          />
          <div className="text-xs">
            <span className="font-bold text-blue-950">
              Resmi Doğruluk Beyanı (Declaration on Honour - FIN-06 / DEC-04)
            </span>
            <p className="text-blue-800 mt-0.5">
              Bu başvuru taslağında yer alan tüm bilgilerin eksiksiz ve doğru olduğunu, resmi başvuru sisteminde onaylanacak Declaration on Honour belgesi ile aynı hükümleri taşıyacağını kabul ve beyan ederim.
            </p>
          </div>
        </label>
      </div>

      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">📋</span>
          <div>
            <strong>Soru ve Veri Seti Tamamlama:</strong> Bu modüldeki cevaplarınız yerel belleğe (LocalStorage) kaydedilir ve resmi başvuru taslağınız için hazır tutulur.
          </div>
        </div>
      </div>
    </div>
  );
}
