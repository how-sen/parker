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
const CardService_1 = __importDefault(require("../CardService"));
const dbconnector_1 = __importDefault(require("../../dbconfig/dbconnector"));
jest.mock('../../dbconfig/dbconnector');
describe('CardService', () => {
    describe('createCards', () => {
        it('creates a new card with the given number and amount', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };
            dbconnector_1.default.connect.mockResolvedValue(mockClient);
            const cardService = new CardService_1.default();
            const cardNumber = '1234567890';
            const amount = 1000;
            cardService.createCards = jest.fn().mockResolvedValue({
                number: cardNumber,
                amount
            });
            const result = yield cardService.createCards(cardNumber, amount);
            expect(result).toEqual({
                number: cardNumber,
                amount: amount,
            });
        }));
        it('handles invalid amount balance errors during card creation', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };
            dbconnector_1.default.connect.mockResolvedValue(mockClient);
            const cardService = new CardService_1.default();
            const cardNumber = '1234567890';
            const amount = -1000;
            yield expect(cardService.createCards(cardNumber, amount)).rejects.toThrow();
        }));
    });
});
//# sourceMappingURL=CardService.test.js.map