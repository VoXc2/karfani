import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Caravans')
@Controller('caravans')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'قائمة الكرفانات' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'الكرفانات المميزة' })
  findFeatured() {
    return this.service.findFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'تفاصيل كرفان' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إضافة كرفان' })
  create(@CurrentUser('sub') userId: string, @Body() data: any) {
    return this.service.create(userId, data);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث كرفان' })
  update(@Param('id') id: string, @CurrentUser('sub') userId: string, @Body() data: any) {
    return this.service.update(id, userId, data);
  }
}
