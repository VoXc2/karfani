import { Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly service: UploadService) {}

  @Post('image')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'رفع صورة' })
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        cb(new Error('يسمح فقط بالصور'), false);
      }
      cb(null, true);
    },
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadFile(file, 'images');
  }
}
