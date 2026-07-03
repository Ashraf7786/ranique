import { PrismaService } from '../prisma/prisma.service';
import { LockingService } from './services/locking.service';
import { PaymentService } from './services/payment.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class CheckoutService {
    private prisma;
    private locking;
    private payment;
    private eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, locking: LockingService, payment: PaymentService, eventEmitter: EventEmitter2);
    processCheckout(userId: string, items: any[], paymentIntentId: string, idempotencyKey: string): Promise<{
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
    handleOrderCompletedEvent(order: any): Promise<void>;
}
