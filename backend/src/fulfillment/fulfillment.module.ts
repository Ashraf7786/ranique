import { Module } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';
import { FulfillmentController } from './fulfillment.controller';
import { FulfillmentSimulatorService } from './fulfillment-simulator.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FulfillmentService, FulfillmentSimulatorService],
  controllers: [FulfillmentController]
})
export class FulfillmentModule {}
