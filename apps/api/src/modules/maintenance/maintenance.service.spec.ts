import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceService } from './maintenance.service';

describe('MaintenanceService', () => {
  let service: MaintenanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceService],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateSlaStatus', () => {
    it('should calculate SLA correctly', () => {
      const ticket = { priority: 'HIGH', createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000) };
      const status = service.calculateSlaStatus(ticket);
      expect(status.slaHours).toBe(24);
      expect(status.isBreached).toBe(true);
    });
  });
});
