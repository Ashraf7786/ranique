import { PrismaService } from '../prisma/prisma.service';
export declare class FulfillmentService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    processWebhook(event: string, orderId: string, trackingNumber?: string): Promise<{
        message: string;
        success?: undefined;
        newStatus?: undefined;
    } | {
        success: boolean;
        newStatus: string;
        message?: undefined;
    }>;
}
