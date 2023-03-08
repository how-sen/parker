import { Request, Response } from 'express';
import SubwayController from '../SubwayController';
import SubwayService from '../../services/SubwayService';
import { Station } from '../../types/Station';

jest.mock('../../services/SubwayService');

describe('SubwayController', () => {
    let subwayController: SubwayController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mocktrainLine: Station = { "line-name": 'Line 1', stations: ["A", "B", "C"], fares: 3 };
    const mocktrainLine2: Station = { "line-name": 'Line 2', stations: ["C", "D", "E"], fares: 3 };
    const mockValue: Station[] = [
        mocktrainLine,
        mocktrainLine2
    ];

    beforeEach(() => {
        subwayController = new SubwayController();
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    describe('index', () => {
        it('should send a list of train lines and a 200 response', async () => {
            const mockGetAllTrainLines = jest.spyOn(SubwayService, 'getAllTrainLines').mockResolvedValue(mockValue);

            await subwayController.index(mockRequest as Request, mockResponse as Response);

            expect(mockGetAllTrainLines).toHaveBeenCalled();
            expect(mockResponse.send).toHaveBeenCalledWith([mocktrainLine, mocktrainLine2]);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('should send a 400 response with the error message when SubwayService.getAllTrainLines throws an error', async () => {
            const error = new Error('Failed to fetch train lines');
            const mockGetAllTrainLines = jest.spyOn(SubwayService, 'getAllTrainLines').mockRejectedValue(error);

            await subwayController.index(mockRequest as Request, mockResponse as Response);

            expect(mockGetAllTrainLines).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(error);
        });
    });

    describe('create', () => {
        it('should create a train line and send a 201 response', async () => {
            const mockCreateTrainLine = jest.spyOn(SubwayService, 'createTrainLine').mockResolvedValue(mocktrainLine);

            mockRequest.body = {name: 'Line 1', stations: ["A", "B", "C"], fare: 3 };
            await subwayController.create(mockRequest as Request, mockResponse as Response);

            expect(mockCreateTrainLine).toHaveBeenCalledWith('Line 1', mocktrainLine.stations, mocktrainLine.fares);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.send).toHaveBeenCalledWith(mocktrainLine);
        });

        it('should send a 400 response with the error message when SubwayService.createTrainLine throws an error', async () => {
            const error = new Error('Failed to create train line');
            const mockCreateTrainLine = jest.spyOn(SubwayService, 'createTrainLine').mockRejectedValue(error);

            mockRequest.body = { name: 'Line 1', stations: ["A", "B", "C"], fare: 3 };
            await subwayController.create(mockRequest as Request, mockResponse as Response);

            expect(mockCreateTrainLine).toHaveBeenCalledWith("Line 1", mocktrainLine.stations, mocktrainLine.fares);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(error);
        });
    });
    describe('getRoute', () => {
        it('should send a route and a 200 response', async () => {
            const mockGetRoute = jest.spyOn(SubwayService, 'getRoute').mockResolvedValue(['A', 'B', 'C']);
  
            mockRequest.query = { origin: 'A', destination: 'C'};
            await subwayController.getRoute(mockRequest as Request, mockResponse as Response);
  
            expect(mockGetRoute).toHaveBeenCalledWith({"destination": "C", "origin": "A"});
            expect(mockResponse.send).toHaveBeenCalledWith({"route": ["A", "B", "C"]});
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
  
        it('should send a 400 response with the error message when SubwayService.getRoute throws an error', async () => {
            const error = new Error('Failed to get route');
            const mockGetRoute = jest.spyOn(SubwayService, 'getRoute').mockRejectedValue(error);
  
            mockRequest.query = { origin: 'A', destination: 'C'};
            await subwayController.getRoute(mockRequest as Request, mockResponse as Response);
  
            expect(mockGetRoute).toHaveBeenCalledWith({"destination": "C", "origin": "A"});
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(error);
        });
    });  
});
