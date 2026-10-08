import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @ApiProperty()
  @IsNumber()
  rentAmount!: number;

  @ApiProperty()
  @IsNumber()
  depositAmount!: number;
}
