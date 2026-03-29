import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+966512345678', description: 'رقم الجوال السعودي' })
  @IsString()
  @IsNotEmpty({ message: 'رقم الجوال مطلوب' })
  phone!: string;
}
