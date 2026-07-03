import { Injectable, Logger, BadRequestException } from '@nestjs/common';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  /**
   * Mock Stripe/Razorpay Payment Verification
   * In a real app, this would verify a Webhook signature or call Stripe APIs
   * to verify the PaymentIntent status.
   */
  async verifyPaymentIntent(paymentIntentId: string, expectedAmount: number): Promise<boolean> {
    this.logger.log(`Verifying payment intent ${paymentIntentId} for amount ${expectedAmount}`);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!paymentIntentId || paymentIntentId.startsWith('fail_')) {
      throw new BadRequestException('Payment verification failed. Invalid intent.');
    }

    // Mock successful payment
    this.logger.log(`Payment intent ${paymentIntentId} verified successfully.`);
    return true;
  }
}
