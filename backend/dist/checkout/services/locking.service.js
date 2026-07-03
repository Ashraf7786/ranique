"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LockingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockingService = void 0;
const common_1 = require("@nestjs/common");
let LockingService = LockingService_1 = class LockingService {
    logger = new common_1.Logger(LockingService_1.name);
    locks = new Map();
    async acquireLock(skus, ttlSeconds = 5) {
        for (const sku of skus) {
            if (this.locks.get(sku)) {
                this.logger.warn(`Could not acquire lock for SKU: ${sku} - already locked.`);
                return false;
            }
        }
        for (const sku of skus) {
            this.locks.set(sku, true);
            this.logger.log(`Lock acquired for SKU: ${sku}`);
            setTimeout(() => {
                if (this.locks.get(sku)) {
                    this.locks.delete(sku);
                    this.logger.debug(`Lock auto-released for SKU: ${sku} after TTL`);
                }
            }, ttlSeconds * 1000);
        }
        return true;
    }
    async releaseLock(skus) {
        for (const sku of skus) {
            this.locks.delete(sku);
            this.logger.log(`Lock released manually for SKU: ${sku}`);
        }
    }
};
exports.LockingService = LockingService;
exports.LockingService = LockingService = LockingService_1 = __decorate([
    (0, common_1.Injectable)()
], LockingService);
//# sourceMappingURL=locking.service.js.map