import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DamageService } from './damage.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Damage Reports')
@Controller('damage-reports')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DamageController {
  constructor(private readonly service: DamageService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء تقرير ضرر' })
  create(@CurrentUser('sub') userId: string, @Body() data: any) {
    return this.service.create(userId, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'تفاصيل تقرير الضرر' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id/assess')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'OPS_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'تقييم الضرر وتحديد التكلفة' })
  assess(@Param('id') id: string, @Body() data: any) {
    return this.service.assess(id, data);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'تقارير أضرار الحجز' })
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.service.findByBooking(bookingId);
  }

  @Get('caravan/:caravanId')
  @ApiOperation({ summary: 'تقارير أضرار الكرفان' })
  findByCaravan(@Param('caravanId') caravanId: string) {
    return this.service.findByCaravan(caravanId);
  }
}
