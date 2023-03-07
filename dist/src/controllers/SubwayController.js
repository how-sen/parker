"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubwayService_1 = __importDefault(require("../services/SubwayService"));
class SubwayController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trains = yield SubwayService_1.default.getAllTrainLines();
                res.send(trains);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, stations, fare } = req.body;
                const train = yield SubwayService_1.default.createTrainLine(name, stations, fare);
                res.status(201).send(train);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    getRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const origin = req.query.origin;
                const destination = req.query.destination;
                const subwayRouteDto = { origin, destination };
                const route = yield SubwayService_1.default.getRoute(subwayRouteDto);
                res.send({ route });
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
}
exports.default = SubwayController;
//# sourceMappingURL=SubwayController.js.map