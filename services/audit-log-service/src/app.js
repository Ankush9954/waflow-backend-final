import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import auditRoutes from './routes/auditRoutes.js';
import { errorHandler } from '../../../libs/middlewares/errorMiddleware.js';
import { requireTenant } from '../../../libs/middlewares/tenantMiddleware.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/audit', auditRoutes);

//Global Middlewares
app.use(errorHandler);
app.use(requireTenant);

// DB connection + start server
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Audit-Log Service running on port ${PORT}`));
  })
  .catch((err) => console.error('DB Connection Error:', err));
