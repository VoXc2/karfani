import { Controller, Post, Body, Param, Get, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

class InitiatePaymentDto {
  @ApiProperty({ description: 'معرف الحجز' })
  @IsString()
  bookingId!: string;

  @ApiProperty({ description: 'طريقة الدفع', enum: ['mada', 'creditcard', 'applepay'] })
  @IsString()
  @IsIn(['mada', 'creditcard', 'applepay'])
  method!: string;

  @ApiProperty({ description: 'رابط إعادة التوجيه', required: false })
  @IsString()
  @IsOptional()
  callbackUrl?: string;
}

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('initiate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'بدء عملية الدفع' })
  initiate(@Body() body: InitiatePaymentDto) {
    return this.service.initiatePayment(body.bookingId, body.method, body.callbackUrl);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Moyasar webhook callback' })
  webhook(@Body() body: any, @Headers('x-moyasar-signature') signature?: string) {
    return this.service.handleWebhook(body, signature);
  }

  @Post(':id/refund')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'استرداد الدفعة (مسؤول فقط)' })
  refund(@Param('id') id: string) {
    return this.service.refundPayment(id);
  }

  @Get('booking/:bookingId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'مدفوعات الحجز' })
  getByBooking(@Param('bookingId') bookingId: string) {
    return this.service.getByBooking(bookingId);
  }
}
