import { Request, Response } from 'express';
import FareService from '../services/FareService';
import { EnterExitStationDto } from '../types/dtos/EnterExitStationDto';
  
class FareController {
    public async enterStation(req: Request, res: Response) {
        try {
            const {station} = req.params;
            const {card_number} = req.body;
            const enterExitStationDto: EnterExitStationDto = { station, card_number }
            const balance: number = await FareService.payforRide(enterExitStationDto)
            res.status(200).send({ balance });
        } catch (error) {
            res.status(400).send(error);
        }
    }

    public async exitStation(req: Request, res: Response) {
        try {
            const {station} = req.params;
            const {card_number} = req.body;
            const enterExitStationDto: EnterExitStationDto = { station, card_number }
            const balance: number = await FareService.recordRide(enterExitStationDto)
            res.status(200).send({ balance });
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default FareController;