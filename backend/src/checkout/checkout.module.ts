import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { LockingService } from './services/locking.service';
import { PaymentService } from './services/payment.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CheckoutService, LockingService, PaymentService],
  controllers: [CheckoutController]
})
export class CheckoutModule {}
