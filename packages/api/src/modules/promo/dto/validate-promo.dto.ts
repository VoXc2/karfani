import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidatePromoDto {
  @ApiProperty({ example: 'SUMMER2026' })
  @IsString()
  code!: string;

  @ApiProperty({ example: 5, description: 'عدد أيام الحجز' })
  @IsNumber()
  @Min(1)
  bookingDays!: number;

  @ApiProperty({ example: 1500, description: 'مبلغ الحجز بالريال' })
  @IsNumber()
  @Min(0)
  bookingAmount!: number;
}
