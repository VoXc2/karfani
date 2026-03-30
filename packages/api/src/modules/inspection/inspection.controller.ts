import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InspectionService } from './inspection.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Inspections')
@Controller('inspections')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class InspectionController {
  constructor(private readonly service: InspectionService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء فحص جديد' })
  create(@CurrentUser('sub') userId: string, @Body() data: any) {
    return this.service.create(userId, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'تفاصيل الفحص' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'إكمال الفحص' })
  complete(@Param('id') id: string, @Body() data: any) {
    return this.service.complete(id, data);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'فحوصات الحجز' })
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.service.findByBooking(bookingId);
  }
}
