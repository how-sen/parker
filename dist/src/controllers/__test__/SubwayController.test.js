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
const SubwayController_1 = __importDefault(require("../SubwayController"));
const SubwayService_1 = __importDefault(require("../../services/SubwayService"));
jest.mock('../../services/SubwayService');
describe('SubwayController', () => {
    let subwayController;
    let mockRequest;
    let mockResponse;
    const mocktrainLine = { "line-name": 'Line 1', stations: ["A", "B", "C"], fares: 3 };
    const mocktrainLine2 = { "line-name": 'Line 2', stations: ["C", "D", "E"], fares: 3 };
    const mockValue = [
        mocktrainLine,
        mocktrainLine2
    ];
    beforeEach(() => {
        subwayController = new SubwayController_1.default();
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });
    describe('index', () => {
        it('should send a list of train lines and a 200 response', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockGetAllTrainLines = jest.spyOn(SubwayService_1.default, 'getAllTrainLines').mockResolvedValue(mockValue);
            yield subwayController.index(mockRequest, mockResponse);
            expect(mockGetAllTrainLines).toHaveBeenCalled();
            expect(mockResponse.send).toHaveBeenCalledWith([mocktrainLine, mocktrainLine2]);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        }));
        it('should send a 400 response with the error message when SubwayService.getAllTrainLines throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Failed to fetch train lines');
            const mockGetAllTrainLines = jest.spyOn(SubwayService_1.default, 'getAllTrainLines').mockRejectedValue(error);
            yield subwayController.index(mockRequest, mockResponse);
            expect(mockGetAllTrainLines).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(error);
        }));
    });
    describe('create', () => {
        it('should create a train line and send a 201 response', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCreateTrainLine = jest.spyOn(SubwayService_1.default, 'createTrainLine').mockResolvedValue(mocktrainLine);
            mockRequest.body = { name: 'Line 1', stations: ["A", "B", "C"], fare: 3 };
            yield subwayController.create(mockRequest, mockResponse);
            expect(mockCreateTrainLine).toHaveBeenCalledWith('Line 1', mocktrainLine.stations, mocktrainLine.fares);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.send).toHaveBeenCalledWith(mocktrainLine);
        }));
        it('should send a 400 response with the error message when SubwayService.createTrainLine throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Failed to create train line');
            const mockCreateTrainLine = jest.spyOn(SubwayService_1.default, 'createTrainLine').mockRejectedValue(error);
            mockRequest.body = { name: 'Line 1', stations: ["A", "B", "C"], fare: 3 };
            yield subwayController.create(mockRequest, mockResponse);
            expect(mockCreateTrainLine).toHaveBeenCalledWith("Line 1", mocktrainLine.stations, mocktrainLine.fares);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(error);
        }));
    });
    describe('getRoute', () => {
        it('should send a route and a 200 response', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockGetRoute = jest.spyOn(SubwayService_1.default, 'getRoute').mockResolvedValue(['A', 'B', 'C']);
            mockRequest.query = { origin: 'A', destination: 'C' };
            yield subwayController.getRoute(mockRequest, mockResponse);
            expect(mockGetRoute).toHaveBeenCalledWith({ "destination": "C", "origin": "A" });
            expect(mockResponse.send).toHaveBeenCalledWith({ "route": ["A", "B", "C"] });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        }));
        it('should send a 400 response with the error message when SubwayService.getRoute throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Failed to get route');
            const mockGetRoute = jest.spyOn(SubwayService_1.default, 'getRoute').mockRejectedValue(error);
            mockRequest.query = { origin: 'A', destination: 'C' };
            yield subwayController.getRoute(mockRequest, mockResponse);
            expect(mockGetRoute).toHaveBeenCalledWith({ "destination": "C", "origin": "A" });
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(error);
        }));
    });
});
//# sourceMappingURL=SubwayController.test.js.map