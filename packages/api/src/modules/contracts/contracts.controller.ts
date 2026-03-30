import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @Post('generate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'إنشاء عقد للحجز' })
  generate(@CurrentUser('sub') userId: string, @Body() data: { bookingId: string }) {
    return this.service.generate(userId, data);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تفاصيل العقد' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id/sign')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'توقيع العقد' })
  sign(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.service.sign(id, userId);
  }

  @Get('booking/:bookingId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'عقد الحجز' })
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.service.findByBooking(bookingId);
  }
}
