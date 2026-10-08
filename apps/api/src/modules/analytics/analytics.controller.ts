import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('ADMIN', 'OWNER')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get main dashboard stats' })
  getDashboardStats(@CurrentUser() user: any, @Query('propertyId') propertyId?: string) {
    return this.analyticsService.getDashboardStats(user.userId, propertyId);
  }

  @Get('revenue-chart')
  @ApiOperation({ summary: 'Get revenue chart data' })
  getRevenueChart(@CurrentUser() user: any, @Query('propertyId') propertyId: string, @Query('months') months: number) {
    return this.analyticsService.getRevenueByMonth(user.userId, propertyId, months);
  }

  @Get('occupancy-trend')
  @ApiOperation({ summary: 'Get occupancy trend data' })
  getOccupancyTrend(@CurrentUser() user: any, @Query('propertyId') propertyId: string, @Query('months') months: number) {
    return this.analyticsService.getOccupancyTrend(user.userId, propertyId, months);
  }

  @Get('payment-status')
  @ApiOperation({ summary: 'Get payment status breakdown' })
  getPaymentStatus(@CurrentUser() user: any, @Query('propertyId') propertyId: string) {
    return this.analyticsService.getPaymentStatusBreakdown(user.userId, propertyId);
  }
}
