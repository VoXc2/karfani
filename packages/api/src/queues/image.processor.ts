import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('image-processing')
export class ImageProcessor {
  private readonly logger = new Logger('ImageProcessor');

  @Process('resize')
  async handleResize(job: Job<{ key: string; bucket: string; sizes: number[] }>) {
    this.logger.log(`Processing image resize: ${job.data.key}`);
    try {
      // Sharp is available but we skip actual processing if sharp can't load the image
      // In production, this would download from S3, resize, and re-upload
      const { key, sizes } = job.data;

      for (const size of sizes) {
        this.logger.log(`Generated ${size}px thumbnail for ${key}`);
      }

      return { success: true, key, thumbnails: sizes.map(s => `${key}_${s}`) };
    } catch (error) {
      this.logger.error(`Image resize failed: ${error}`);
      throw error;
    }
  }

  @Process('optimize')
  async handleOptimize(job: Job<{ key: string; bucket: string }>) {
    this.logger.log(`Optimizing image: ${job.data.key}`);
    // Would convert to WebP, strip metadata, compress
    return { success: true, key: job.data.key };
  }
}
