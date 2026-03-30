import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private readonly service: SupportService) {}

  @Post('tickets')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء تذكرة دعم' })
  createTicket(@CurrentUser('sub') userId: string, @Body() data: any) {
    return this.service.createTicket(userId, data);
  }

  @Get('tickets')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'قائمة تذاكر المستخدم' })
  getMyTickets(@CurrentUser('sub') userId: string, @Query() query: any) {
    return this.service.findByUser(userId, query);
  }

  @Get('tickets/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تفاصيل التذكرة مع الرسائل' })
  getTicket(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post('tickets/:id/messages')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إضافة رسالة للتذكرة' })
  addMessage(@Param('id') id: string, @CurrentUser('sub') userId: string, @Body() data: any) {
    return this.service.addMessage(id, userId, data);
  }
}
