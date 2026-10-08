import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  invoiceId!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  method!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reference?: string;
}
