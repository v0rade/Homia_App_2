import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessCodeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  expiresAt!: string;
}
