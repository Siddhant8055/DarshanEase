import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple reference is required'],
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: [true, 'Slot reference is required'],
    },
    devotees: [
      {
        name: {
          type: String,
          required: [true, 'Devotee name is required'],
          trim: true,
        },
        age: {
          type: Number,
          required: [true, 'Devotee age is required'],
          min: [0, 'Age cannot be negative'],
        },
        gender: {
          type: String,
          required: [true, 'Devotee gender is required'],
          enum: ['Male', 'Female', 'Other'],
        },
      },
    ],
    numberOfDevotees: {
      type: Number,
      required: true,
      min: [1, 'Must book for at least 1 devotee'],
      default: 1,
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
