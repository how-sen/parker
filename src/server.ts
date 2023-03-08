import express from 'express';
import bodyParser from 'body-parser';
import stationsRouter from './routers/SubwayRouter';
import cardsRouter from './routers/CardRouter';
import pool from './dbconfig/dbconnector';

class Server {
    private app;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();
    }

    private config() {
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
    }

    private async dbConnect() {
        try {
            const client = await pool.connect();
            console.log('Connected to database');
        } catch (error) {
            console.error('Error connecting to database', error);
        }
    }

    private routerConfig() {
        this.app.use('/', stationsRouter);
        this.app.use('/', cardsRouter);
    }

    public start(port: number) {
        return this.app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }
}

export default Server;