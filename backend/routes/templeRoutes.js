import express from 'express';
import {
  createTemple,
  getTemples,
  getTempleById,
  updateTemple,
  deleteTemple,
} from '../controllers/templeController.js';
import { protect, adminOrOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for listing temples and creating temples
router
  .route('/')
  .get(getTemples) // Public route
  .post(protect, adminOrOrganizer, createTemple); // Admin or Organizer route

// Routes for individual temple CRUD operations
router
  .route('/:id')
  .get(getTempleById) // Public route
  .put(protect, adminOrOrganizer, updateTemple) // Admin or Organizer route
  .delete(protect, adminOrOrganizer, deleteTemple); // Admin or Organizer route

export default router;
