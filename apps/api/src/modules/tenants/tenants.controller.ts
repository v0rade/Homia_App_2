import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('tenants')
@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Create a new tenant' })
  create(@CurrentUser() user: any, @Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(user.userId, createTenantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tenants' })
  findAll(@CurrentUser() user: any) {
    return this.tenantsService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tenant by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tenantsService.findOne(id, user.userId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Update a tenant' })
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, user.userId, updateTenantDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Delete a tenant' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tenantsService.remove(id, user.userId);
  }
}
