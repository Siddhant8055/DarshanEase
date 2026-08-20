import Booking from '../models/bookingModel.js';
import Slot from '../models/slotModel.js';
import Temple from '../models/templeModel.js';

/**
 * @desc    Book a darshan slot
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = async (req, res, next) => {
  const { temple, slot, devotees } = req.body;

  try {
    // Prevent Admins from booking slots
    if (req.user.role === 'ADMIN') {
      res.status(400);
      return next(new Error('Administrators are not permitted to book darshan slots. Please log in with a Devotee account.'));
    }

    // 1. Validation
    if (!temple || !slot || !devotees || !Array.isArray(devotees) || devotees.length === 0) {
      res.status(400);
      return next(new Error('Please provide temple ID, slot ID, and a list of devotees'));
    }

    const numberOfDevotees = devotees.length;

    // 2. Double-check if temple exists
    const templeExists = await Temple.findById(temple);
    if (!templeExists) {
      res.status(404);
      return next(new Error('Temple not found'));
    }

    // 3. Atomically check slot availability and decrement availableSpots
    const updatedSlot = await Slot.findOneAndUpdate(
      {
        _id: slot,
        temple: temple,
        availableSpots: { $gte: numberOfDevotees },
      },
      {
        $inc: { availableSpots: -numberOfDevotees },
      },
      { new: true }
    );

    if (!updatedSlot) {
      res.status(400);
      return next(
        new Error('Selected slot is either not found or does not have enough available spots')
      );
    }

    // 4. Create the booking document
    const booking = await Booking.create({
      user: req.user._id,
      temple,
      slot,
      devotees,
      numberOfDevotees,
      status: 'PENDING',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('temple', 'name location deity')
      .populate('slot', 'date timeSlot');

    return res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get logged-in user's bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('temple', 'name deity location imageUrl timings')
      .populate('slot', 'date timeSlot')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('Not authorized to cancel this booking'));
    }

    if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
      res.status(400);
      return next(new Error(`This booking is already ${booking.status.toLowerCase()}`));
    }

    const previousStatus = booking.status;
    booking.status = 'CANCELLED';
    await booking.save();

    // If it was PENDING or CONFIRMED, return the spots back to the slot
    if (previousStatus === 'PENDING' || previousStatus === 'CONFIRMED') {
      await Slot.findByIdAndUpdate(booking.slot, {
        $inc: { availableSpots: booking.numberOfDevotees },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully and slot capacity updated',
      data: booking,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get all bookings (Admin only)
 * @route   GET /api/bookings
 * @access  Private/Admin
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email phoneNumber')
      .populate('temple', 'name location')
      .populate('slot', 'date timeSlot')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Confirm a booking (Admin only)
 * @route   PUT /api/bookings/:id/confirm
 * @access  Private/Admin
 */
export const confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    if (booking.status !== 'PENDING') {
      res.status(400);
      return next(new Error(`Cannot confirm a booking that is currently ${booking.status}`));
    }

    booking.status = 'CONFIRMED';
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phoneNumber')
      .populate('temple', 'name location deity')
      .populate('slot', 'date timeSlot');

    return res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: populatedBooking,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Reject a booking (Admin only)
 * @route   PUT /api/bookings/:id/reject
 * @access  Private/Admin
 */
export const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    if (booking.status === 'REJECTED' || booking.status === 'CANCELLED') {
      res.status(400);
      return next(new Error(`Booking is already ${booking.status.toLowerCase()}`));
    }

    const previousStatus = booking.status;
    booking.status = 'REJECTED';
    await booking.save();

    // If it was PENDING or CONFIRMED, return the spots back to the slot
    if (previousStatus === 'PENDING' || previousStatus === 'CONFIRMED') {
      await Slot.findByIdAndUpdate(booking.slot, {
        $inc: { availableSpots: booking.numberOfDevotees },
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phoneNumber')
      .populate('temple', 'name location deity')
      .populate('slot', 'date timeSlot');

    return res.status(200).json({
      success: true,
      message: 'Booking rejected successfully and slot capacity updated',
      data: populatedBooking,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Delete/Clear a booking request (Admin only)
 * @route   DELETE /api/bookings/:id
 * @access  Private/Admin
 */
export const deleteBooking = async (req, res, next) => {
  console.log(`[Admin Booking Clear] Received request to delete booking: ${req.params.id}`);
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      console.log(`[Admin Booking Clear] Booking not found: ${req.params.id}`);
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Allow deleting only if it is CANCELLED or REJECTED (case-insensitive check)
    const currentStatus = (booking.status || '').toUpperCase();
    console.log(`[Admin Booking Clear] Booking current status: ${currentStatus}`);
    if (currentStatus !== 'CANCELLED' && currentStatus !== 'REJECTED') {
      console.log(`[Admin Booking Clear] Rejecting deletion: Booking is not cancelled or rejected`);
      res.status(400);
      return next(new Error('Only cancelled or rejected bookings can be cleared from the system'));
    }

    await Booking.findByIdAndDelete(req.params.id);
    console.log(`[Admin Booking Clear] Successfully deleted booking: ${req.params.id}`);

    return res.status(200).json({
      success: true,
      message: 'Booking request cleared successfully',
    });
  } catch (error) {
    console.error(`[Admin Booking Clear] Error occurred: ${error.message}`);
    return next(error);
  }
};
