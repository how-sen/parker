"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CardController_1 = __importDefault(require("../controllers/CardController"));
const router = (0, express_1.Router)();
const cardController = new CardController_1.default();
router.post('/card', cardController.create);
exports.default = router;
//# sourceMappingURL=CardRouter.js.map