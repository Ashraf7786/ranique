import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';

@Controller('fulfillment')
export class FulfillmentController {
  constructor(private readonly fulfillmentService: FulfillmentService) {}

  @Post('webhook')
  async handleWebhook(
    @Headers('x-3pl-signature') signature: string,
    @Body('event') event: string,
    @Body('orderId') orderId: string,
    @Body('trackingNumber') trackingNumber?: string,
  ) {
    // In a real application, verify HMAC signature here using raw body
    if (!signature && process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Missing webhook signature');
    }

    return this.fulfillmentService.processWebhook(event, orderId, trackingNumber);
  }
}
