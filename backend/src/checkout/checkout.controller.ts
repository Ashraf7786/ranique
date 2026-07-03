import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { IdempotencyGuard } from './guards/idempotency.guard';
import type { Request } from 'express';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @UseGuards(IdempotencyGuard)
  @Post('process')
  async processCheckout(
    @Req() req: Request,
    @Body('items') items: any[],
    @Body('paymentIntentId') paymentIntentId: string,
  ) {
    const userId = (req as any).user?.sub || 'mock-user-123';
    const idempotencyKey = (req as any).idempotencyKey;

    return this.checkoutService.processCheckout(userId, items, paymentIntentId, idempotencyKey);
  }
}
