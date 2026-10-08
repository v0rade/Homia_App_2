import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetType!: string; // 'ALL', 'PROPERTY', 'FLOOR', 'ROOM'

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  targetId?: string; // propertyId, floor number, or roomId
}
