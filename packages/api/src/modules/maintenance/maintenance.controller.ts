import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Maintenance')
@Controller('maintenance')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}

  @Post('jobs')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'OPS_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'إنشاء مهمة صيانة' })
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'قائمة مهام الصيانة' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'تفاصيل مهمة الصيانة' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put('jobs/:id/start')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'OPS_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'بدء مهمة الصيانة' })
  start(@Param('id') id: string) {
    return this.service.start(id);
  }

  @Put('jobs/:id/complete')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'OPS_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'إكمال مهمة الصيانة' })
  complete(@Param('id') id: string, @Body() data: any) {
    return this.service.complete(id, data);
  }

  @Get('caravan/:caravanId')
  @ApiOperation({ summary: 'سجل صيانة الكرفان' })
  findByCaravan(@Param('caravanId') caravanId: string) {
    return this.service.findByCaravan(caravanId);
  }
}
