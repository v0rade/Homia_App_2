import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateInvoiceDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  month!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  year!: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  propertyId?: string;
}
