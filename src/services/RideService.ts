import pool from '../dbconfig/dbconnector';

class RideService {
    public async saveRide(cardNumber: string, enterStation: string, exitStation: string, fare: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const sql = `INSERT INTO rides ("card-number", "enter-station", "exit-station", fare) VALUES ($1, $2, $3, $4)`;
            const values = [cardNumber, enterStation, exitStation, fare];
            await client.query(sql, values);
            await client.query('COMMIT');
        }catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}

export default new RideService