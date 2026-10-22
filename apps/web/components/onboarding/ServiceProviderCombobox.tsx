'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  PredefinedServiceProvider,
  PREDEFINED_SERVICE_PROVIDERS,
} from '../../lib/data/service-providers';

const COUNTRY_FLAGS: Record<string, string> = {
  AT: '🇦🇹',
  BG: '🇧🇬',
  HR: '🇭🇷',
  CY: '🇨🇾',
  CZ: '🇨🇿',
  DK: '🇩🇰',
  EE: '🇪🇪',
  FI: '🇫🇮',
  DE: '🇩🇪',
  GR: '🇬🇷',
  HU: '🇭🇺',
  IE: '🇮🇪',
  IT: '🇮🇹',
  LV: '🇱🇻',
  LI: '🇱🇮',
  LT: '🇱🇹',
  MT: '🇲🇹',
  MK: '🇲🇰',
  PL: '🇵🇱',
  PT: '🇵🇹',
  RO: '🇷🇴',
  RS: '🇷🇸',
  SK: '🇸🇰',
  SI: '🇸🇮',
  ES: '🇪🇸',
  SE: '🇸🇪',
  TR: '🇹🇷',
  FR: '🇫🇷',
  NL: '🇳🇱',
  BE: '🇧🇪',
};

interface ServiceProviderComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onSelectProvider: (provider: PredefinedServiceProvider | null) => void;
  selectedProvider: PredefinedServiceProvider | null;
  locale: string;
  required?: boolean;
}

export default function ServiceProviderCombobox({
  value,
  onChange,
  onSelectProvider,
  selectedProvider,
  locale,
  required = true,
}: ServiceProviderComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtered providers based on search query
  const filteredProviders = useMemo(() => {
    const q = (value || '').trim().toLowerCase();
    if (!q) {
      return PREDEFINED_SERVICE_PROVIDERS;
    }
    return PREDEFINED_SERVICE_PROVIDERS.filter((sp) => {
      if (sp.name.toLowerCase().includes(q)) return true;
      if (sp.city.toLowerCase().includes(q)) return true;
      if (sp.country.toLowerCase().includes(q)) return true;
      if (sp.countryCode.toLowerCase().includes(q)) return true;
      if (sp.generalEmail.toLowerCase().includes(q)) return true;
      if (sp.websiteUrl.toLowerCase().includes(q)) return true;
      if (
        sp.aliasNames &&
        sp.aliasNames.some((alias) => alias.toLowerCase().includes(q))
      ) {
        return true;
      }
      if (sp.contactPerson && sp.contactPerson.toLowerCase().includes(q)) {
        return true;
      }
      return false;
    });
  }, [value]);

  // Handle selecting an item
  const handleSelect = (provider: PredefinedServiceProvider) => {
    onChange(provider.name);
    onSelectProvider(provider);
    setIsOpen(false);
  };

  // Handle custom name input (not on list)
  const handleCustomEntry = () => {
    onSelectProvider(null);
    setIsOpen(false);
  };

  // Handle clearing selection
  const handleClear = () => {
    onChange('');
    onSelectProvider(null);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredProviders.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredProviders.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredProviders.length
        ) {
          handleSelect(filteredProviders[highlightedIndex]);
        } else if (value.trim()) {
          handleCustomEntry();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Auto-scroll list when highlighted item changes
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider m-0">
          {locale === 'tr'
            ? 'Kurumun Yasal Tam Adı (Hizmet Sağlayıcı Rehberi)'
            : 'Legal Name of Organisation (Service Provider Directory)'}{' '}
          {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
          <span>🇪🇺</span>
          <span>
            {locale === 'tr'
              ? '71 Kayıtlı Hizmet Sağlayıcı'
              : '71 Pre-listed European Providers'}
          </span>
        </span>
      </div>

      <div className="relative">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            required={required}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (selectedProvider && selectedProvider.name !== e.target.value) {
                onSelectProvider(null);
              }
              setIsOpen(true);
              setHighlightedIndex(0);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              locale === 'tr'
                ? 'Kurum adınızı arayın veya listede yoksanız serbestçe yazın (Örn: Euromind, Lexema, Safeer...)'
                : 'Search organisation name or type custom name (e.g. Euromind, Lexema, Safeer...)'
            }
            className={`w-full px-4 py-2.5 pr-20 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 ${
              selectedProvider
                ? 'border-emerald-300 bg-emerald-50/20 text-slate-900 focus:ring-emerald-600 font-medium'
                : 'border-slate-200 bg-white text-slate-900 focus:ring-emerald-600'
            }`}
          />

          <div className="absolute right-2 flex items-center gap-1">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                title={locale === 'tr' ? 'Temizle' : 'Clear'}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen((prev) => !prev);
                inputRef.current?.focus();
              }}
              title={locale === 'tr' ? 'Listeyi Aç/Kapat' : 'Toggle list'}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className={`text-[10px] block transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-semibold flex items-center gap-1.5">
                <span>📋</span>
                <span>
                  {locale === 'tr'
                    ? `${filteredProviders.length} kuruluş bulundu`
                    : `${filteredProviders.length} organisations found`}
                </span>
              </span>
              <span className="text-[10px] text-slate-400">
                {locale === 'tr'
                  ? 'Listeden seçin veya kendi adınızı girin'
                  : 'Select from list or type custom name'}
              </span>
            </div>

            <ul
              ref={listRef}
              className="max-h-64 overflow-y-auto divide-y divide-slate-100 m-0 p-0 list-none text-left"
            >
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider, index) => {
                  const isHighlighted = index === highlightedIndex;
                  const isSelected = selectedProvider?.id === provider.id;
                  const flag = COUNTRY_FLAGS[provider.countryCode] || '🇪🇺';

                  return (
                    <li
                      key={provider.id}
                      onClick={() => handleSelect(provider)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`px-3.5 py-2.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-950 font-bold'
                          : isHighlighted
                          ? 'bg-blue-50 text-blue-950'
                          : 'hover:bg-slate-50 text-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-base shrink-0">{flag}</span>
                            <span className="font-bold text-xs text-slate-900">
                              {provider.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 text-[10px] font-medium">
                              {provider.country} • {provider.city}
                            </span>
                          </div>

                          {/* Details Row: Website and Email */}
                          <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1 text-blue-700">
                              <span>🌐</span>
                              <span className="truncate max-w-[180px]">
                                {provider.websiteUrl.replace(/^https?:\/\//, '')}
                              </span>
                            </span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <span>✉️</span>
                              <span className="truncate max-w-[200px]">
                                {provider.generalEmail}
                              </span>
                            </span>
                          </div>

                          {/* Activity Description snippet */}
                          {provider.activityDescription && (
                            <p className="mt-1 text-[11px] text-slate-500 m-0 line-clamp-1 italic">
                              {provider.activityDescription}
                            </p>
                          )}
                        </div>

                        {isSelected && (
                          <span className="text-emerald-600 font-bold text-xs shrink-0 mt-0.5">
                            ✓
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-4 text-center text-xs text-slate-500">
                  {locale === 'tr'
                    ? 'Eşleşen listeli kuruluş bulunamadı.'
                    : 'No matching listed organisation found.'}
                </li>
              )}

              {/* Option to proceed with custom name if not listed */}
              {value.trim().length > 0 && (
                <li
                  onClick={handleCustomEntry}
                  className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-semibold text-blue-800 border-t border-slate-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <span>➕</span>
                    <span>
                      {locale === 'tr'
                        ? `Listede Yok (Yeni Kurum Olarak Devam Et): "${value}"`
                        : `Not on List (Register as Custom Organisation): "${value}"`}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {locale === 'tr' ? 'Serbest Giriş →' : 'Custom Entry →'}
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Selected Provider Info Banner */}
      {selectedProvider && (
        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5 animate-fadeIn">
          <span className="text-base shrink-0 mt-0.5">✅</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-bold text-emerald-900">
                {selectedProvider.name} {locale === 'tr' ? 'bilgileri yüklendi' : 'details loaded'}
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer p-0 bg-transparent border-none"
              >
                {locale === 'tr' ? 'Seçimi Değiştir' : 'Change Selection'}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-emerald-800/90 leading-relaxed m-0">
              {locale === 'tr'
                ? `Web sitesi (${selectedProvider.websiteUrl}), e-posta (${selectedProvider.generalEmail}) ve ülke (${selectedProvider.country}) otomatik tamamlandı. Lütfen OID numarası, iletişim telefonu ve adres gibi eksik bilgileri doldurarak kaydınızı tamamlayınız.`
                : `Website (${selectedProvider.websiteUrl}), email (${selectedProvider.generalEmail}), and country (${selectedProvider.country}) were pre-filled. Please complete missing fields such as OID, contact telephone, and address.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
