import { Controller, Get, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'OPS_ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'قائمة المستخدمين' })
  listUsers(@Query() query: any) {
    return this.service.listUsers(query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'تفاصيل المستخدم' })
  getUser(@Param('id') id: string) {
    return this.service.getUser(id);
  }

  @Put('users/:id/status')
  @ApiOperation({ summary: 'تفعيل/تعليق المستخدم' })
  updateUserStatus(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.service.updateUserStatus(id, body);
  }

  @Get('caravans/pending')
  @ApiOperation({ summary: 'الكرفانات المعلقة للموافقة' })
  getPendingCaravans(@Query() query: any) {
    return this.service.getPendingCaravans(query);
  }

  @Put('caravans/:id/approve')
  @ApiOperation({ summary: 'الموافقة على الكرفان' })
  approveCaravan(@Param('id') id: string) {
    return this.service.approveCaravan(id);
  }

  @Put('caravans/:id/reject')
  @ApiOperation({ summary: 'رفض الكرفان' })
  rejectCaravan(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.service.rejectCaravan(id, body);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'لوحة تحكم سريعة' })
  getDashboard() {
    return this.service.getDashboard();
  }
}
