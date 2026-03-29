import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Pricing')
@Controller('caravans/:caravanId/pricing')
export class PricingController {
  constructor(private readonly service: PricingService) {}

  @Get('calculate')
  @ApiOperation({ summary: 'حساب السعر' })
  calculate(@Param('caravanId') caravanId: string, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.calculatePrice(caravanId, new Date(startDate), new Date(endDate));
  }

  @Post('rules')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إضافة قاعدة تسعير' })
  addRule(@Param('caravanId') caravanId: string, @Body() data: any) {
    return this.service.addRule(caravanId, data);
  }
}
