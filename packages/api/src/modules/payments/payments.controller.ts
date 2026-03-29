import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('initiate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'بدء عملية الدفع' })
  initiate(@Body() body: { bookingId: string; method: string }) {
    return this.service.initiatePayment(body.bookingId, body.method);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Moyasar webhook' })
  webhook(@Body() body: any) {
    return this.service.handleWebhook(body);
  }

  @Get('booking/:bookingId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'مدفوعات الحجز' })
  getByBooking(@Param('bookingId') bookingId: string) {
    return this.service.getByBooking(bookingId);
  }
}
