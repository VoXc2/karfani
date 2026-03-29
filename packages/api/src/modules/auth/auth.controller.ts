import { Controller, Post, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'إرسال رمز التحقق' })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.service.sendOtp(dto.phone);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'التحقق من الرمز' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.service.verifyOtp(dto.phone, dto.otp);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'تحديث التوكن' })
  refresh(@Body() body: { refreshToken: string }) {
    return this.service.refreshToken(body.refreshToken);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'بيانات المستخدم الحالي' })
  getMe(@CurrentUser('sub') userId: string) {
    return this.service.getMe(userId);
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث الملف الشخصي' })
  updateProfile(@CurrentUser('sub') userId: string, @Body() data: any) {
    return this.service.updateProfile(userId, data);
  }
}
