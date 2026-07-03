import { FulfillmentService } from './fulfillment.service';
export declare class FulfillmentController {
    private readonly fulfillmentService;
    constructor(fulfillmentService: FulfillmentService);
    handleWebhook(signature: string, event: string, orderId: string, trackingNumber?: string): Promise<{
        message: string;
        success?: undefined;
        newStatus?: undefined;
    } | {
        success: boolean;
        newStatus: string;
        message?: undefined;
    }>;
}
