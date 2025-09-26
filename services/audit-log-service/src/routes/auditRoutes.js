import express from 'express';
import { createLog, getLogs } from '../controllers/auditController.js';
import authMiddleware from '../../../../libs/middlewares/authMiddleware.js';
import roleMiddleware from '../../../../libs/middlewares/roleMiddleware.js';

const router = express.Router();

// Create log (internal call)
router.post('/log', createLog);

// Get logs (Manager-only + tenant isolation)
router.get('/logs', authMiddleware, roleMiddleware(['manager']), getLogs);

export default router;
