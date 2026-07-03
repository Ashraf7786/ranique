import { CheckoutService } from './checkout.service';
import type { Request } from 'express';
export declare class CheckoutController {
    private readonly checkoutService;
    constructor(checkoutService: CheckoutService);
    processCheckout(req: Request, items: any[], paymentIntentId: string): Promise<{
        id: string;
        status: string;
        totalAmount: number;
        currency: string;
        idempotencyKey: string | null;
        trackingNumber: string | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
