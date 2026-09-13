import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool | null = null;
  public isConnected = false;

  async onModuleInit() {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5433/mobility_nexus';

    try {
      const isSsl =
        process.env.DATABASE_SSL === 'true' ||
        connectionString.includes('sslmode=require') ||
        connectionString.includes('railway');

      this.pool = new Pool({
        connectionString,
        ssl: isSsl ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      // Test connection
      const client = await this.pool.connect();
      client.release();
      this.isConnected = true;
      this.logger.log('✅ PostgreSQL veritabanına başarıyla bağlanıldı (localhost:5432/mobility_nexus)');
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(
        `⚠️ PostgreSQL bağlantısı kurulamadı: ${err.message}. Geliştirme modu in-memory yedekleme ile devam ediyor.`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end().catch(() => {});
    }
  }

  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<T[]> {
    if (!this.pool || !this.isConnected) {
      throw new Error('Veritabanı bağlı değil.');
    }
    const res = await this.pool.query<T>(text, params);
    return res.rows;
  }
}
