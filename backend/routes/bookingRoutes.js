import express from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  confirmBooking,
  rejectBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, adminOrOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for creating bookings and getting all bookings (Admin or Organizer)
router
  .route('/')
  .post(protect, createBooking)
  .get(protect, adminOrOrganizer, getAllBookings);

// Route for getting logged-in user's booking history
router.route('/my-bookings').get(protect, getMyBookings);

// Route for cancelling an active booking
router.route('/:id/cancel').put(protect, cancelBooking);

// Routes for confirming or rejecting bookings (Admin or Organizer)
router.route('/:id/confirm').put(protect, adminOrOrganizer, confirmBooking);
router.route('/:id/reject').put(protect, adminOrOrganizer, rejectBooking);

// Route for clearing/deleting a cancelled/rejected booking (Admin or Organizer)
router.route('/:id').delete(protect, adminOrOrganizer, deleteBooking);

export default router;
