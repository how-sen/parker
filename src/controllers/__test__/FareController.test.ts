import { Request, Response } from 'express';
import FareController from '../FareController';
import FareService from '../../services/FareService';
import { EnterExitStationDto } from '../../types/dtos/EnterExitStationDto';

jest.mock('../../services/FareService');

describe('FareController', () => {
    let fareController: FareController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        fareController = new FareController();
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    describe('enterStation', () => {
        it('should call FareService.payforRide and send a 200 response', async () => {
            const enterExitStationDto: EnterExitStationDto = { station: 'A', card_number: '1234567890' };
            const expectedBalance = 50;
            const mockPayforRide = jest.spyOn(FareService, 'payforRide').mockResolvedValue(expectedBalance);

            mockRequest.params = { station: 'A' };
            mockRequest.body = { card_number: '1234567890' };
            await fareController.enterStation(mockRequest as Request, mockResponse as Response);

            expect(mockPayforRide).toHaveBeenCalledWith(enterExitStationDto);
            expect(mockResponse.send).toHaveBeenCalledWith({ balance: expectedBalance });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('should send a 400 response with the error message when FareService.payforRide throws an error', async () => {
            const error = new Error('Invalid card');
            const mockPayforRide = jest.spyOn(FareService, 'payforRide').mockRejectedValue(error);

            mockRequest.params = { station: 'A' };
            mockRequest.body = { card_number: '1234567890' };
            await fareController.enterStation(mockRequest as Request, mockResponse as Response);

            expect(mockPayforRide).toHaveBeenCalledWith({ station: 'A', card_number: '1234567890' });
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(error);
        });
    });
    describe('exitStation', () => {
        it('should call FareService.recordRide and send a 200 response', async () => {
            const enterExitStationDto: EnterExitStationDto = { station: 'A', card_number: '1234567890' };
            const expectedBalance = 30;
            const mockRecordRide = jest.spyOn(FareService, 'recordRide').mockResolvedValue(expectedBalance);

            mockRequest.params = { station: 'A' };
            mockRequest.body = { card_number: '1234567890' };
            await fareController.exitStation(mockRequest as Request, mockResponse as Response);

            expect(mockRecordRide).toHaveBeenCalledWith(enterExitStationDto);
            expect(mockResponse.send).toHaveBeenCalledWith({ balance: expectedBalance });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('should send a 400 response with the error message when FareService.recordRide throws an error', async () => {
            const error = new Error('Invalid card');
            const mockRecordRide = jest.spyOn(FareService, 'recordRide').mockRejectedValue(error);

            mockRequest.params = { station: 'A' };
            mockRequest.body = { card_number: '1234567890' };
            await fareController.exitStation(mockRequest as Request, mockResponse as Response);

            expect(mockRecordRide).toHaveBeenCalledWith({ station: 'A', card_number: '1234567890' });
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });
});