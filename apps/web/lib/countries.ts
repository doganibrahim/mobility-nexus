/**
 * ErasmusMobility - Comprehensive Erasmus+ Eligible Countries Reference
 * 
 * Official 33 Erasmus+ Programme Countries:
 * - 27 European Union Member States
 * - 6 Third Countries Associated to the Programme (Türkiye, Norveç, İzlanda, Lihtenştayn, Kuzey Makedonya, Sırbistan)
 * + İsviçre (CH) ve Birleşik Krallık (UK) ikili/özel ortaklık opsiyonları
 */

export interface ErasmusCountry {
  code: string;
  nameTr: string;
  nameEn: string;
  flagEmoji: string;
  isEuMember: boolean;
}

export const ERASMUS_COUNTRIES: ErasmusCountry[] = [
  // European Union (27)
  { code: 'DE', nameTr: 'Almanya', nameEn: 'Germany', flagEmoji: '🇩🇪', isEuMember: true },
  { code: 'AT', nameTr: 'Avusturya', nameEn: 'Austria', flagEmoji: '🇦🇹', isEuMember: true },
  { code: 'BE', nameTr: 'Belçika', nameEn: 'Belgium', flagEmoji: '🇧🇪', isEuMember: true },
  { code: 'BG', nameTr: 'Bulgaristan', nameEn: 'Bulgaria', flagEmoji: '🇧🇬', isEuMember: true },
  { code: 'CZ', nameTr: 'Çekya', nameEn: 'Czech Republic', flagEmoji: '🇨🇿', isEuMember: true },
  { code: 'DK', nameTr: 'Danimarka', nameEn: 'Denmark', flagEmoji: '🇩🇰', isEuMember: true },
  { code: 'EE', nameTr: 'Estonya', nameEn: 'Estonia', flagEmoji: '🇪🇪', isEuMember: true },
  { code: 'FI', nameTr: 'Finlandiya', nameEn: 'Finland', flagEmoji: '🇫🇮', isEuMember: true },
  { code: 'FR', nameTr: 'Fransa', nameEn: 'France', flagEmoji: '🇫🇷', isEuMember: true },
  { code: 'HR', nameTr: 'Hırvatistan', nameEn: 'Croatia', flagEmoji: '🇭🇷', isEuMember: true },
  { code: 'NL', nameTr: 'Hollanda', nameEn: 'Netherlands', flagEmoji: '🇳🇱', isEuMember: true },
  { code: 'IE', nameTr: 'İrlanda', nameEn: 'Ireland', flagEmoji: '🇮🇪', isEuMember: true },
  { code: 'ES', nameTr: 'İspanya', nameEn: 'Spain', flagEmoji: '🇪🇸', isEuMember: true },
  { code: 'SE', nameTr: 'İsveç', nameEn: 'Sweden', flagEmoji: '🇸🇪', isEuMember: true },
  { code: 'IT', nameTr: 'İtalya', nameEn: 'Italy', flagEmoji: '🇮🇹', isEuMember: true },
  { code: 'CY', nameTr: 'Kıbrıs', nameEn: 'Cyprus', flagEmoji: '🇨🇾', isEuMember: true },
  { code: 'LV', nameTr: 'Letonya', nameEn: 'Latvia', flagEmoji: '🇱🇻', isEuMember: true },
  { code: 'LT', nameTr: 'Litvanya', nameEn: 'Lithuania', flagEmoji: '🇱🇹', isEuMember: true },
  { code: 'LU', nameTr: 'Lüksemburg', nameEn: 'Luxembourg', flagEmoji: '🇱🇺', isEuMember: true },
  { code: 'HU', nameTr: 'Macaristan', nameEn: 'Hungary', flagEmoji: '🇭🇺', isEuMember: true },
  { code: 'MT', nameTr: 'Malta', nameEn: 'Malta', flagEmoji: '🇲🇹', isEuMember: true },
  { code: 'PL', nameTr: 'Polonya', nameEn: 'Poland', flagEmoji: '🇵🇱', isEuMember: true },
  { code: 'PT', nameTr: 'Portekiz', nameEn: 'Portugal', flagEmoji: '🇵🇹', isEuMember: true },
  { code: 'RO', nameTr: 'Romanya', nameEn: 'Romania', flagEmoji: '🇷🇴', isEuMember: true },
  { code: 'SK', nameTr: 'Slovakya', nameEn: 'Slovakia', flagEmoji: '🇸🇰', isEuMember: true },
  { code: 'SI', nameTr: 'Slovenya', nameEn: 'Slovenia', flagEmoji: '🇸🇮', isEuMember: true },
  { code: 'GR', nameTr: 'Yunanistan', nameEn: 'Greece', flagEmoji: '🇬🇷', isEuMember: true },

  // Third Countries Associated to the Programme (6)
  { code: 'TR', nameTr: 'Türkiye', nameEn: 'Turkey', flagEmoji: '🇹🇷', isEuMember: false },
  { code: 'NO', nameTr: 'Norveç', nameEn: 'Norway', flagEmoji: '🇳🇴', isEuMember: false },
  { code: 'IS', nameTr: 'İzlanda', nameEn: 'Iceland', flagEmoji: '🇮🇸', isEuMember: false },
  { code: 'LI', nameTr: 'Lihtenştayn', nameEn: 'Liechtenstein', flagEmoji: '🇱🇮', isEuMember: false },
  { code: 'MK', nameTr: 'Kuzey Makedonya', nameEn: 'North Macedonia', flagEmoji: '🇲🇰', isEuMember: false },
  { code: 'RS', nameTr: 'Sırbistan', nameEn: 'Serbia', flagEmoji: '🇷🇸', isEuMember: false },

  // Bilateral & Partner Countries
  { code: 'CH', nameTr: 'İsviçre', nameEn: 'Switzerland', flagEmoji: '🇨🇭', isEuMember: false },
  { code: 'UK', nameTr: 'Birleşik Krallık', nameEn: 'United Kingdom', flagEmoji: '🇬🇧', isEuMember: false },
];

// Quick Flag + Name Dictionary (e.g. 'DE' -> '🇩🇪 Almanya')
export const ERASMUS_COUNTRY_FLAGS_TR: Record<string, string> = ERASMUS_COUNTRIES.reduce(
  (acc, c) => {
    acc[c.code] = `${c.flagEmoji} ${c.nameTr}`;
    return acc;
  },
  {} as Record<string, string>
);

export const ERASMUS_COUNTRY_FLAGS_EN: Record<string, string> = ERASMUS_COUNTRIES.reduce(
  (acc, c) => {
    acc[c.code] = `${c.flagEmoji} ${c.nameEn}`;
    return acc;
  },
  {} as Record<string, string>
);

export const ERASMUS_COUNTRY_MAP_TR: Record<string, string> = ERASMUS_COUNTRIES.reduce(
  (acc, c) => {
    acc[c.code] = c.nameTr;
    return acc;
  },
  {} as Record<string, string>
);

export const ERASMUS_COUNTRY_MAP_EN: Record<string, string> = ERASMUS_COUNTRIES.reduce(
  (acc, c) => {
    acc[c.code] = c.nameEn;
    return acc;
  },
  {} as Record<string, string>
);

export function getCountryFlagLabel(code?: string | null, lang: 'tr' | 'en' = 'tr'): string {
  if (!code) return '';
  const upper = code.toUpperCase();
  const dict = lang === 'en' ? ERASMUS_COUNTRY_FLAGS_EN : ERASMUS_COUNTRY_FLAGS_TR;
  return dict[upper] || upper;
}

export function getCountryName(code?: string | null, lang: 'tr' | 'en' = 'tr'): string {
  if (!code) return '';
  const upper = code.toUpperCase();
  const dict = lang === 'en' ? ERASMUS_COUNTRY_MAP_EN : ERASMUS_COUNTRY_MAP_TR;
  return dict[upper] || upper;
}
