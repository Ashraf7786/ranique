export declare class PaymentService {
    private readonly logger;
    verifyPaymentIntent(paymentIntentId: string, expectedAmount: number): Promise<boolean>;
}
