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
const FareService_1 = __importDefault(require("../FareService"));
jest.mock('../../dbconfig/dbconnector', () => ({
    connect: jest.fn(),
}));
jest.mock('ioredis', () => jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
})));
describe('FareService', () => {
    const dto = { card_number: '123', station: 'A' };
    const mockClient = { release: jest.fn() };
    const mockPool = require('../../dbconfig/dbconnector');
    describe('payforRide', () => {
        it('should throw an error if card is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockGetCardByNumber = jest.fn().mockResolvedValue(null);
            FareService_1.default['_getCardByNumber'] = mockGetCardByNumber;
            jest.spyOn(mockClient, 'release');
            mockPool.connect.mockResolvedValue(mockClient);
            yield expect(FareService_1.default.payforRide(dto)).rejects.toThrow('Card with number 123 not found');
            expect(mockGetCardByNumber).toHaveBeenCalledWith('123');
            expect(mockClient.release).toHaveBeenCalled();
        }));
        it('should throw an error if card is already in a station', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockGetCardByNumber = jest.fn().mockResolvedValue({ amount: 5 });
            FareService_1.default['_getCardByNumber'] = mockGetCardByNumber;
            FareService_1.default['lastStation'] = 'B';
            jest.spyOn(mockClient, 'release');
            mockPool.connect.mockResolvedValue(mockClient);
            yield expect(FareService_1.default.payforRide(dto)).rejects.toThrow('Card 123 is in station');
            expect(mockGetCardByNumber).toHaveBeenCalledWith('123');
            expect(mockClient.release).toHaveBeenCalled();
        }));
        it('should throw an error if card has insufficient balance', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockGetCardByNumber = jest.fn().mockResolvedValue({ amount: 2 });
            FareService_1.default['_getCardByNumber'] = mockGetCardByNumber;
            FareService_1.default['lastStation'] = null;
            FareService_1.default['fare'] = 3;
            jest.spyOn(mockClient, 'release');
            mockPool.connect.mockResolvedValue(mockClient);
            yield expect(FareService_1.default.payforRide(dto)).rejects.toThrow('Insufficient balance for card 123');
            expect(mockGetCardByNumber).toHaveBeenCalledWith('123');
            expect(mockClient.release).toHaveBeenCalled();
        }));
    });
    describe('recordRide', () => {
        it('should record the ride and return the fare', () => __awaiter(void 0, void 0, void 0, function* () {
            const dto = { card_number: '123', station: 'A' };
            const mockClient = { release: jest.fn(), query: jest.fn() };
            jest.spyOn(mockClient, 'release');
            mockPool.connect.mockResolvedValue(mockClient);
            FareService_1.default['lastStation'] = 'B';
            const result = yield FareService_1.default.recordRide(dto);
            expect(result).toEqual(2);
            expect(mockClient.query).toHaveBeenCalled();
        }));
        it('should throw an error if card has not entered a station', () => __awaiter(void 0, void 0, void 0, function* () {
            const dto = { card_number: '123', station: 'A' };
            const mockCard = { id: 1, balance: 100, station: null };
            const mockGetCardByNumber = jest.fn().mockResolvedValue(mockCard);
            FareService_1.default['_getCardByNumber'] = mockGetCardByNumber;
            mockPool.connect.mockResolvedValue(mockClient);
            yield expect(FareService_1.default.recordRide(dto)).rejects.toThrow('Recording ride Error: Card 123 has not entered a station');
            expect(mockGetCardByNumber).toHaveBeenCalledWith('123');
        }));
    });
});
//# sourceMappingURL=FareService.test.js.map