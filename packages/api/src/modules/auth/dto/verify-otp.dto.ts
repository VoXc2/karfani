import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '+966512345678', description: 'رقم الجوال السعودي' })
  @IsString()
  @IsNotEmpty({ message: 'رقم الجوال مطلوب' })
  phone!: string;

  @ApiProperty({ example: '123456', description: 'رمز التحقق المكون من 6 أرقام' })
  @IsString()
  @Length(6, 6, { message: 'رمز التحقق يجب أن يكون 6 أرقام' })
  otp!: string;
}
