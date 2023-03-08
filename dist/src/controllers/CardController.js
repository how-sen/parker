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
const CardService_1 = __importDefault(require("../services/CardService"));
const cardService = new CardService_1.default();
class CardController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { number, amount } = req.body;
                const card = yield cardService.createCards(number, amount);
                res.status(201).send(card);
            }
            catch (error) {
                res.status(500).send({ message: 'An error occurred while creating the card.' });
            }
        });
    }
}
exports.default = CardController;
//# sourceMappingURL=CardController.js.map