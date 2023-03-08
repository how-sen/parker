import RideService from '../RideService';
import pool from '../../dbconfig/dbconnector';

jest.mock('../../dbconfig/dbconnector');

describe('RideService', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should save a ride', async () => {
        const mockClient = {
            query: jest.fn(),
            release: jest.fn(),
        };
        const mockPool = pool as jest.Mocked<typeof pool>;
        mockPool.connect.mockResolvedValue(mockClient as never);

        await RideService.saveRide('1234567890', 'Station A', 'Station B', 2);

        expect(mockPool.connect).toHaveBeenCalled();
        expect(mockClient.query).toHaveBeenCalledWith(expect.any(String), ['1234567890', 'Station A', 'Station B', 2]);
        expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
        expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
        expect(mockClient.release).toHaveBeenCalled();
    });
});
