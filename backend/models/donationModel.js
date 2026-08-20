import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Donation amount must be at least ₹1'],
    },
    purpose: {
      type: String,
      required: [true, 'Donation purpose is required'],
      enum: ['General Donation', 'Annadanam', 'Special Pooja', 'Temple Renovation'],
      default: 'General Donation',
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['Card', 'UPI', 'Net Banking'],
      default: 'UPI',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Completed', 'Pending', 'Failed'],
      default: 'Completed',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
