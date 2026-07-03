import { PrismaService } from '../prisma/prisma.service';
import { FulfillmentService } from './fulfillment.service';
export declare class FulfillmentSimulatorService {
    private prisma;
    private fulfillment;
    private readonly logger;
    constructor(prisma: PrismaService, fulfillment: FulfillmentService);
    simulateWarehouseOperations(): Promise<void>;
}
