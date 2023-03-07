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
const priorityqueuejs_1 = __importDefault(require("priorityqueuejs"));
class SubwayService {
    getAllTrainLines() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield dbconnector_1.default.connect();
            try {
                const sql = `SELECT * FROM "train-lines"`;
                const { rows } = yield client.query(sql);
                const trains = rows;
                return trains;
            }
            catch (err) {
                console.error('Error occurred while getting all train lines: ', err);
                throw err;
            }
            finally {
                client.release();
            }
        });
    }
    createTrainLine(name, stations, fare) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield dbconnector_1.default.connect();
            try {
                const sql = `INSERT INTO "train-lines" ("line-name", stations, fares) VALUES ($1, $2, $3) RETURNING *`;
                const values = [name, stations, fare];
                const { rows } = yield client.query(sql, values);
                const train = rows[0];
                return train;
            }
            catch (err) {
                console.error('Error occurred while creating train line: ', err);
                throw err;
            }
            finally {
                client.release();
            }
        });
    }
    getRoute(subwayRouteDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin, destination } = subwayRouteDto;
            const trainLines = yield this.getAllTrainLines();
            try {
                // Create the adjacency list for the graph
                const adjacencyList = {};
                for (const line of trainLines) {
                    const stations = line.stations;
                    for (let i = 0; i < stations.length - 1; i++) {
                        const station1 = stations[i];
                        const station2 = stations[i + 1];
                        if (!adjacencyList[station1])
                            adjacencyList[station1] = {};
                        if (!adjacencyList[station2])
                            adjacencyList[station2] = {};
                        adjacencyList[station1][station2] = 1;
                        adjacencyList[station2][station1] = 1;
                    }
                }
                const distances = {};
                const visited = {};
                for (const station in adjacencyList) {
                    distances[station] = Infinity;
                }
                distances[origin] = 0;
                //Dijkstra's algorithm
                const queue = new priorityqueuejs_1.default();
                queue.enq({ distance: 0, station: origin });
                while (!queue.isEmpty()) {
                    const currentStation = queue.deq().station;
                    visited[currentStation] = true;
                    for (const neighbor in adjacencyList[currentStation]) {
                        const totalDistance = distances[currentStation] + adjacencyList[currentStation][neighbor];
                        if (distances[neighbor] > totalDistance) {
                            distances[neighbor] = totalDistance;
                        }
                        if (!visited[neighbor]) {
                            queue.enq({ distance: totalDistance, station: neighbor });
                        }
                    }
                }
                if (distances[destination] === Infinity) {
                    throw new Error('No path found');
                }
                //backtrack to get the path
                const path = [];
                let currentStation = destination;
                while (currentStation !== origin) {
                    path.unshift(currentStation);
                    for (const neighbor in adjacencyList[currentStation]) {
                        if (distances[neighbor] === distances[currentStation] - 1) {
                            currentStation = neighbor;
                            break;
                        }
                    }
                }
                path.unshift(origin);
                return path;
            }
            catch (err) {
                console.error('Error occurred while finding path: ', err);
                throw err;
            }
        });
    }
}
exports.default = new SubwayService;
//# sourceMappingURL=SubwayService.js.map