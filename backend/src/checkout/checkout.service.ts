import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LockingService } from './services/locking.service';
import { PaymentService } from './services/payment.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    private prisma: PrismaService,
    private locking: LockingService,
    private payment: PaymentService,
    private eventEmitter: EventEmitter2,
  ) {}

  async processCheckout(userId: string, items: any[], paymentIntentId: string, idempotencyKey: string) {
    const skus = items.map((i) => i.sku);
    
    // 1. Acquire Distributed Lock
    const locked = await this.locking.acquireLock(skus);
    if (!locked) {
      throw new BadRequestException('High traffic detected. Items are temporarily locked by another user. Please try again.');
    }

    try {
      // 2. Validate Payment Server-Side
      const totalAmount = 999.99; // Mock calculation
      await this.payment.verifyPaymentIntent(paymentIntentId, totalAmount);

      // 3. Create Order
      const order = await this.prisma.order.create({
        data: {
          user: {
            connectOrCreate: {
              where: { id: userId },
              create: {
                id: userId,
                email: `test-${userId}@ranique.com`,
                password: 'mock_password_hash',
              },
            },
          },
          status: 'PAID',
          totalAmount,
          idempotencyKey,
          items: {
            create: items.map((item) => ({
              product: {
                connectOrCreate: {
                  where: { id: item.productId },
                  create: {
                    id: item.productId,
                    slug: item.productId,
                    title: 'Mock Product',
                    sku: item.sku,
                    sellingPrice: item.price,
                    shortDescription: 'Mock Description',
                  }
                }
              },
              sku: item.sku,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      // 4. Fire Async Event (Queue Decoupling)
      this.eventEmitter.emit('order.completed', order);

      return order;
    } catch (error) {
      this.logger.error('Checkout failed', error);
      throw new InternalServerErrorException('Checkout processing failed');
    } finally {
      // 5. Release Lock
      await this.locking.releaseLock(skus);
    }
  }

  /**
   * Asynchronous Downstream Queue Worker
   */
  @OnEvent('order.completed', { async: true })
  async handleOrderCompletedEvent(order: any) {
    this.logger.log(`[QUEUE] Processing downstream tasks for Order: ${order.id}`);
    
    // Simulate slow logistics/email processes
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // In real app: Update Inventory counts, trigger 3PL logistics, send Email
    this.logger.log(`[QUEUE] Logistics assigned and confirmation email sent for Order: ${order.id}`);
  }
}
