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
class CardService {
    creatCards(number, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield dbconnector_1.default.connect();
            try {
                // ensure all subsequent queries to be part of the same transaction
                yield client.query('BEGIN');
                const existingCard = yield this._getCardByNumber(number);
                if (existingCard) {
                    const newBalance = +existingCard.amount + amount;
                    const roundedBalance = Number(newBalance.toFixed(2));
                    const updateCard = yield this._updateCardBalance(existingCard.number, roundedBalance, client);
                    // all the queries succeed, commit the transaction
                    yield client.query('COMMIT');
                    return updateCard;
                }
                const newCard = yield this._createNewCardInDb(number, amount, client);
                yield client.query('COMMIT');
                return newCard;
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
    _createNewCardInDb(id, balance, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `INSERT INTO cards (NUMBER, AMOUNT) VALUES ($1, $2) RETURNING *`;
            const values = [id, balance];
            const { rows } = yield dbconnector_1.default.query(sql, values);
            const card = rows[0];
            return card;
        });
    }
    _updateCardBalance(id, newBalance, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE cards SET AMOUNT = $1 WHERE NUMBER = $2 RETURNING *`;
            const values = [newBalance, id];
            const { rows } = yield dbconnector_1.default.query(sql, values);
            const card = rows[0];
            return card;
        });
    }
    _getCardByNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM cards WHERE number = $1`;
            const values = [number];
            const { rows } = yield dbconnector_1.default.query(sql, values);
            if (rows.length === 0) {
                return null;
            }
            const card = rows[0];
            return card;
        });
    }
}
exports.default = CardService;
//# sourceMappingURL=CardService.js.map