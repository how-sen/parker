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
const SubwayService_1 = __importDefault(require("../SubwayService"));
describe('SubwayService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllTrainLines', () => {
        it('should return all train lines', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTrainLines = [{ "line-name": 'Line 1', stations: ["A", "B"], fares: 2.5 }];
            jest.spyOn(SubwayService_1.default, 'getAllTrainLines').mockResolvedValue(expectedTrainLines);
            const trainLines = yield SubwayService_1.default.getAllTrainLines();
            expect(trainLines).toEqual(expectedTrainLines);
            expect(jest.spyOn(SubwayService_1.default, 'getAllTrainLines')).toHaveBeenCalled();
            expect(jest.spyOn(SubwayService_1.default, 'getAllTrainLines')).toHaveReturned();
        }));
        it('should throw an error if there is an error fetching train lines', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedError = new Error('Failed to fetch train lines');
            jest.spyOn(SubwayService_1.default, 'getAllTrainLines').mockRejectedValue(expectedError);
            yield expect(SubwayService_1.default.getAllTrainLines()).rejects.toThrow(expectedError);
            expect(jest.spyOn(SubwayService_1.default, 'getAllTrainLines')).toHaveBeenCalled();
            expect(jest.spyOn(SubwayService_1.default, 'getAllTrainLines')).toHaveReturned();
        }));
    });
    describe('createTrainLine', () => {
        it('should create a train line', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTrainLine = { "line-name": 'Line 2', stations: ["C", "D"], fares: 3.0 };
            jest.spyOn(SubwayService_1.default, 'createTrainLine').mockResolvedValue(expectedTrainLine);
            jest.spyOn(SubwayService_1.default, 'getAllTrainLines').mockResolvedValue([expectedTrainLine]);
            const trainLine = yield SubwayService_1.default.createTrainLine('Line 2', ["C", "D"], 3.0);
            expect(trainLine).toEqual(expectedTrainLine);
            expect(jest.spyOn(SubwayService_1.default, 'createTrainLine')).toHaveReturned();
        }));
        it('should throw an error if there is an error creating a train line', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedError = new Error('Failed to create train line');
            jest.spyOn(SubwayService_1.default, 'createTrainLine').mockRejectedValue(expectedError);
            yield expect(SubwayService_1.default.createTrainLine('Line C', ['Station 5', 'Station 6'], 3.5)).rejects.toThrow(expectedError);
            expect(jest.spyOn(SubwayService_1.default, 'createTrainLine')).toHaveBeenCalledWith('Line C', ['Station 5', 'Station 6'], 3.5);
            expect(jest.spyOn(SubwayService_1.default, 'createTrainLine')).toHaveReturned();
        }));
    });
    describe('getRoute', () => {
        it('should return the shortest path between two stations', () => __awaiter(void 0, void 0, void 0, function* () {
            const subwayRouteDto = { origin: 'A', destination: 'B' };
            const expectedPath = ['A', 'B'];
            jest.spyOn(SubwayService_1.default, 'getAllTrainLines').mockResolvedValue([
                { "line-name": 'Line 1', stations: ["A", "B", "C"], fares: 2.5 },
                { "line-name": 'Line 2', stations: ["D", "E", "B"], fares: 3.0 },
            ]);
            const path = yield SubwayService_1.default.getRoute(subwayRouteDto);
            expect(path).toEqual(expectedPath);
            expect(jest.spyOn(SubwayService_1.default, 'getAllTrainLines')).toHaveBeenCalled();
        }));
        it('should throw an error if there is no path between the origin and destination', () => __awaiter(void 0, void 0, void 0, function* () {
            const subwayRouteDto = { origin: 'A', destination: 'F' };
            const expectedError = new Error('Station not exist, no path found');
            jest.spyOn(SubwayService_1.default, 'getAllTrainLines').mockResolvedValue([
                { "line-name": 'Line 1', stations: ["A", "B", "C"], fares: 2.5 },
                { "line-name": 'Line 2', stations: ["D", "E"], fares: 3.0 },
            ]);
            yield expect(SubwayService_1.default.getRoute(subwayRouteDto)).rejects.toThrow(expectedError);
            expect(jest.spyOn(SubwayService_1.default, 'getAllTrainLines')).toHaveBeenCalled();
        }));
        it('should handle errors while finding the path', () => __awaiter(void 0, void 0, void 0, function* () {
            const subwayRouteDto = { origin: 'A', destination: 'B' };
            const expectedError = new Error('Failed to find path');
            jest.spyOn(SubwayService_1.default, 'getAllTrainLines').mockResolvedValue([
                { "line-name": 'Line 1', stations: ["A", "B", "C"], fares: 2.5 },
                { "line-name": 'Line 2', stations: ["D", "E", "B"], fares: 3.0 },
            ]);
            jest.spyOn(SubwayService_1.default, 'getRoute').mockRejectedValue(expectedError);
            yield expect(SubwayService_1.default.getRoute(subwayRouteDto)).rejects.toThrow(expectedError);
        }));
    });
});
//# sourceMappingURL=SubwayService.test.js.map