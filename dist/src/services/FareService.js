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
const CardService_1 = __importDefault(require("./CardService"));
const RideService_1 = __importDefault(require("./RideService"));
const SubwayService_1 = __importDefault(require("./SubwayService"));
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = new ioredis_1.default({ host: 'redis' });
class FareService extends CardService_1.default {
    constructor() {
        super(...arguments);
        this.lastStation = null;
        this.fare = 0;
    }
    payforRide(enterExitStationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield dbconnector_1.default.connect();
            try {
                const { card_number, station } = enterExitStationDto;
                const card = yield this._getCardByNumber(card_number);
                if (!card) {
                    throw new Error(`Card with number ${card_number} not found`);
                }
                if (this.lastStation) {
                    throw new Error(`Card ${card_number} is in station`);
                }
                if (card.amount < this.fare) {
                    throw new Error(`Insufficient balance for card ${card_number}`);
                }
                this.lastStation = station;
                const cachedFare = yield redisClient.get(`fare:${station}`);
                if (cachedFare) {
                    this.fare = +cachedFare;
                }
                else {
                    const trainLines = yield SubwayService_1.default.getAllTrainLines();
                    for (const line of trainLines) {
                        if (line.stations.includes(station)) {
                            this.fare = line.fares;
                            break;
                        }
                    }
                    if (this.fare === 0)
                        throw new Error(`Station ${station} does not exist`);
                    yield redisClient.set(`fare:${station}`, this.fare);
                }
                const newBalance = +card.amount - +this.fare;
                const roundedBalance = Number(newBalance.toFixed(2));
                yield this._updateCardBalance(card_number, roundedBalance, client);
                return newBalance;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
            finally {
                client.release();
            }
        });
    }
    recordRide(enterExitStationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { card_number, station } = enterExitStationDto;
                const card = yield this._getCardByNumber(card_number);
                if (!card) {
                    throw new Error(`Card with number ${card_number} not found`);
                }
                if (!this.lastStation) {
                    throw new Error(`Card ${card_number} has not entered a station`);
                }
                RideService_1.default.saveRide(card_number, this.lastStation.toString(), station, +this.fare);
                this.lastStation = null;
                return +card.amount;
            }
            catch (err) {
                throw new Error(`Recording ride ${err}`);
            }
        });
    }
}
exports.default = new FareService;
//# sourceMappingURL=FareService.js.map