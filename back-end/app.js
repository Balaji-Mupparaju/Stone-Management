import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

class App {
    constructor() {
        this.app = express();
        this.database();
    }

    database() {
        mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('Database connected successfully');
        }).catch(err => {
            console.error('Database connection error:', err);
        });
    }
}

const app = new App();
export default app;