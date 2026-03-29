import { IsString, IsDateString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class BookingAddonDto {
  @ApiProperty()
  @IsString()
  addonId!: string;

  @ApiProperty()
  @IsNumber()
  quantity!: number;
}

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  caravanId!: string;

  @ApiProperty()
  @IsDateString()
  startDate!: string;

  @ApiProperty()
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pickupLocationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dropoffLocationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [BookingAddonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingAddonDto)
  addons?: BookingAddonDto[];
}
