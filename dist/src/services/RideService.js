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
const dbconnector_1 = __importDefault(require("../dbconfig/dbconnector"));
class RideService {
    saveRide(cardNumber, enterStation, exitStation, fare) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield dbconnector_1.default.connect();
            try {
                yield client.query('BEGIN');
                const sql = `INSERT INTO rides ("card-number", "enter-station", "exit-station", fare) VALUES ($1, $2, $3, $4)`;
                const values = [cardNumber, enterStation, exitStation, fare];
                yield client.query(sql, values);
                yield client.query('COMMIT');
            }
            catch (err) {
                yield client.query('ROLLBACK');
                throw err;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.default = new RideService;
//# sourceMappingURL=RideService.js.map