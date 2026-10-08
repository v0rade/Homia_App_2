import { Injectable } from '@nestjs/common';
import { IPaymentGateway } from './payment-gateway.interface';

@Injectable()
export class ManualGateway implements IPaymentGateway {
  async processPayment(amount: number, currency: string, source: string): Promise<any> {
    return {
      status: 'pending',
      transactionId: `manual_${Date.now()}`
    };
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    return true;
  }
}
