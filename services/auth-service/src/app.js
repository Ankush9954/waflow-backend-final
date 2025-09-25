import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Auth Service Running'));

export default app;
