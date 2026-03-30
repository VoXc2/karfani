import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DispatchService } from './dispatch.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Dispatch')
@Controller('dispatch')
@UseGuards(AuthGuard, RolesGuard)
@Roles('DISPATCHER', 'OPS_ADMIN', 'SUPER_ADMIN')
@ApiBearerAuth()
export class DispatchController {
  constructor(private readonly service: DispatchService) {}

  @Post('assign')
  @ApiOperation({ summary: 'تعيين مرسل للحجز' })
  assign(@CurrentUser('sub') dispatcherId: string, @Body() data: any) {
    return this.service.assign(dispatcherId, data);
  }

  @Get('active')
  @ApiOperation({ summary: 'قائمة عمليات التوصيل النشطة' })
  getActive() {
    return this.service.getActive();
  }

  @Put(':bookingId/picked-up')
  @ApiOperation({ summary: 'تحديد الكرفان كمستلم / في الطريق' })
  markPickedUp(@Param('bookingId') bookingId: string) {
    return this.service.markPickedUp(bookingId);
  }

  @Put(':bookingId/delivered')
  @ApiOperation({ summary: 'تحديد الكرفان كمُسلّم' })
  markDelivered(@Param('bookingId') bookingId: string) {
    return this.service.markDelivered(bookingId);
  }

  @Put(':bookingId/returned')
  @ApiOperation({ summary: 'تحديد الكرفان كمُعاد' })
  markReturned(@Param('bookingId') bookingId: string) {
    return this.service.markReturned(bookingId);
  }

  @Get('history')
  @ApiOperation({ summary: 'سجل عمليات التوصيل' })
  getHistory(@Query() query: any) {
    return this.service.getHistory(query);
  }
}
