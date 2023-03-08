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
const RideService_1 = __importDefault(require("../RideService"));
const dbconnector_1 = __importDefault(require("../../dbconfig/dbconnector"));
jest.mock('../../dbconfig/dbconnector');
describe('RideService', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should save a ride', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockClient = {
            query: jest.fn(),
            release: jest.fn(),
        };
        const mockPool = dbconnector_1.default;
        mockPool.connect.mockResolvedValue(mockClient);
        yield RideService_1.default.saveRide('1234567890', 'Station A', 'Station B', 2);
        expect(mockPool.connect).toHaveBeenCalled();
        expect(mockClient.query).toHaveBeenCalledWith(expect.any(String), ['1234567890', 'Station A', 'Station B', 2]);
        expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
        expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
        expect(mockClient.release).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=RideService.test.js.map