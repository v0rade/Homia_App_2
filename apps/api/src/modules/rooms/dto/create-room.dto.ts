import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  number!: string;

  @ApiProperty()
  @IsNumber()
  price!: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  floor?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type?: string;
}
