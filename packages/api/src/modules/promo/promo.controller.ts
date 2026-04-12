import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PromoService } from './promo.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { ValidatePromoDto } from './dto/validate-promo.dto';

@ApiTags('Promo Codes')
@Controller('promo-codes')
export class PromoController {
  constructor(private readonly service: PromoService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'OPS_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء كود خصم' })
  create(@Body() data: CreatePromoDto) {
    return this.service.create(data);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'OPS_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'قائمة أكواد الخصم' })
  findAll(@Query() query: { page?: number; limit?: number; isActive?: string }) {
    return this.service.findAll(query);
  }

  @Post('validate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'التحقق من كود الخصم' })
  validate(@CurrentUser('sub') userId: string, @Body() data: ValidatePromoDto) {
    return this.service.validate(data.code, data.bookingDays, data.bookingAmount, userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'OPS_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تحديث كود خصم' })
  update(@Param('id') id: string, @Body() data: UpdatePromoDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'OPS_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تعطيل كود خصم' })
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }
}
