"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FulfillmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FulfillmentService = FulfillmentService_1 = class FulfillmentService {
    prisma;
    logger = new common_1.Logger(FulfillmentService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processWebhook(event, orderId, trackingNumber) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
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
};
exports.FulfillmentService = FulfillmentService;
exports.FulfillmentService = FulfillmentService = FulfillmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FulfillmentService);
//# sourceMappingURL=fulfillment.service.js.map