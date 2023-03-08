import pool from '../dbconfig/dbconnector';
import { SubwayRouteDto } from '../types/dtos/SubwayRouteDto';
import { Station } from '../types/Station';
import PriorityQueue from 'priorityqueuejs';

class SubwayService {
    public async getAllTrainLines(): Promise<Station[]> {
        const client = await pool.connect();
        try {
            const sql = `SELECT * FROM "train-lines"`;
            const { rows } = await client.query(sql);
            const trains: Station[] = rows;
            return trains;
        }catch(err) {
            console.error('Error occurred while getting all train lines: ', err);
            throw err;
        }finally {
            client.release();
        }
    }

    public async createTrainLine(name: string, stations: string[], fare: number): Promise<Station> {
        const client = await pool.connect();

        try {
            const sql = `INSERT INTO "train-lines" ("line-name", stations, fares) VALUES ($1, $2, $3) RETURNING *`;
            const values = [name, stations, fare];
            const { rows } = await client.query(sql, values);
            const train: Station = rows[0];
            return train;
        } catch (err) {
            console.error('Error occurred while creating train line: ', err);
            throw err;
        } finally {
            client.release();
        }
    }

    public async getRoute(subwayRouteDto: SubwayRouteDto): Promise<string[]> {
        const { origin, destination } = subwayRouteDto;
        const trainLines = await this.getAllTrainLines();
        try {
            // Create the adjacency list for the graph
            const adjacencyList: { [key: string]: {[key: string]: number} } = {};
            for (const line of trainLines) {
                const stations = line.stations;
                for (let i = 0; i < stations.length - 1; i++) {
                    const station1 = stations[i];
                    const station2 = stations[i + 1];
                    if (!adjacencyList[station1]) adjacencyList[station1] = {};
                    if (!adjacencyList[station2]) adjacencyList[station2] = {};
                    adjacencyList[station1][station2] = 1;
                    adjacencyList[station2][station1] = 1;
                }
            }

            const distances: {[key: string]: number} = {};
            const visited: {[key: string]: boolean} = {};
            for (const station in adjacencyList) {
                distances[station] = Infinity;
            }
            if (!(origin in distances) || !(destination in distances)){
                throw new Error('Station not exist, no path found');
            }
            distances[origin as string] = 0;

            //Dijkstra's algorithm
            const queue = new PriorityQueue<{distance: number, station: string}>();
            queue.enq({distance: 0, station: origin as string});
            while(!queue.isEmpty()) {
                const currentStation = queue.deq().station;
                visited[currentStation] = true;
                for(const neighbor in adjacencyList[currentStation]){
                    const totalDistance = distances[currentStation] + adjacencyList[currentStation][neighbor];
                    if(distances[neighbor] > totalDistance){
                        distances[neighbor] = totalDistance;
                    }
                    if(!visited[neighbor]){
                        queue.enq({distance: totalDistance, station: neighbor});
                    }
                }
            }

            if(distances[destination as string] === Infinity) {
                throw new Error('No path found');
            }

            //backtrack to get the path
            const path = []
            let currentStation = destination as string;
            while (currentStation !== origin) {
                path.unshift(currentStation);
                for(const neighbor in adjacencyList[currentStation]){
                    if (distances[neighbor] === distances[currentStation]-1){
                        currentStation = neighbor;
                        break;
                    }
                }
            }
            path.unshift(origin as string);
            return path;
        }catch(err) {
            console.error('Error occurred while finding path: ', err);
            throw err;
        }
    }  
}

export default new SubwayService
