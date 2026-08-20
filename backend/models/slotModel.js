import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple reference is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot duration is required'],
      trim: true,
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Maximum capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    availableSpots: {
      type: Number,
      required: true,
      min: [0, 'Available spots cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate slots for the same temple, date, and time duration
slotSchema.index({ temple: 1, date: 1, timeSlot: 1 }, { unique: true });

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;
