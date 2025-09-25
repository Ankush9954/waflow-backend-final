import express from 'express';
import { createCompany } from '../controllers/companyController.js';

const router = express.Router();
router.post('/companies', createCompany);
export default router;
