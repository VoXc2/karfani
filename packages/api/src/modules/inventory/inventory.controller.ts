import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
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

  @Get('mine')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'كرفاناتي (المالك)' })
  findMine(@CurrentUser('sub') userId: string, @Query() query: any) {
    return this.service.findByOwner(userId, query);
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

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف كرفان (إلغاء التنشيط)' })
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.service.softDelete(id, userId);
  }

  @Post(':id/reviews')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إضافة تقييم' })
  addReview(
    @Param('id') caravanId: string,
    @CurrentUser('sub') userId: string,
    @Body() data: { rating: number; comment?: string },
  ) {
    return this.service.addReview(caravanId, userId, data);
  }
}
