import CardService from '../CardService';
import pool from '../../dbconfig/dbconnector';

jest.mock('../../dbconfig/dbconnector');

describe('CardService', () => {
    describe('createCards', () => {
        it('creates a new card with the given number and amount', async () => {
            const mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };
            (pool.connect as jest.Mock).mockResolvedValue(mockClient);
            const cardService = new CardService();
            const cardNumber = '1234567890';
            const amount = 1000;
            cardService.createCards = jest.fn().mockResolvedValue({
                number: cardNumber,
                amount
            });
            const result = await cardService.createCards(cardNumber, amount);
            expect(result).toEqual({
                number: cardNumber,
                amount: amount,
            });
        });

        it('handles invalid amount balance errors during card creation', async () => {
            const mockClient = {
                query: jest.fn(),
                release: jest.fn()
            };
            (pool.connect as jest.Mock).mockResolvedValue(mockClient);
            const cardService = new CardService();
            const cardNumber = '1234567890';
            const amount = -1000;
            await expect(cardService.createCards(cardNumber, amount)).rejects.toThrow();
        });
    });
});
