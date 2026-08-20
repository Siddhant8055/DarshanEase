import mongoose from 'mongoose';

const templeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Temple name is required'],
      unique: true,
      trim: true,
    },
    deity: {
      type: String,
      required: [true, 'Deity name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    timings: {
      type: String,
      required: [true, 'Temple timings are required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Temple = mongoose.model('Temple', templeSchema);

export default Temple;
