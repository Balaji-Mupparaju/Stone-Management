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
  }

  routes() {
    this.app.use("/stones", stoneRoutes);
  }

  database() {
    mongoose
      .connect(process.env.MONGO_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("✅ Database connected successfully"))
      .catch((err) => console.error("❌ Database connection error:", err));
  }
}

const app = new App().app;
export default app;
