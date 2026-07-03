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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentController = void 0;
const common_1 = require("@nestjs/common");
const fulfillment_service_1 = require("./fulfillment.service");
let FulfillmentController = class FulfillmentController {
    fulfillmentService;
    constructor(fulfillmentService) {
        this.fulfillmentService = fulfillmentService;
    }
    async handleWebhook(signature, event, orderId, trackingNumber) {
        if (!signature && process.env.NODE_ENV === 'production') {
            throw new common_1.UnauthorizedException('Missing webhook signature');
        }
        return this.fulfillmentService.processWebhook(event, orderId, trackingNumber);
    }
};
exports.FulfillmentController = FulfillmentController;
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Headers)('x-3pl-signature')),
    __param(1, (0, common_1.Body)('event')),
    __param(2, (0, common_1.Body)('orderId')),
    __param(3, (0, common_1.Body)('trackingNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], FulfillmentController.prototype, "handleWebhook", null);
exports.FulfillmentController = FulfillmentController = __decorate([
    (0, common_1.Controller)('fulfillment'),
    __metadata("design:paramtypes", [fulfillment_service_1.FulfillmentService])
], FulfillmentController);
//# sourceMappingURL=fulfillment.controller.js.map