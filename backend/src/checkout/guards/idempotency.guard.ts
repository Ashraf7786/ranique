import { Injectable, CanActivate, ExecutionContext, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Only apply idempotency checks to POST/PUT/PATCH methods
    if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
      return true;
    }

    const idempotencyKey = request.headers['idempotency-key'];
    
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required for this operation');
    }

    // Check if an order already exists with this idempotency key
    const existingOrder = await this.prisma.order.findUnique({
      where: { idempotencyKey },
    });

    if (existingOrder) {
      // If found, reject the new request to prevent double-booking.
      // In a fully robust system, you might return the original 200 OK response payload here,
      // but a 409 Conflict is also standard to halt the duplicate submission.
      throw new ConflictException({
        message: 'A request with this Idempotency-Key has already been processed.',
        orderId: existingOrder.id,
      });
    }

    // If it doesn't exist, we attach the key to the request to be saved by the controller
    request['idempotencyKey'] = idempotencyKey;

    return true;
  }
}
