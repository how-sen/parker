import FareService from '../FareService';
import { EnterExitStationDto } from '../../types/dtos/EnterExitStationDto';

jest.mock('../../dbconfig/dbconnector', () => ({
    connect: jest.fn(),
}));

jest.mock('ioredis', () => jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
})));
describe('FareService', () => {
    const dto: EnterExitStationDto = { card_number: '123', station: 'A' };
    const mockClient = { release: jest.fn() };
    const mockPool = require('../../dbconfig/dbconnector');
    describe('payforRide', () => {   
        it('should throw an error if card is not found', async () => {
            const mockGetCardByNumber = jest.fn().mockResolvedValue(null);
            FareService['_getCardByNumber'] = mockGetCardByNumber;
            jest.spyOn(mockClient, 'release');
            mockPool.connect.mockResolvedValue(mockClient);

            await expect(FareService.payforRide(dto)).rejects.toThrow('Card with number 123 not found');
            expect(mockGetCardByNumber).toHaveBeenCalledWith('123');
            expect(mockClient.release).toHaveBeenCalled();
        });

        it('should throw an error if card is already in a station', async () => {
            const mockGetCardByNumber = jest.fn().mockResolvedValue({ amount: 5 });
            FareService['_getCardByNumber'] = mockGetCardByNumber;
            FareService['lastStation'] = 'B';
            jest.spyOn(mockClient, 'release');
            mockPool.connect.mockResolvedValue(mockClient);
  
            await expect(FareService.payforRide(dto)).rejects.toThrow('Card 123 is in station');
            expect(mockGetCardByNumber).toHaveBeenCalledWith('123');
            expect(mockClient.release).toHaveBeenCalled();
        });

        it('should throw an error if card has insufficient balance', async () => {
            const mockGetCardByNumber = jest.fn().mockResolvedValue({ amount: 2 });
            FareService['_getCardByNumber'] = mockGetCardByNumber;
            FareService['lastStation'] = null;
            FareService['fare'] = 3;
            jest.spyOn(mockClient, 'release');
            mockPool.connect.mockResolvedValue(mockClient);
  
            await expect(FareService.payforRide(dto)).rejects.toThrow('Insufficient balance for card 123');
            expect(mockGetCardByNumber).toHaveBeenCalledWith('123');
            expect(mockClient.release).toHaveBeenCalled();
        });
    });

    describe('recordRide', () => {
        it('should record the ride and return the fare', async () => {
            const dto: EnterExitStationDto = { card_number: '123', station: 'A' };
            const mockClient = { release: jest.fn(), query: jest.fn() };
            jest.spyOn(mockClient, 'release');
            mockPool.connect.mockResolvedValue(mockClient);
            FareService['lastStation'] = 'B';
            const result = await FareService.recordRide(dto);
            expect(result).toEqual(2);
            expect(mockClient.query).toHaveBeenCalled();
        });
        it('should throw an error if card has not entered a station', async () => {
            const dto: EnterExitStationDto = { card_number: '123', station: 'A' };
            const mockCard = { id: 1, balance: 100, station: null };
            const mockGetCardByNumber = jest.fn().mockResolvedValue(mockCard);
            FareService['_getCardByNumber'] = mockGetCardByNumber;
            mockPool.connect.mockResolvedValue(mockClient);
        
            await expect(FareService.recordRide(dto)).rejects.toThrow('Recording ride Error: Card 123 has not entered a station');
            expect(mockGetCardByNumber).toHaveBeenCalledWith('123');
        });      
    });
});
