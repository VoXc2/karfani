import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('owner')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إحصائيات المالك' })
  getOwnerAnalytics(@CurrentUser('sub') userId: string) {
    return this.service.getOwnerAnalytics(userId);
  }

  @Get('overview')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'OPS_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'لوحة المؤشرات الرئيسية' })
  getOverview() {
    return this.service.getOverview();
  }

  @Get('revenue')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'OPS_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'بيانات الإيرادات' })
  getRevenue(@Query('period') period: string = 'monthly') {
    return this.service.getRevenue(period);
  }

  @Get('bookings')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'OPS_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إحصائيات الحجوزات' })
  getBookingStats(@Query('period') period: string = 'monthly') {
    return this.service.getBookingStats(period);
  }

  @Get('caravans')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'OPS_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'أداء الكرفانات' })
  getCaravanPerformance() {
    return this.service.getCaravanPerformance();
  }
}
