'use client';

import React, { useState, useEffect } from 'react';
import { LibraryDocument } from '@/lib/library-db';
import { X, Upload, Save, AlertCircle, CheckCircle, FileText } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentToEdit?: LibraryDocument | null;
  onSuccess: () => void;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  documentToEdit,
  onSuccess,
}: DocumentUploadModalProps) {
  if (!isOpen) return null;

  const isEditing = !!documentToEdit;

  const [titleTr, setTitleTr] = useState(documentToEdit?.titleTr || '');
  const [titleEn, setTitleEn] = useState(documentToEdit?.titleEn || '');
  const [category, setCategory] = useState<LibraryDocument['category']>(
    documentToEdit?.category || 'FORMS'
  );
  const [fileFormat, setFileFormat] = useState<LibraryDocument['fileFormat']>(
    documentToEdit?.fileFormat || 'PDF'
  );
  const [fileSize, setFileSize] = useState(documentToEdit?.fileSize || '1.5 MB');
  const [downloadUrl, setDownloadUrl] = useState(documentToEdit?.downloadUrl || '');
  const [descriptionTr, setDescriptionTr] = useState(documentToEdit?.descriptionTr || '');
  const [descriptionEn, setDescriptionEn] = useState(documentToEdit?.descriptionEn || '');
  const [tagsInput, setTagsInput] = useState((documentToEdit?.tags || []).join(', '));
  const [isFeatured, setIsFeatured] = useState(documentToEdit?.isFeatured || false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (documentToEdit) {
      setTitleTr(documentToEdit.titleTr);
      setTitleEn(documentToEdit.titleEn);
      setCategory(documentToEdit.category);
      setFileFormat(documentToEdit.fileFormat);
      setFileSize(documentToEdit.fileSize || '1.5 MB');
      setDownloadUrl(documentToEdit.downloadUrl);
      setDescriptionTr(documentToEdit.descriptionTr);
      setDescriptionEn(documentToEdit.descriptionEn);
      setTagsInput(documentToEdit.tags.join(', '));
      setIsFeatured(!!documentToEdit.isFeatured);
    } else {
      setTitleTr('');
      setTitleEn('');
      setCategory('FORMS');
      setFileFormat('PDF');
      setFileSize('1.5 MB');
      setDownloadUrl('');
      setDescriptionTr('');
      setDescriptionEn('');
      setTagsInput('Erasmus+, Rehber, KA121');
      setIsFeatured(false);
    }
    setErrorMsg(null);
    setIsDone(false);
  }, [documentToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      titleTr,
      titleEn,
      category,
      fileFormat,
      fileSize,
      downloadUrl,
      descriptionTr,
      descriptionEn,
      tags,
      isFeatured,
    };

    try {
      const url = isEditing
        ? `/api/admin/library/documents/${documentToEdit.id}`
        : '/api/admin/library/documents';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'İşlem başarısız oldu.');
      }

      setIsDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="doc-modal-title" className="text-sm font-bold">
                {isEditing ? 'Kütüphane Dokümanını Güncelle' : 'Kütüphaneye Yeni Doküman / Rehber Ekle'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEditing ? `ID: ${documentToEdit?.id}` : 'Avrupa Komisyonu form ve rehber yayını'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Pencereyi kapat"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isDone && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Doküman başarıyla {isEditing ? 'güncellendi' : 'yayınlandı'}!</span>
            </div>
          )}

          {/* Titles */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Doküman Başlığı (TR) *</label>
            <input
              type="text"
              required
              value={titleTr}
              onChange={(e) => setTitleTr(e.target.value)}
              placeholder="Örn: 2026 KA121-VET Hibe Tahsisat Form Rehberi"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Doküman Başlığı (EN)</label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Örn: 2026 KA121-VET Annual Grant Allocation Form Guide"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Category, Format, File Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
              >
                <option value="FORMS">📝 Başvuru Formları (FORMS)</option>
                <option value="GUIDES">📘 Rehber & Standartlar (GUIDES)</option>
                <option value="TEMPLATES">📄 Resmi Şablonlar (TEMPLATES)</option>
                <option value="OFFICIAL">🏛️ Resmi Program Rehberi (OFFICIAL)</option>
                <option value="LEGAL">⚖️ Hukuki & KVKK (LEGAL)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dosya Formatı</label>
              <select
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
              >
                <option value="PDF">PDF Dokümanı</option>
                <option value="DOCX">Word (DOCX)</option>
                <option value="XLSX">Excel (XLSX)</option>
                <option value="ZIP">Arşiv (ZIP)</option>
                <option value="LINK">Dış Bağlantı (URL)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dosya Boyutu</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="Örn: 2.4 MB"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          {/* Download URL */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              İndirme Bağlantısı / URL (Örn: /guides/belge.pdf veya https://...) *
            </label>
            <input
              type="text"
              required
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="https://... veya /templates/dosya.docx"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Descriptions */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Açıklama (TR) *</label>
            <textarea
              rows={2}
              required
              value={descriptionTr}
              onChange={(e) => setDescriptionTr(e.target.value)}
              placeholder="Dokümanın içeriği, hedef kitlesi ve resmi kullanım amacı..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          {/* Tags & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Etiketler (Virgülle)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="KA121, Akreditasyon, 2026"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
                />
                <span>Öne Çıkan Belge Olarak İşaretle</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors shadow-xs cursor-pointer"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
              <span>{isSubmitting ? 'Kaydediliyor...' : isEditing ? 'Güncelle' : 'Yayına Al'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
