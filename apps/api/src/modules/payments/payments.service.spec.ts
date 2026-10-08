import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { ManualGateway } from './gateways/manual.gateway';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService, ManualGateway],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
