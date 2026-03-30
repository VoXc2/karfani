import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'image-processing' }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
