import pool from '../dbconfig/dbconnector'
import { EnterExitStationDto } from '../types/dtos/EnterExitStationDto'
import CardService from './CardService';
import RideService from './RideService';
import SubwayService from './SubwayService';
import Redis from 'ioredis';

const redisClient = new Redis({host: 'redis'});
class FareService extends CardService{
    private lastStation: String | null = null;
    private fare: Number | 0 = 0;
    public async payforRide(enterExitStationDto: EnterExitStationDto): Promise<number> {
        const client = await pool.connect();
        try {
            const { card_number, station } = enterExitStationDto;

            const card = await this._getCardByNumber(card_number);
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
            const cachedFare = await redisClient.get(`fare:${station}`);
            if(cachedFare) {
                this.fare = +cachedFare;
            } else {
                const trainLines = await SubwayService.getAllTrainLines();
                for (const line of trainLines) {
                    if (line.stations.includes(station)){
                        this.fare = line.fares;
                        break;
                    }
                }
                if (this.fare === 0) throw new Error(`Station ${station} does not exist`);
                await redisClient.set(`fare:${station}`, this.fare as number)
            }
        
            const newBalance = +card.amount - +this.fare;
            const roundedBalance: number = Number(newBalance.toFixed(2));
            await this._updateCardBalance(card_number, roundedBalance, client);

            return newBalance;
        } catch(err){
            console.error(err);
            throw err;
        } finally {
            client.release();
        }
    }
    public async recordRide(enterExitStationDto: EnterExitStationDto): Promise<number> {
        try {
            const { card_number, station } = enterExitStationDto;

            const card = await this._getCardByNumber(card_number);
            if (!card) {
                throw new Error(`Card with number ${card_number} not found`);
            }
            if (!this.lastStation) {
                throw new Error(`Card ${card_number} has not entered a station`);
            }
            RideService.saveRide(card_number, this.lastStation.toString(), station, +this.fare)
            this.lastStation = null
            return +card.amount  
        }catch (err) {
            throw new Error(`Error recording ride: ${err}`);
        }
    }
}

export default new FareService