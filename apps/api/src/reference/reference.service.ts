import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface CountryRef {
  code: string;
  nameTr: string;
  nameEn: string;
  flagEmoji?: string;
  isProgramCountry: boolean;
}

export interface SectorRef {
  code: string;
  nameTr: string;
  nameEn: string;
  iscedField?: string;
  iconName?: string;
}

@Injectable()
export class ReferenceService {
  private readonly logger = new Logger(ReferenceService.name);

  // In-memory fallback if DB is not connected (33 Erasmus+ Programme Countries + Partner Countries)
  private fallbackCountries: CountryRef[] = [
    // EU Member States (27)
    { code: 'DE', nameTr: 'Almanya', nameEn: 'Germany', flagEmoji: '🇩🇪', isProgramCountry: true },
    { code: 'AT', nameTr: 'Avusturya', nameEn: 'Austria', flagEmoji: '🇦🇹', isProgramCountry: true },
    { code: 'BE', nameTr: 'Belçika', nameEn: 'Belgium', flagEmoji: '🇧🇪', isProgramCountry: true },
    { code: 'BG', nameTr: 'Bulgaristan', nameEn: 'Bulgaria', flagEmoji: '🇧🇬', isProgramCountry: true },
    { code: 'CZ', nameTr: 'Çekya', nameEn: 'Czech Republic', flagEmoji: '🇨🇿', isProgramCountry: true },
    { code: 'DK', nameTr: 'Danimarka', nameEn: 'Denmark', flagEmoji: '🇩🇰', isProgramCountry: true },
    { code: 'EE', nameTr: 'Estonya', nameEn: 'Estonia', flagEmoji: '🇪🇪', isProgramCountry: true },
    { code: 'FI', nameTr: 'Finlandiya', nameEn: 'Finland', flagEmoji: '🇫🇮', isProgramCountry: true },
    { code: 'FR', nameTr: 'Fransa', nameEn: 'France', flagEmoji: '🇫🇷', isProgramCountry: true },
    { code: 'HR', nameTr: 'Hırvatistan', nameEn: 'Croatia', flagEmoji: '🇭🇷', isProgramCountry: true },
    { code: 'NL', nameTr: 'Hollanda', nameEn: 'Netherlands', flagEmoji: '🇳🇱', isProgramCountry: true },
    { code: 'IE', nameTr: 'İrlanda', nameEn: 'Ireland', flagEmoji: '🇮🇪', isProgramCountry: true },
    { code: 'ES', nameTr: 'İspanya', nameEn: 'Spain', flagEmoji: '🇪🇸', isProgramCountry: true },
    { code: 'SE', nameTr: 'İsveç', nameEn: 'Sweden', flagEmoji: '🇸🇪', isProgramCountry: true },
    { code: 'IT', nameTr: 'İtalya', nameEn: 'Italy', flagEmoji: '🇮🇹', isProgramCountry: true },
    { code: 'CY', nameTr: 'Kıbrıs', nameEn: 'Cyprus', flagEmoji: '🇨🇾', isProgramCountry: true },
    { code: 'LV', nameTr: 'Letonya', nameEn: 'Latvia', flagEmoji: '🇱🇻', isProgramCountry: true },
    { code: 'LT', nameTr: 'Litvanya', nameEn: 'Lithuania', flagEmoji: '🇱🇹', isProgramCountry: true },
    { code: 'LU', nameTr: 'Lüksemburg', nameEn: 'Luxembourg', flagEmoji: '🇱🇺', isProgramCountry: true },
    { code: 'HU', nameTr: 'Macaristan', nameEn: 'Hungary', flagEmoji: '🇭🇺', isProgramCountry: true },
    { code: 'MT', nameTr: 'Malta', nameEn: 'Malta', flagEmoji: '🇲🇹', isProgramCountry: true },
    { code: 'PL', nameTr: 'Polonya', nameEn: 'Poland', flagEmoji: '🇵🇱', isProgramCountry: true },
    { code: 'PT', nameTr: 'Portekiz', nameEn: 'Portugal', flagEmoji: '🇵🇹', isProgramCountry: true },
    { code: 'RO', nameTr: 'Romanya', nameEn: 'Romania', flagEmoji: '🇷🇴', isProgramCountry: true },
    { code: 'SK', nameTr: 'Slovakya', nameEn: 'Slovakia', flagEmoji: '🇸🇰', isProgramCountry: true },
    { code: 'SI', nameTr: 'Slovenya', nameEn: 'Slovenia', flagEmoji: '🇸🇮', isProgramCountry: true },
    { code: 'GR', nameTr: 'Yunanistan', nameEn: 'Greece', flagEmoji: '🇬🇷', isProgramCountry: true },

    // Third Countries Associated to the Programme (6)
    { code: 'TR', nameTr: 'Türkiye', nameEn: 'Turkey', flagEmoji: '🇹🇷', isProgramCountry: true },
    { code: 'NO', nameTr: 'Norveç', nameEn: 'Norway', flagEmoji: '🇳🇴', isProgramCountry: true },
    { code: 'IS', nameTr: 'İzlanda', nameEn: 'Iceland', flagEmoji: '🇮🇸', isProgramCountry: true },
    { code: 'LI', nameTr: 'Lihtenştayn', nameEn: 'Liechtenstein', flagEmoji: '🇱🇮', isProgramCountry: true },
    { code: 'MK', nameTr: 'Kuzey Makedonya', nameEn: 'North Macedonia', flagEmoji: '🇲🇰', isProgramCountry: true },
    { code: 'RS', nameTr: 'Sırbistan', nameEn: 'Serbia', flagEmoji: '🇷🇸', isProgramCountry: true },

    // Bilateral & Partner Countries
    { code: 'CH', nameTr: 'İsviçre', nameEn: 'Switzerland', flagEmoji: '🇨🇭', isProgramCountry: false },
    { code: 'UK', nameTr: 'Birleşik Krallık', nameEn: 'United Kingdom', flagEmoji: '🇬🇧', isProgramCountry: false },
  ];

  private fallbackSectors: SectorRef[] = [
    { code: 'ict', nameTr: 'Bilişim ve Yazılım Teknolojileri', nameEn: 'Information & Communication Technology', iscedField: '061', iconName: 'code' },
    { code: 'automotive', nameTr: 'Otomotiv ve Raylı Sistemler', nameEn: 'Automotive & Rail Systems', iscedField: '0716', iconName: 'truck' },
    { code: 'electrical', nameTr: 'Elektrik, Elektronik ve Otomasyon', nameEn: 'Electrical, Electronics & Automation', iscedField: '0713', iconName: 'cpu' },
    { code: 'machinery', nameTr: 'Makine, Mekatronik ve İmalat', nameEn: 'Machinery, Mechatronics & Manufacturing', iscedField: '0714', iconName: 'settings' },
    { code: 'health', nameTr: 'Sağlık Hizmetleri ve Biyoteknoloji', nameEn: 'Health Services & Biotechnology', iscedField: '091', iconName: 'activity' },
    { code: 'tourism', nameTr: 'Turizm, Otelcilik ve Yiyecek-İçecek', nameEn: 'Tourism, Hospitality & Catering', iscedField: '1013', iconName: 'compass' },
    { code: 'logistics', nameTr: 'Ulaştırma, Lojistik ve Tedarik Zinciri', nameEn: 'Logistics, Transport & Supply Chain', iscedField: '1041', iconName: 'package' },
    { code: 'green_energy', nameTr: 'Yenilenebilir Enerji ve Çevre Teknolojileri', nameEn: 'Renewable Energy & Green Tech', iscedField: '0712', iconName: 'sun' },
  ];

  constructor(private readonly db: DatabaseService) {}

  async getCountries(): Promise<CountryRef[]> {
    if (this.db.isConnected) {
      try {
        const rows = await this.db.query(`
          SELECT 
            code, name_tr AS "nameTr", name_en AS "nameEn", 
            flag_emoji AS "flagEmoji", is_program_country AS "isProgramCountry"
          FROM country_ref
          ORDER BY name_tr ASC
        `);
        if (rows && rows.length > 0) return rows;
      } catch (err: any) {
        this.logger.warn(`getCountries DB error: ${err.message}`);
      }
    }
    return this.fallbackCountries;
  }

  async getSectors(): Promise<SectorRef[]> {
    if (this.db.isConnected) {
      try {
        const rows = await this.db.query(`
          SELECT 
            code, name_tr AS "nameTr", name_en AS "nameEn", 
            isced_field AS "iscedField", icon_name AS "iconName"
          FROM sector_ref
          WHERE is_active = TRUE
          ORDER BY name_tr ASC
        `);
        if (rows && rows.length > 0) return rows;
      } catch (err: any) {
        this.logger.warn(`getSectors DB error: ${err.message}`);
      }
    }
    return this.fallbackSectors;
  }
}
