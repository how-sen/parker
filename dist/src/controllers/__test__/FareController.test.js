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
const FareController_1 = __importDefault(require("../FareController"));
const FareService_1 = __importDefault(require("../../services/FareService"));
jest.mock('../../services/FareService');
describe('FareController', () => {
    let fareController;
    let mockRequest;
    let mockResponse;
    beforeEach(() => {
        fareController = new FareController_1.default();
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });
    describe('enterStation', () => {
        it('should call FareService.payforRide and send a 200 response', () => __awaiter(void 0, void 0, void 0, function* () {
            const enterExitStationDto = { station: 'A', card_number: '1234567890' };
            const expectedBalance = 50;
            const mockPayforRide = jest.spyOn(FareService_1.default, 'payforRide').mockResolvedValue(expectedBalance);
            mockRequest.params = { station: 'A' };
            mockRequest.body = { card_number: '1234567890' };
            yield fareController.enterStation(mockRequest, mockResponse);
            expect(mockPayforRide).toHaveBeenCalledWith(enterExitStationDto);
            expect(mockResponse.send).toHaveBeenCalledWith({ balance: expectedBalance });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        }));
        it('should send a 400 response with the error message when FareService.payforRide throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Invalid card');
            const mockPayforRide = jest.spyOn(FareService_1.default, 'payforRide').mockRejectedValue(error);
            mockRequest.params = { station: 'A' };
            mockRequest.body = { card_number: '1234567890' };
            yield fareController.enterStation(mockRequest, mockResponse);
            expect(mockPayforRide).toHaveBeenCalledWith({ station: 'A', card_number: '1234567890' });
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(error);
        }));
    });
    describe('exitStation', () => {
        it('should call FareService.recordRide and send a 200 response', () => __awaiter(void 0, void 0, void 0, function* () {
            const enterExitStationDto = { station: 'A', card_number: '1234567890' };
            const expectedBalance = 30;
            const mockRecordRide = jest.spyOn(FareService_1.default, 'recordRide').mockResolvedValue(expectedBalance);
            mockRequest.params = { station: 'A' };
            mockRequest.body = { card_number: '1234567890' };
            yield fareController.exitStation(mockRequest, mockResponse);
            expect(mockRecordRide).toHaveBeenCalledWith(enterExitStationDto);
            expect(mockResponse.send).toHaveBeenCalledWith({ balance: expectedBalance });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        }));
        it('should send a 400 response with the error message when FareService.recordRide throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Invalid card');
            const mockRecordRide = jest.spyOn(FareService_1.default, 'recordRide').mockRejectedValue(error);
            mockRequest.params = { station: 'A' };
            mockRequest.body = { card_number: '1234567890' };
            yield fareController.exitStation(mockRequest, mockResponse);
            expect(mockRecordRide).toHaveBeenCalledWith({ station: 'A', card_number: '1234567890' });
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        }));
    });
});
//# sourceMappingURL=FareController.test.js.map