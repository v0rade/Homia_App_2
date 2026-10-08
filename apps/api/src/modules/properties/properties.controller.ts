import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyQueryDto } from './dto/property-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('properties')
@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Create a new property' })
  create(@CurrentUser() user: any, @Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(user.userId, createPropertyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  findAll(@CurrentUser() user: any, @Query() query: PropertyQueryDto) {
    return this.propertiesService.findAll(user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.findOne(id, user.userId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Update a property' })
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, user.userId, updatePropertyDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Delete a property' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.remove(id, user.userId);
  }

  @Get(':id/rooms')
  @ApiOperation({ summary: 'Get all rooms in a property' })
  getRooms(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.getRooms(id, user.userId);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get property statistics' })
  getStats(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.getStats(id, user.userId);
  }
}
