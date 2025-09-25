import express from 'express';
import mongoose from 'mongoose';
import companyRoutes from './routes/companyRoutes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
app.use(express.json());
app.use('/api', companyRoutes);

console.log(process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Company DB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

export default app;
