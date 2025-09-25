import express from 'express';
import {
  createManager,
  getManagers,
  getManagerById,
  updateManager,
  deleteManager,
} from '../controllers/userController.js';

const router = express.Router();

// Manager CRUD APIs
router.post('/managers', createManager);
router.get('/managers', getManagers);
router.get('/managers/:id', getManagerById);
router.put('/managers/:id', updateManager);
router.delete('/managers/:id', deleteManager);

export default router;
