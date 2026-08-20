import Slot from '../models/slotModel.js';
import Temple from '../models/templeModel.js';
import Booking from '../models/bookingModel.js';

/**
 * @desc    Create a new darshan slot for a temple
 * @route   POST /api/slots
 * @access  Private/Admin
 */
export const createSlot = async (req, res, next) => {
  const { temple, date, timeSlot, maxCapacity } = req.body;

  try {
    // 1. Validation
    if (!temple || !date || !timeSlot || !maxCapacity) {
      res.status(400);
      return next(new Error('Please provide temple ID, date, timeSlot, and maxCapacity'));
    }

    // 2. Check if the temple exists
    const templeExists = await Temple.findById(temple);
    if (!templeExists) {
      res.status(404);
      return next(new Error('Temple not found'));
    }

    // 3. Normalize the date (strip time details for consistency)
    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    // 4. Check if a slot for the same temple, date, and time already exists
    const duplicateSlot = await Slot.findOne({
      temple,
      date: slotDate,
      timeSlot,
    });

    if (duplicateSlot) {
      res.status(400);
      return next(new Error('A slot for this temple, date, and time duration already exists'));
    }

    // 5. Create slot (availableSpots starts equal to maxCapacity)
    const slot = await Slot.create({
      temple,
      date: slotDate,
      timeSlot,
      maxCapacity,
      availableSpots: maxCapacity,
    });

    return res.status(201).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get slots for a specific temple (defaults to today onwards, or filters by date)
 * @route   GET /api/slots/temple/:templeId
 * @access  Public
 */
export const getSlotsByTemple = async (req, res, next) => {
  const { templeId } = req.params;
  const { date } = req.query;

  try {
    let query = { temple: templeId };

    if (date) {
      // Query specific date range (start of day to end of day)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query.date = { $gte: startDate, $lte: endDate };
    } else {
      // Default: Return today's slots onwards
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      query.date = { $gte: today };
    }

    const slots = await Slot.find(query).sort({ date: 1, timeSlot: 1 });

    return res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Update slot details
 * @route   PUT /api/slots/:id
 * @access  Private/Admin
 */
export const updateSlot = async (req, res, next) => {
  const { timeSlot, maxCapacity } = req.body;

  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      res.status(404);
      return next(new Error('Slot not found'));
    }

    // If max capacity is updated, we need to adjust availableSpots
    if (maxCapacity !== undefined) {
      const bookedSpots = slot.maxCapacity - slot.availableSpots;
      if (maxCapacity < bookedSpots) {
        res.status(400);
        return next(
          new Error(
            `Cannot set capacity below currently booked spots (${bookedSpots})`
          )
        );
      }
      slot.availableSpots = maxCapacity - bookedSpots;
      slot.maxCapacity = maxCapacity;
    }

    if (timeSlot) {
      slot.timeSlot = timeSlot;
    }

    const updatedSlot = await slot.save();

    return res.status(200).json({
      success: true,
      data: updatedSlot,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Delete a slot (Admin only)
 * @route   DELETE /api/slots/:id
 * @access  Private/Admin
 */
export const deleteSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (slot) {
      // Mark all bookings associated with this slot as CANCELLED
      await Booking.updateMany({ slot: req.params.id }, { status: 'CANCELLED' });
      await Slot.deleteOne({ _id: req.params.id });
      
      return res.status(200).json({
        success: true,
        message: 'Slot deleted successfully and associated bookings updated to CANCELLED',
      });
    } else {
      res.status(404);
      return next(new Error('Slot not found'));
    }
  } catch (error) {
    return next(error);
  }
};
