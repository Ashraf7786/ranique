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
var FulfillmentSimulatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentSimulatorService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const fulfillment_service_1 = require("./fulfillment.service");
let FulfillmentSimulatorService = FulfillmentSimulatorService_1 = class FulfillmentSimulatorService {
    prisma;
    fulfillment;
    logger = new common_1.Logger(FulfillmentSimulatorService_1.name);
    constructor(prisma, fulfillment) {
        this.prisma = prisma;
        this.fulfillment = fulfillment;
    }
    async simulateWarehouseOperations() {
        const paidOrders = await this.prisma.order.findMany({
            where: { status: 'PAID' },
            take: 5,
        });
        for (const order of paidOrders) {
            this.logger.debug(`[SIMULATOR] Webhook fired: order.processing for ${order.id}`);
            await this.fulfillment.processWebhook('order.processing', order.id);
        }
        const processingOrders = await this.prisma.order.findMany({
            where: { status: 'PROCESSING' },
            take: 5,
        });
        for (const order of processingOrders) {
            const mockTracking = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            this.logger.debug(`[SIMULATOR] Webhook fired: order.shipped for ${order.id}`);
            await this.fulfillment.processWebhook('order.shipped', order.id, mockTracking);
        }
        const shippedOrders = await this.prisma.order.findMany({
            where: {
                status: 'SHIPPED',
                shippedAt: {
                    lt: new Date(Date.now() - 30 * 1000),
                }
            },
            take: 5,
        });
        for (const order of shippedOrders) {
            this.logger.debug(`[SIMULATOR] Webhook fired: order.delivered for ${order.id}`);
            await this.fulfillment.processWebhook('order.delivered', order.id);
        }
    }
};
exports.FulfillmentSimulatorService = FulfillmentSimulatorService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FulfillmentSimulatorService.prototype, "simulateWarehouseOperations", null);
exports.FulfillmentSimulatorService = FulfillmentSimulatorService = FulfillmentSimulatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fulfillment_service_1.FulfillmentService])
], FulfillmentSimulatorService);
//# sourceMappingURL=fulfillment-simulator.service.js.map