import { Request, Response } from 'express';
import CardController from '../CardController';

jest.mock('../../services/CardService');
describe('CardController', () => {
    let cardController: CardController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        cardController = new CardController();
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    describe('create', () => {
        it('should create a card and send a 201 response', async () => {
            mockRequest.body = { number: '1234567890', amount: 100 };
            await cardController.create(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
        });

        it('should send a 500 response with the error message', async () => {
            await cardController.create(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith({ message: 'An error occurred while creating the card.' });
        });
    });
});
