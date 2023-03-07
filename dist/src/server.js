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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const SubwayRouter_1 = __importDefault(require("./routers/SubwayRouter"));
const CardRouter_1 = __importDefault(require("./routers/CardRouter"));
const dbconnector_1 = __importDefault(require("./dbconfig/dbconnector"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routerConfig();
        this.dbConnect();
    }
    config() {
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.json({ limit: '1mb' })); // 100kb default
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield dbconnector_1.default.connect();
                console.log('Connected to database');
            }
            catch (error) {
                console.error('Error connecting to database', error);
            }
        });
    }
    routerConfig() {
        this.app.use('/', SubwayRouter_1.default);
        this.app.use('/', CardRouter_1.default);
    }
    start(port) {
        return this.app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map