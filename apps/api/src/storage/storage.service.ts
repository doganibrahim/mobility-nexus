import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  key: string;
  storageDriver: 'r2' | 'local';
  filename: string;
  sizeBytes: number;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client | null = null;
  private readonly isR2Configured: boolean = false;
  private readonly bucketName: string;
  private readonly publicDomain?: string;
  private readonly uploadDir: string;

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get<string>('CLOUDFLARE_R2_ACCOUNT_ID') || this.config.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.config.get<string>('CLOUDFLARE_R2_ACCESS_KEY_ID') || this.config.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('CLOUDFLARE_R2_SECRET_ACCESS_KEY') || this.config.get<string>('R2_SECRET_ACCESS_KEY');
    this.bucketName = this.config.get<string>('CLOUDFLARE_R2_BUCKET_NAME') || this.config.get<string>('R2_BUCKET_NAME') || 'mobility-nexus';
    this.publicDomain = this.config.get<string>('CLOUDFLARE_R2_PUBLIC_DOMAIN') || this.config.get<string>('R2_PUBLIC_DOMAIN');

    this.uploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    if (accountId && accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.isR2Configured = true;
      this.logger.log(`✅ Cloudflare R2 depolama aktif (Bucket: ${this.bucketName})`);
    } else {
      this.logger.log('📁 Cloudflare R2 anahtarları tanımlanmamış. Yerel disk depolama modu (/uploads) aktif.');
    }
  }

  /**
   * Uploads a file buffer either to Cloudflare R2 or Local Storage
   */
  async upload(
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    subFolder = 'documents',
    isPrivate = false,
  ): Promise<UploadResult> {
    const ext = path.extname(file.originalname) || '';
    const safeBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const key = `${subFolder}/${uuidv4()}-${safeBaseName}${ext}`;

    // 1. Cloudflare R2 Upload
    if (this.isR2Configured && this.s3Client) {
      try {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );

        let fileUrl: string;
        if (isPrivate) {
          fileUrl = await this.getSignedDownloadUrl(key, 3600);
        } else if (this.publicDomain) {
          fileUrl = `https://${this.publicDomain.replace(/^https?:\/\//, '')}/${key}`;
        } else {
          fileUrl = await this.getSignedDownloadUrl(key, 86400 * 7); // 7 day access
        }

        this.logger.log(`[R2] Dosya yüklendi: ${key} (${file.size} bytes)`);
        return {
          url: fileUrl,
          key,
          storageDriver: 'r2',
          filename: file.originalname,
          sizeBytes: file.size,
        };
      } catch (err: any) {
        this.logger.warn(`R2 upload başarısız, yerel depolamaya geçiliyor: ${err.message}`);
      }
    }

    // 2. Local Disk Storage Fallback
    const targetFolder = path.join(this.uploadDir, subFolder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const localFilename = `${uuidv4()}-${safeBaseName}${ext}`;
    const localFilePath = path.join(targetFolder, localFilename);
    await fs.promises.writeFile(localFilePath, file.buffer);

    const port = process.env.PORT || 3001;
    const serverUrl = process.env.API_SERVER_URL || `http://localhost:${port}`;
    const localUrl = `${serverUrl}/uploads/${subFolder}/${localFilename}`;

    this.logger.log(`[Local] Dosya diske kaydedildi: ${localFilePath}`);

    return {
      url: localUrl,
      key: `${subFolder}/${localFilename}`,
      storageDriver: 'local',
      filename: file.originalname,
      sizeBytes: file.size,
    };
  }

  /**
   * Generates a temporary secure Pre-signed Download URL (Admin Only for private docs)
   */
  async getSignedDownloadUrl(key: string, expiresInSeconds = 900): Promise<string> {
    if (this.isR2Configured && this.s3Client) {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    }

    // Local fallback
    const port = process.env.PORT || 3001;
    const serverUrl = process.env.API_SERVER_URL || `http://localhost:${port}`;
    return `${serverUrl}/uploads/${key}`;
  }
}
