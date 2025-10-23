import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import stoneRoutes from "./routes/stone.js";

dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.database();
  }

  middlewares() {
    this.app.use(express.json());
    // Enable CORS for frontend communication
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });
  }

  routes() {
    this.app.use("/stones", stoneRoutes);
  }
  database() {
    const uri = process.env.MONGO_CONNECTION_STRING;
    if (!uri) {
      console.error("❌ MONGO_CONNECTION_STRING is undefined. Check your .env file!");
      return;
    }
  
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("✅ Database connected successfully"))
      .catch((err) => console.error("❌ Database connection error:", err));
  }
  
}

const app = new App().app;
export default app;
