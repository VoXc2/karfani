import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    const endpoint = this.config.get('MINIO_ENDPOINT');
    const isLocal = !!endpoint;

    this.s3 = new S3Client({
      region: this.config.get('AWS_REGION') || 'me-south-1',
      ...(isLocal && {
        endpoint,
        forcePathStyle: true,
        credentials: {
          accessKeyId: this.config.get('MINIO_ACCESS_KEY') || 'minioadmin',
          secretAccessKey: this.config.get('MINIO_SECRET_KEY') || 'minioadmin',
        },
      }),
      ...(!isLocal && {
        credentials: {
          accessKeyId: this.config.get('AWS_ACCESS_KEY_ID')!,
          secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY')!,
        },
      }),
    });

    this.bucket = this.config.get('S3_BUCKET_PUBLIC') || 'karfani-public';
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'images') {
    const ext = file.originalname.split('.').pop();
    const key = `${folder}/${randomUUID()}.${ext}`;

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const endpoint = this.config.get('MINIO_ENDPOINT');
    const baseUrl = endpoint
      ? `${endpoint}/${this.bucket}`
      : `https://${this.bucket}.s3.${this.config.get('AWS_REGION')}.amazonaws.com`;

    return {
      success: true,
      data: {
        url: `${baseUrl}/${key}`,
        key,
      },
    };
  }
}
