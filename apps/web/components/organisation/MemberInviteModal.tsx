'use client';

import React, { useState } from 'react';

import { apiClient } from '../../lib/api-client';

interface MemberInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgName: string;
  orgId?: string;
}

export default function MemberInviteModal({
  isOpen,
  onClose,
  orgName,
  orgId = 'current-org',
}: MemberInviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ORG_ADMIN' | 'MEMBER' | 'VIEWER'>('MEMBER');
  const [isSending, setIsSending] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<{
    token: string;
    url: string;
    email: string;
    role: string;
    expiresAt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    setIsSending(true);
    try {
      const invite = await apiClient.createInvitation(orgId, {
        email: email.trim(),
        role,
      });

      setGeneratedInvite({
        token: invite.token,
        url: invite.inviteUrl,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
      });
    } catch (err: any) {
      alert(err.message || 'Davet oluşturulamadı.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = () => {
    if (generatedInvite) {
      navigator.clipboard.writeText(generatedInvite.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="enterprise-card p-6 bg-white w-full max-w-lg shadow-2xl rounded-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 m-0">
              👥 Kuruma Ekip Üyesi Davet Et
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              {orgName || 'Kurum Paneli'} • Güvenli Tek Kullanımlık Davet Tokenı
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        {!generatedInvite ? (
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Davet Edilecek Yetkilinin E-Postası *
              </label>
              <input
                type="email"
                required
                className="enterprise-input"
                placeholder="ornek.ogretmen@okul.edu.tr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Atanacak Kurum İçi Rol *
              </label>
              <select
                className="enterprise-input bg-white cursor-pointer font-medium"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as 'ORG_ADMIN' | 'MEMBER' | 'VIEWER')
                }
              >
                <option value="MEMBER">MEMBER (Ekip Üyesi / Proje Yazarı)</option>
                <option value="ORG_ADMIN">ORG_ADMIN (Kurum Koordinatörü & Yönetici)</option>
                <option value="VIEWER">VIEWER (Yalnızca Görüntüleyici / Denetçi)</option>
              </select>
            </div>

            <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed">
              🔒 <strong className="font-semibold text-slate-800">Güvenlik Standardı:</strong> Davet bağlantısı 48 saat boyunca geçerlidir ve tek kullanımlıktır. İşlem denetim günlüğüne (<code>audit_event</code>) otomatik kaydedilir.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="enterprise-btn-ghost text-xs"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="enterprise-btn-primary text-xs flex items-center gap-1.5"
              >
                {isSending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Üretiliyor...</span>
                  </>
                ) : (
                  <>
                    <span>✉️</span>
                    <span>Davet Bağlantısı Üret</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-900 font-medium">
              ✅ <strong className="font-semibold">Davet Başarıyla Oluşturuldu!</strong> 48 saat geçerli tek kullanımlık kayıt tokenı hazırlandı.
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-slate-500">Davet Edilen:</span>
                <span className="font-semibold font-mono text-slate-800">{generatedInvite.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-slate-500">Yetki Rolü:</span>
                <span className="enterprise-badge enterprise-badge-good text-[10px]">
                  {generatedInvite.role}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-slate-500">Son Geçerlilik:</span>
                <span className="font-mono text-slate-700">{generatedInvite.expiresAt}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Kayıt / Katılım Bağlantısı:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  className="enterprise-input font-mono text-xs bg-slate-50 text-slate-700"
                  value={generatedInvite.url}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="enterprise-btn-secondary text-xs whitespace-nowrap"
                >
                  {copied ? 'Kopyalandı! ✓' : 'Kopyala'}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setGeneratedInvite(null);
                  setEmail('');
                }}
                className="enterprise-btn-ghost text-xs"
              >
                Yeni Davet Oluştur
              </button>
              <button
                type="button"
                onClick={onClose}
                className="enterprise-btn-primary text-xs"
              >
                Kapat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
