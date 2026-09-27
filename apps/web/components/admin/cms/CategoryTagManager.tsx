'use client';

import React, { useState, useEffect } from 'react';
import { LibraryCategory, CreateLibraryCategoryDto } from '@mobility-nexus/types';
import {
  FolderPlus,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Tag,
  Layers,
  FileText,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Award,
  Bookmark,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';

interface CategoryTagManagerProps {
  onCategoryChanged?: () => void;
  availableTags?: string[];
}

const AVAILABLE_ICONS = [
  { name: 'FileText', label: 'Belge / Form' },
  { name: 'BookOpen', label: 'Rehber / Kitap' },
  { name: 'Layers', label: 'Şablon / Katman' },
  { name: 'ShieldCheck', label: 'Hukuk / Güvenlik' },
  { name: 'Sparkles', label: 'Resmi / Yıldız' },
  { name: 'Award', label: 'Akreditasyon / Ödül' },
  { name: 'Bookmark', label: 'Yer İmi' },
];

const AVAILABLE_COLORS = [
  { id: 'blue', label: 'Mavi (Resmi/Form)', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  { id: 'emerald', label: 'Yeşil (Uygulama/Rehber)', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  { id: 'purple', label: 'Mor (Şablon/ECVET)', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  { id: 'amber', label: 'Kehribar (Hukuk/Sözleşme)', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  { id: 'indigo', label: 'İndigo (Komisyon/Program)', bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  { id: 'rose', label: 'Gül (Öncelik/Önemli)', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
];

export function CategoryTagManager({ onCategoryChanged, availableTags = [] }: CategoryTagManagerProps) {
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<LibraryCategory | null>(null);

  // Form fields
  const [code, setCode] = useState('');
  const [nameTr, setNameTr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [descriptionTr, setDescriptionTr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [icon, setIcon] = useState('FileText');
  const [colorBadge, setColorBadge] = useState('blue');
  const [orderIndex, setOrderIndex] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tags state
  const [systemTags, setSystemTags] = useState<string[]>([
    'KA121',
    'KA122',
    'VET',
    'Akreditasyon',
    'Bütçe',
    'Learning Agreement',
    'ECVET',
    'EQF',
    'Europass',
    'Program Rehberi',
    'Resmi',
    'Yeşil Seyahat',
    'Yapay Zeka',
    'Endüstri 4.0',
    'Staj Sözleşmesi',
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/library/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (e: any) {
      console.error('Failed to load categories:', e);
      setErrorMsg('Kategoriler yüklenirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setCode('');
    setNameTr('');
    setNameEn('');
    setSlug('');
    setDescriptionTr('');
    setDescriptionEn('');
    setIcon('FileText');
    setColorBadge('blue');
    setOrderIndex(categories.length + 1);
    setIsActive(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: LibraryCategory) => {
    setEditingCategory(cat);
    setCode(cat.code);
    setNameTr(cat.nameTr);
    setNameEn(cat.nameEn);
    setSlug(cat.slug);
    setDescriptionTr(cat.descriptionTr || '');
    setDescriptionEn(cat.descriptionEn || '');
    setIcon(cat.icon || 'FileText');
    setColorBadge(cat.colorBadge || 'blue');
    setOrderIndex(cat.orderIndex || 1);
    setIsActive(cat.isActive ?? true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload: CreateLibraryCategoryDto = {
      code: code.trim().toUpperCase(),
      nameTr: nameTr.trim(),
      nameEn: nameEn.trim(),
      slug: slug.trim().toLowerCase() || code.trim().toLowerCase(),
      descriptionTr: descriptionTr.trim(),
      descriptionEn: descriptionEn.trim(),
      icon,
      colorBadge,
      orderIndex: Number(orderIndex),
      isActive,
    };

    try {
      const isEditing = !!editingCategory;
      const url = isEditing
        ? `/api/admin/library/categories/${editingCategory.id}`
        : '/api/admin/library/categories';
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

      setSuccessMsg(
        isEditing ? 'Kategori başarıyla güncellendi.' : 'Yeni kategori başarıyla oluşturuldu.'
      );
      setIsModalOpen(false);
      await fetchCategories();
      onCategoryChanged?.();
    } catch (err: any) {
      setErrorMsg(err.message || 'Kategori kaydedilirken hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" kategorisini kaldırmak istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/library/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`"${name}" kategorisi başarıyla kaldırıldı.`);
        await fetchCategories();
        onCategoryChanged?.();
      } else {
        alert(data.error || 'Kategori silinemedi.');
      }
    } catch (e) {
      console.error('Error deleting category:', e);
      alert('Kategori silinirken hata oluştu.');
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim().replace(/^#/, '');
    if (!tag) return;
    if (systemTags.includes(tag)) {
      setNewTagInput('');
      return;
    }
    setSystemTags((prev) => [...prev, tag]);
    setNewTagInput('');
    setSuccessMsg(`"${tag}" etiketi listeye eklendi.`);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSystemTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'Layers':
        return <Layers className="w-4 h-4" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Award':
        return <Award className="w-4 h-4" />;
      case 'Bookmark':
        return <Bookmark className="w-4 h-4" />;
      case 'FileText':
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getColorClass = (colorId: string) => {
    const c = AVAILABLE_COLORS.find((item) => item.id === colorId);
    return c
      ? `${c.bg} ${c.text} ${c.border}`
      : 'bg-slate-100 text-slate-800 border-slate-200';
  };

  // Merge availableTags into display
  const allUniqueTags = Array.from(new Set([...systemTags, ...availableTags]));

  return (
    <div className="space-y-6">
      {/* Alert Banners */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Category Management Header & List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 m-0">
                Kütüphane & Pazar Yeri Kategorileri
              </h2>
            </div>
            <p className="text-xs text-slate-500 m-0">
              Dokümanların ve eğitim içeriklerinin filtreleme taksonomisini yönetin, sıralamasını düzenleyin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchCategories}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Kategorileri Yenile"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Kategori Ekle</span>
            </button>
          </div>
        </div>

        {/* Categories Table / Cards */}
        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">Kategoriler yükleniyor...</div>
        ) : categories.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">Henüz tanımlı kategori bulunamadı.</div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${getColorClass(
                      cat.colorBadge
                    )}`}
                  >
                    {renderIcon(cat.icon)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">{cat.nameTr}</span>
                      <span className="text-[11px] text-slate-400 italic font-medium">({cat.nameEn})</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                        {cat.code}
                      </span>
                      {cat.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Aktif
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                          Pasif
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">Sıra: {cat.orderIndex}</span>
                    </div>

                    {cat.descriptionTr && (
                      <p className="text-xs text-slate-500 m-0 leading-relaxed">
                        {cat.descriptionTr}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.nameTr)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                    title="Kategoriyi Kaldır"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Global Etiket / Tag Yönetimi */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                <Tag className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 m-0">
                Merkezi Erasmus+ Etiket Havuzu
              </h2>
            </div>
            <p className="text-xs text-slate-500 m-0">
              Dokümanlarda, kurslarda ve işbaşı ilanlarında kullanılan ortak anahtar kelimeleri ve etiketleri düzenleyin.
            </p>
          </div>

          {/* Quick Add Tag Form */}
          <form onSubmit={handleAddTag} className="flex items-center gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Yeni etiket (örn: SiberGüvenlik)"
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 w-48 sm:w-56"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ekle</span>
            </button>
          </form>
        </div>

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-2 pt-2">
          {allUniqueTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                title={`#${tag} etiketini kaldır`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 3. Category Create / Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold m-0">
                  {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Tanımla'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Kodu *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="FORMS, GUIDES..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-blue-600 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="forms, guides..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Adı (TR) *</label>
                <input
                  type="text"
                  required
                  value={nameTr}
                  onChange={(e) => setNameTr(e.target.value)}
                  placeholder="Örn: Resmi Başvuru Formları & Web Form Rehberleri"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Adı (EN) *</label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Örn: Official Application Forms & Guidelines"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Açıklama (TR)</label>
                <textarea
                  rows={2}
                  value={descriptionTr}
                  onChange={(e) => setDescriptionTr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">İkon</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {AVAILABLE_ICONS.map((i) => (
                      <option key={i.name} value={i.name}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Renk Rozeti</label>
                  <select
                    value={colorBadge}
                    onChange={(e) => setColorBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    {AVAILABLE_COLORS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sıralama İndeksi</label>
                  <input
                    type="number"
                    min={1}
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durum</label>
                  <select
                    value={isActive ? 'ACTIVE' : 'INACTIVE'}
                    onChange={(e) => setIsActive(e.target.value === 'ACTIVE')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="ACTIVE">Aktif (Yayında)</option>
                    <option value="INACTIVE">Pasif (Gizli)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
