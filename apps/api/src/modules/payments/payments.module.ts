import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ManualGateway } from './gateways/manual.gateway';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, ManualGateway],
  exports: [PaymentsService],
})
export class PaymentsModule {}
