import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Availability')
@Controller('caravans/:caravanId/availability')
export class AvailabilityController {
  constructor(private readonly service: AvailabilityService) {}

  @Get()
  @ApiOperation({ summary: 'عرض التوفر' })
  getAvailability(@Param('caravanId') caravanId: string, @Query('month') month: string, @Query('year') year: string) {
    return this.service.getMonthAvailability(caravanId, Number(month), Number(year));
  }

  @Post('block')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حجب تواريخ' })
  blockDates(@Param('caravanId') caravanId: string, @Body() body: { dates: string[]; reason?: string }) {
    return this.service.blockDates(caravanId, body.dates, body.reason);
  }
}
