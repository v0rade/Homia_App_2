import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicesService],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateLateFee', () => {
    it('should return 0 if status is PAID', async () => {
      const invoice = { status: 'PAID', amount: 1000, dueDate: new Date(Date.now() - 86400000) };
      const fee = await service.calculateLateFee(invoice);
      expect(fee).toBe(0);
    });

    it('should return 5% if overdue', async () => {
      const invoice = { status: 'PENDING', amount: 1000, dueDate: new Date(Date.now() - 86400000) };
      const fee = await service.calculateLateFee(invoice);
      expect(fee).toBe(50);
    });
  });
});
