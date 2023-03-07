import { Request, Response } from 'express';
import CardService from '../services/CardService';

const cardService = new CardService();

class CardController {
    public async create(req: Request, res: Response) {
        try {
            const { number, amount } = req.body;
            const card = await cardService.creatCards(number, amount);
            res.status(201).send(card);
        } catch (error) {
            res.status(400).send(error);
            res.status(500).json({ message: 'An error occurred while creating the card.' });
        }
    }
}

export default CardController;