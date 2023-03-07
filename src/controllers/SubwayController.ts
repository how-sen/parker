import { Request, Response } from 'express';
import SubwayService from '../services/SubwayService';
import { SubwayRouteDto } from '../types/dtos/SubwayRouteDto';
  
class SubwayController {
    public async index(req: Request, res: Response) {
        try {
            const trains = await SubwayService.getAllTrainLines();
            res.send(trains);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { name, stations, fare } = req.body;
            const train = await SubwayService.createTrainLine(name, stations, fare);
            res.status(201).send(train);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    public async getRoute(req: Request, res: Response) {
        try {
            const origin: string = req.query.origin as string;
            const destination: string = req.query.destination as string;
            const subwayRouteDto: SubwayRouteDto = { origin, destination };
            const route = await SubwayService.getRoute(subwayRouteDto);
            res.send({ route });
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default SubwayController;