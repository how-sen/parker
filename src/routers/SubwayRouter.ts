import { Router } from 'express';
import SubwayController from '../controllers/SubwayController';
import FareController from '../controllers/FareController';

const router = Router();
const subwayController = new SubwayController();
const fareController = new FareController();

router.get('/stations', subwayController.index);
router.post('/train-line', subwayController.create);
router.get('/route', subwayController.getRoute);
router.post('/station/:station/enter', fareController.enterStation);
router.post('/station/:station/exit', fareController.exitStation);

export default router;