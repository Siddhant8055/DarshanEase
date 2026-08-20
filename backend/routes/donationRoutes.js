import express from 'express';
import {
  createDonation,
  getMyDonations,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
} from '../controllers/donationController.js';
import { protect, adminOrOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for creating donations and listing all donations
router
  .route('/')
  .post(protect, createDonation)
  .get(protect, adminOrOrganizer, getAllDonations);

// Route for getting logged-in user's donation history
router.route('/my-donations').get(protect, getMyDonations);

// Routes for individual donation CRUD operations
router
  .route('/:id')
  .get(protect, getDonationById)
  .put(protect, adminOrOrganizer, updateDonation)
  .delete(protect, adminOrOrganizer, deleteDonation);

export default router;
