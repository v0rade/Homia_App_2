import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeasesService } from './leases.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('leases')
@Controller('leases')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LeasesController {
  constructor(private readonly leasesService: LeasesService) {}

  @Post()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Create a new lease' })
  create(@CurrentUser() user: any, @Body() createLeaseDto: CreateLeaseDto) {
    return this.leasesService.create(user.userId, createLeaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leases' })
  findAll(@CurrentUser() user: any) {
    return this.leasesService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lease by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leasesService.findOne(id, user.userId);
  }
}
