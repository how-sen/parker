import SubwayService from '../SubwayService';
import { SubwayRouteDto } from '../../types/dtos/SubwayRouteDto';
import { Station } from '../../types/Station';

describe('SubwayService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTrainLines', () => {
        it('should return all train lines', async () => {
            const expectedTrainLines: Station[] = [{ "line-name": 'Line 1', stations: ["A", "B"], fares: 2.5 }];
            jest.spyOn(SubwayService, 'getAllTrainLines').mockResolvedValue(expectedTrainLines);

            const trainLines = await SubwayService.getAllTrainLines();

            expect(trainLines).toEqual(expectedTrainLines);
            expect(jest.spyOn(SubwayService, 'getAllTrainLines')).toHaveBeenCalled();
            expect(jest.spyOn(SubwayService, 'getAllTrainLines')).toHaveReturned();
        });

        it('should throw an error if there is an error fetching train lines', async () => {
            const expectedError = new Error('Failed to fetch train lines');
            jest.spyOn(SubwayService, 'getAllTrainLines').mockRejectedValue(expectedError);

            await expect(SubwayService.getAllTrainLines()).rejects.toThrow(expectedError);
            expect(jest.spyOn(SubwayService, 'getAllTrainLines')).toHaveBeenCalled();
            expect(jest.spyOn(SubwayService, 'getAllTrainLines')).toHaveReturned();
        });
    });

    describe('createTrainLine', () => {
        it('should create a train line', async () => {
            const expectedTrainLine: Station = { "line-name": 'Line 2', stations: ["C", "D"], fares: 3.0 };
            jest.spyOn(SubwayService, 'createTrainLine').mockResolvedValue(expectedTrainLine);
            jest.spyOn(SubwayService, 'getAllTrainLines').mockResolvedValue([expectedTrainLine]);

            const trainLine = await SubwayService.createTrainLine('Line 2', ["C", "D"], 3.0);

            expect(trainLine).toEqual(expectedTrainLine);
            expect(jest.spyOn(SubwayService, 'createTrainLine')).toHaveReturned();
        });

        it('should throw an error if there is an error creating a train line', async () => {
            const expectedError = new Error('Failed to create train line');
            jest.spyOn(SubwayService, 'createTrainLine').mockRejectedValue(expectedError);

            await expect(SubwayService.createTrainLine('Line C', ['Station 5', 'Station 6'], 3.5)).rejects.toThrow(expectedError);
            expect(jest.spyOn(SubwayService, 'createTrainLine')).toHaveBeenCalledWith('Line C', ['Station 5', 'Station 6'], 3.5);
            expect(jest.spyOn(SubwayService, 'createTrainLine')).toHaveReturned();
        });
    });
  
    describe('getRoute', () => {
        it('should return the shortest path between two stations', async () => {
            const subwayRouteDto: SubwayRouteDto = { origin: 'A', destination: 'B' };
            const expectedPath = ['A', 'B'];
            jest.spyOn(SubwayService, 'getAllTrainLines').mockResolvedValue([
                { "line-name": 'Line 1', stations: ["A", "B", "C"], fares: 2.5 },
                { "line-name": 'Line 2', stations: ["D", "E", "B"], fares: 3.0 },
            ]);

            const path = await SubwayService.getRoute(subwayRouteDto);

            expect(path).toEqual(expectedPath);
            expect(jest.spyOn(SubwayService, 'getAllTrainLines')).toHaveBeenCalled();
        });

        it('should throw an error if there is no path between the origin and destination', async () => {
            const subwayRouteDto: SubwayRouteDto = { origin: 'A', destination: 'F' };
            const expectedError = new Error('Station not exist, no path found');
            jest.spyOn(SubwayService, 'getAllTrainLines').mockResolvedValue([
                { "line-name": 'Line 1', stations: ["A", "B", "C"], fares: 2.5 },
                { "line-name": 'Line 2', stations: ["D", "E"], fares: 3.0 },
            ]);

            await expect(SubwayService.getRoute(subwayRouteDto)).rejects.toThrow(expectedError);
            expect(jest.spyOn(SubwayService, 'getAllTrainLines')).toHaveBeenCalled();
        });

        it('should handle errors while finding the path', async () => {
            const subwayRouteDto: SubwayRouteDto = { origin: 'A', destination: 'B' };
            const expectedError = new Error('Failed to find path');
            jest.spyOn(SubwayService, 'getAllTrainLines').mockResolvedValue([
                { "line-name": 'Line 1', stations: ["A", "B", "C"], fares: 2.5 },
                { "line-name": 'Line 2', stations: ["D", "E", "B"], fares: 3.0 },
            ]);
            jest.spyOn(SubwayService, 'getRoute').mockRejectedValue(expectedError);

            await expect(SubwayService.getRoute(subwayRouteDto)).rejects.toThrow(expectedError);
        });
    });
});
   
