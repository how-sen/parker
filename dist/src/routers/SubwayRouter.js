"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SubwayController_1 = __importDefault(require("../controllers/SubwayController"));
const FareController_1 = __importDefault(require("../controllers/FareController"));
const router = (0, express_1.Router)();
const subwayController = new SubwayController_1.default();
const fareController = new FareController_1.default();
router.get('/stations', subwayController.index);
router.post('/train-line', subwayController.create);
router.get('/route', subwayController.getRoute);
router.post('/station/:station/enter', fareController.enterStation);
router.post('/station/:station/exit', fareController.exitStation);
exports.default = router;
//# sourceMappingURL=SubwayRouter.js.map