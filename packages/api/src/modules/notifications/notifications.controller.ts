import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'إشعاراتي' })
  getMyNotifications(@CurrentUser('sub') userId: string) {
    return this.service.getByUser(userId);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'تحديد كمقروء' })
  markRead(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.service.markRead(id, userId);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'تحديد الكل كمقروء' })
  markAllRead(@CurrentUser('sub') userId: string) {
    return this.service.markAllRead(userId);
  }
}
