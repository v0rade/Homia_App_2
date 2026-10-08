import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('rooms')
@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Create a new room' })
  create(@CurrentUser() user: any, @Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(user.userId, createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms by property' })
  findAll(@CurrentUser() user: any, @Query('propertyId') propertyId: string) {
    return this.roomsService.findAll(propertyId, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.roomsService.findOne(id, user.userId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Update a room' })
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, user.userId, updateRoomDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Delete a room' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.roomsService.remove(id, user.userId);
  }
}
