import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly service: BookingService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء حجز' })
  create(@CurrentUser('sub') userId: string, @Body() data: any) {
    return this.service.create(userId, data);
  }

  @Get('my')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حجوزاتي' })
  getMyBookings(@CurrentUser('sub') userId: string, @Query() query: any) {
    return this.service.findByUser(userId, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تفاصيل حجز' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id/cancel')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إلغاء حجز' })
  cancel(@Param('id') id: string, @CurrentUser('sub') userId: string, @Body() body: { reason?: string }) {
    return this.service.cancel(id, userId, body.reason);
  }

  @Put(':id/status')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث حالة الحجز' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.service.updateStatus(id, body.status);
  }
}
