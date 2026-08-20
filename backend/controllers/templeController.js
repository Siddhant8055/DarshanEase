import Temple from '../models/templeModel.js';
import Slot from '../models/slotModel.js';
import Booking from '../models/bookingModel.js';

/**
 * @desc    Create a new temple
 * @route   POST /api/temples
 * @access  Private/Admin
 */
export const createTemple = async (req, res, next) => {
  const { name, deity, location, description, timings, imageUrl } = req.body;

  try {
    // 1. Validation
    if (!name || !deity || !location || !description || !timings) {
      res.status(400);
      return next(new Error('Please provide name, deity, location, description, and timings'));
    }

    // 2. Check duplicate temple name
    const templeExists = await Temple.findOne({ name });
    if (templeExists) {
      res.status(400);
      return next(new Error('A temple with this name already exists'));
    }

    // 3. Create temple
    const temple = await Temple.create({
      name,
      deity,
      location,
      description,
      timings,
      imageUrl: imageUrl || '',
    });

    return res.status(201).json({
      success: true,
      data: temple,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get all temples (with optional search keyword)
 * @route   GET /api/temples
 * @access  Public
 */
export const getTemples = async (req, res, next) => {
  try {
    // Enable search by keyword matching name, location, or deity
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { location: { $regex: req.query.keyword, $options: 'i' } },
            { deity: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const temples = await Temple.find({ ...keyword });

    return res.status(200).json({
      success: true,
      count: temples.length,
      data: temples,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get temple by ID
 * @route   GET /api/temples/:id
 * @access  Public
 */
export const getTempleById = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id);

    if (temple) {
      return res.status(200).json({
        success: true,
        data: temple,
      });
    } else {
      res.status(404);
      return next(new Error('Temple not found'));
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Update a temple
 * @route   PUT /api/temples/:id
 * @access  Private/Admin
 */
export const updateTemple = async (req, res, next) => {
  const { name, deity, location, description, timings, imageUrl } = req.body;

  try {
    const temple = await Temple.findById(req.params.id);

    if (temple) {
      temple.name = name || temple.name;
      temple.deity = deity || temple.deity;
      temple.location = location || temple.location;
      temple.description = description || temple.description;
      temple.timings = timings || temple.timings;
      temple.imageUrl = imageUrl !== undefined ? imageUrl : temple.imageUrl;

      const updatedTemple = await temple.save();

      return res.status(200).json({
        success: true,
        data: updatedTemple,
      });
    } else {
      res.status(404);
      return next(new Error('Temple not found'));
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Delete a temple
 * @route   DELETE /api/temples/:id
 * @access  Private/Admin
 */
export const deleteTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id);

    if (temple) {
      // Cascade delete slots and bookings associated with this temple
      await Slot.deleteMany({ temple: req.params.id });
      await Booking.deleteMany({ temple: req.params.id });
      await Temple.deleteOne({ _id: req.params.id });

      return res.status(200).json({
        success: true,
        message: 'Temple and all associated slots/bookings removed successfully',
      });
    } else {
      res.status(404);
      return next(new Error('Temple not found'));
    }
  } catch (error) {
    return next(error);
  }
};
