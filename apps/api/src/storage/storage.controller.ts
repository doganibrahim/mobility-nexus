import {
  Controller,
  Post,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { StorageService, UploadResult } from './storage.service';

@ApiTags('Storage & File Management (Cloudflare R2 / Local)')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Dosya Yükle (Belge, Logo, Erasmus+ Kanıt Evrakları)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Yüklenecek dosya (PDF, PNG, JPG, SVG, DOCX - Maks 15MB)',
        },
        folder: {
          type: 'string',
          example: 'documents',
          description: 'Hedef alt klasör (logos, documents, evidence, samples)',
        },
        isPrivate: {
          type: 'boolean',
          example: false,
          description: 'Gizli/Admin Only evrak ise true (Presigned URL gerektirir)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Dosya başarıyla yüklendi' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB limit
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder = 'documents',
    @Query('isPrivate') isPrivate?: string,
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('Lütfen yüklenecek bir dosya seçin.');
    }

    const isPrivateBool = isPrivate === 'true';
    return this.storageService.upload(
      {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      folder,
      isPrivateBool,
    );
  }

  @Get('download-url')
  @ApiOperation({ summary: 'Gizli/Admin Only Dosya İçin Geçici İndirme Bağlantısı Al (Pre-signed URL)' })
  @ApiResponse({ status: 200, description: 'Geçici indirme bağlantısı' })
  async getDownloadUrl(@Query('key') key: string): Promise<{ downloadUrl: string }> {
    if (!key) {
      throw new BadRequestException('Dosya anahtarı (key) belirtilmelidir.');
    }
    const downloadUrl = await this.storageService.getSignedDownloadUrl(key, 900);
    return { downloadUrl };
  }
}
