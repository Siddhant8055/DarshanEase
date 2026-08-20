import Donation from '../models/donationModel.js';
import Temple from '../models/templeModel.js';

/**
 * @desc    Create a new donation
 * @route   POST /api/donations
 * @access  Private
 */
export const createDonation = async (req, res, next) => {
  const { temple, amount, purpose, paymentMethod } = req.body;

  try {
    if (!temple || !amount || !purpose || !paymentMethod) {
      res.status(400);
      return next(new Error('Please provide temple, amount, purpose, and payment method'));
    }

    // Verify temple exists
    const dbTemple = await Temple.findById(temple);
    if (!dbTemple) {
      res.status(404);
      return next(new Error('Temple not found'));
    }

    // Generate unique transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const donation = await Donation.create({
      user: req.user._id,
      temple,
      amount,
      purpose,
      paymentMethod,
      transactionId,
      status: 'Completed', // Defaulting to completed in simulation
    });

    res.status(210).json({
      success: true,
      message: 'Donation processed successfully',
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in user's donations
 * @route   GET /api/donations/my-donations
 * @access  Private
 */
export const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .populate('temple', 'name deity location imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all donations (Admin/Organizer only)
 * @route   GET /api/donations
 * @access  Private/AdminOrOrganizer
 */
export const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({})
      .populate('user', 'name email phoneNumber')
      .populate('temple', 'name location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get donation by ID
 * @route   GET /api/donations/:id
 * @access  Private
 */
export const getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('user', 'name email')
      .populate('temple', 'name location deity');

    if (!donation) {
      res.status(404);
      return next(new Error('Donation record not found'));
    }

    // Authorization: User must be owner or Admin/Organizer
    if (
      donation.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN' &&
      req.user.role !== 'ORGANIZER'
    ) {
      res.status(403);
      return next(new Error('Access denied, unauthorized record access'));
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update donation details (Admin/Organizer only)
 * @route   PUT /api/donations/:id
 * @access  Private/AdminOrOrganizer
 */
export const updateDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      res.status(404);
      return next(new Error('Donation record not found'));
    }

    const { status, purpose, amount } = req.body;

    if (status) donation.status = status;
    if (purpose) donation.purpose = purpose;
    if (amount) donation.amount = amount;

    const updatedDonation = await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation record updated successfully',
      data: updatedDonation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete/Clear donation record (Admin/Organizer only)
 * @route   DELETE /api/donations/:id
 * @access  Private/AdminOrOrganizer
 */
export const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      res.status(404);
      return next(new Error('Donation record not found'));
    }

    await donation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Donation record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
