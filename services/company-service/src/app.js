import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import companyRoutes from "./routes/companyRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api", companyRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Company DB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default app;
