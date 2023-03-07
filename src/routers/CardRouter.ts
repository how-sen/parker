import { Router } from 'express';
import CardController from '../controllers/CardController';

const router = Router();
const cardController = new CardController();

router.post('/card', cardController.create);

export default router;