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
var CheckoutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const locking_service_1 = require("./services/locking.service");
const payment_service_1 = require("./services/payment.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let CheckoutService = CheckoutService_1 = class CheckoutService {
    prisma;
    locking;
    payment;
    eventEmitter;
    logger = new common_1.Logger(CheckoutService_1.name);
    constructor(prisma, locking, payment, eventEmitter) {
        this.prisma = prisma;
        this.locking = locking;
        this.payment = payment;
        this.eventEmitter = eventEmitter;
    }
    async processCheckout(userId, items, paymentIntentId, idempotencyKey) {
        const skus = items.map((i) => i.sku);
        const locked = await this.locking.acquireLock(skus);
        if (!locked) {
            throw new common_1.BadRequestException('High traffic detected. Items are temporarily locked by another user. Please try again.');
        }
        try {
            const totalAmount = 999.99;
            await this.payment.verifyPaymentIntent(paymentIntentId, totalAmount);
            const order = await this.prisma.order.create({
                data: {
                    user: {
                        connectOrCreate: {
                            where: { id: userId },
                            create: {
                                id: userId,
                                email: `test-${userId}@ranique.com`,
                                password: 'mock_password_hash',
                            },
                        },
                    },
                    status: 'PAID',
                    totalAmount,
                    idempotencyKey,
                    items: {
                        create: items.map((item) => ({
                            product: {
                                connectOrCreate: {
                                    where: { id: item.productId },
                                    create: {
                                        id: item.productId,
                                        slug: item.productId,
                                        name: 'Mock Product',
                                        brand: 'Mock Brand',
                                        category: 'COSMETICS',
                                        price: item.price,
                                        description: 'Mock Description',
                                    }
                                }
                            },
                            sku: item.sku,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });
            this.eventEmitter.emit('order.completed', order);
            return order;
        }
        catch (error) {
            this.logger.error('Checkout failed', error);
            throw new common_1.InternalServerErrorException('Checkout processing failed');
        }
        finally {
            await this.locking.releaseLock(skus);
        }
    }
    async handleOrderCompletedEvent(order) {
        this.logger.log(`[QUEUE] Processing downstream tasks for Order: ${order.id}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.logger.log(`[QUEUE] Logistics assigned and confirmation email sent for Order: ${order.id}`);
    }
};
exports.CheckoutService = CheckoutService;
__decorate([
    (0, event_emitter_1.OnEvent)('order.completed', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CheckoutService.prototype, "handleOrderCompletedEvent", null);
exports.CheckoutService = CheckoutService = CheckoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        locking_service_1.LockingService,
        payment_service_1.PaymentService,
        event_emitter_1.EventEmitter2])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map