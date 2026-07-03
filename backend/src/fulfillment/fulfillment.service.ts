import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FulfillmentService {
  private readonly logger = new Logger(FulfillmentService.name);

  constructor(private prisma: PrismaService) {}

  async processWebhook(event: string, orderId: string, trackingNumber?: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    let nextStatus = order.status;
    let shippedAt = order.shippedAt;
    let deliveredAt = order.deliveredAt;

    switch (event) {
      case 'order.processing':
        nextStatus = 'PROCESSING';
        this.logger.log(`[3PL] Order ${orderId} is now PROCESSING at the warehouse.`);
        break;
      case 'order.shipped':
        nextStatus = 'SHIPPED';
        shippedAt = new Date();
        this.logger.log(`[3PL] Order ${orderId} has SHIPPED. Tracking: ${trackingNumber}`);
        break;
      case 'order.delivered':
        nextStatus = 'DELIVERED';
        deliveredAt = new Date();
        this.logger.log(`[3PL] Order ${orderId} was DELIVERED to the customer.`);
        break;
      default:
        this.logger.warn(`Unknown 3PL event type: ${event}`);
        return { message: 'Ignored' };
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: nextStatus,
        trackingNumber: trackingNumber || order.trackingNumber,
        shippedAt,
        deliveredAt,
      },
    });

    return { success: true, newStatus: nextStatus };
  }
}
