import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Temple from './models/templeModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/darshanease';

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const doc = await Temple.create({
      name: 'Kashi Vishwanath Temple',
      deity: 'Lord Shiva',
      location: 'Varanasi, Uttar Pradesh',
      description:
        'Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India, on the western bank of the holy river Ganges, and is one of the twelve Jyotirlingas.',
      timings: '03:00 AM - 11:00 PM',
      imageUrl: 'https://images.pexels.com/photos/34948573/pexels-photo-34948573.jpeg',
    });

    console.log('Inserted temple:', doc._id.toString());
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error inserting document:', err);
    try {
      await mongoose.disconnect();
    } catch (e) {}
    process.exit(1);
  }
}

run();
