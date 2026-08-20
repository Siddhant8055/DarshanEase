import express from 'express';
import {
  createSlot,
  getSlotsByTemple,
  updateSlot,
  deleteSlot,
} from '../controllers/slotController.js';
import { protect, adminOrOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for creating a slot (Admin or Organizer)
router.route('/').post(protect, adminOrOrganizer, createSlot);

// Routes for individual slot management (Admin or Organizer)
router
  .route('/:id')
  .put(protect, adminOrOrganizer, updateSlot)
  .delete(protect, adminOrOrganizer, deleteSlot);

// Route for fetching slots for a temple (Public)
router.route('/temple/:templeId').get(getSlotsByTemple);

export default router;
