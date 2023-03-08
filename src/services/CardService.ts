import pool from '../dbconfig/dbconnector'
import { Card } from '../types/Card'


class CardService {
    public async createCards(number: string, amount: number): Promise<Card> {
        const client = await pool.connect();
        try{
            // ensure all subsequent queries to be part of the same transaction
            await client.query('BEGIN');
            const existingCard = await this._getCardByNumber(number);
            if (existingCard) {
                const newBalance: number = +(existingCard.amount as number) + amount
                const roundedBalance = Number(newBalance.toFixed(2));
                const updateCard = await this._updateCardBalance(existingCard.number, roundedBalance, client);
                // all the queries succeed, commit the transaction
                await client.query('COMMIT')
                return updateCard
            }
            const newCard = await this._createNewCardInDb(number, amount, client);
            await client.query('COMMIT')
            return newCard
        }catch(err) {
            await client.query('ROLLBACK');
            throw err;
        }finally {
            client.release()
        }
    }

    protected async _createNewCardInDb(id: string, balance: number, client: any): Promise<Card> {
        const sql = `INSERT INTO cards (NUMBER, AMOUNT) VALUES ($1, $2) RETURNING *`;
        const values = [id, balance];
        const { rows } = await pool.query(sql, values);
        const card: Card = rows[0];
        return card
    }

    protected async _updateCardBalance(id: string, newBalance: number, client: any): Promise<Card> {
        const sql = `UPDATE cards SET AMOUNT = $1 WHERE NUMBER = $2 RETURNING *`;
        const values = [newBalance, id];
        const { rows } = await pool.query(sql, values);
        const card: Card = rows[0];
        return card
    }

    protected async _getCardByNumber(number: string): Promise<Card | null> {
        const sql = `SELECT * FROM cards WHERE number = $1`;
        const values = [number];
        const { rows } = await pool.query(sql, values);
        if (rows.length === 0) {
            return null
        }

        const card: Card = rows[0];
        return card
    }
}
export default CardService