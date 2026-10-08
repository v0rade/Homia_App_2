export interface IPaymentGateway {
  processPayment(amount: number, currency: string, source: string): Promise<any>;
  verifyPayment(transactionId: string): Promise<boolean>;
}
