import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { FulfillmentService } from './fulfillment.service';

@Injectable()
export class FulfillmentSimulatorService {
  private readonly logger = new Logger(FulfillmentSimulatorService.name);

  constructor(
    private prisma: PrismaService,
    private fulfillment: FulfillmentService,
  ) {}

  /**
   * Mock 3PL Simulator
   * Every 10 seconds, scans for orders and advances their state 
   * to simulate a real warehouse picking, packing, and shipping.
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async simulateWarehouseOperations() {
    // 1. Move PAID orders to PROCESSING
    const paidOrders = await this.prisma.order.findMany({
      where: { status: 'PAID' },
      take: 5,
    });

    for (const order of paidOrders) {
      this.logger.debug(`[SIMULATOR] Webhook fired: order.processing for ${order.id}`);
      await this.fulfillment.processWebhook('order.processing', order.id);
    }

    // 2. Move PROCESSING orders to SHIPPED
    const processingOrders = await this.prisma.order.findMany({
      where: { status: 'PROCESSING' },
      take: 5,
    });

    for (const order of processingOrders) {
      const mockTracking = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      this.logger.debug(`[SIMULATOR] Webhook fired: order.shipped for ${order.id}`);
      await this.fulfillment.processWebhook('order.shipped', order.id, mockTracking);
    }

    // 3. Move SHIPPED orders to DELIVERED (if shipped > 30 seconds ago for demo purposes)
    const shippedOrders = await this.prisma.order.findMany({
      where: { 
        status: 'SHIPPED',
        shippedAt: {
          lt: new Date(Date.now() - 30 * 1000), // 30 seconds old
        }
      },
      take: 5,
    });

    for (const order of shippedOrders) {
      this.logger.debug(`[SIMULATOR] Webhook fired: order.delivered for ${order.id}`);
      await this.fulfillment.processWebhook('order.delivered', order.id);
    }
  }
}
