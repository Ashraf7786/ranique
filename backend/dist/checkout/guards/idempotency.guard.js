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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let IdempotencyGuard = class IdempotencyGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
            return true;
        }
        const idempotencyKey = request.headers['idempotency-key'];
        if (!idempotencyKey) {
            throw new common_1.BadRequestException('Idempotency-Key header is required for this operation');
        }
        const existingOrder = await this.prisma.order.findUnique({
            where: { idempotencyKey },
        });
        if (existingOrder) {
            throw new common_1.ConflictException({
                message: 'A request with this Idempotency-Key has already been processed.',
                orderId: existingOrder.id,
            });
        }
        request['idempotencyKey'] = idempotencyKey;
        return true;
    }
};
exports.IdempotencyGuard = IdempotencyGuard;
exports.IdempotencyGuard = IdempotencyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IdempotencyGuard);
//# sourceMappingURL=idempotency.guard.js.map