import dotenv from 'dotenv';
import Temple from '../models/templeModel.js';
import Slot from '../models/slotModel.js';
import connectDB from '../config/db.js';

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const sampleTemples = [
  {
    name: 'Kashi Vishwanath Temple',
    deity: 'Lord Shiva',
    location: 'Varanasi, Uttar Pradesh',
    description:
      'Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India, on the western bank of the holy river Ganges, and is one of the twelve Jyotirlingas.',
    timings: '03:00 AM - 11:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Somnath Temple',
    deity: 'Lord Shiva',
    location: 'Prabhas Patan, Veraval, Gujarat',
    description:
      'The Somnath temple, located in Prabhas Patan, Gujarat, is the first among the twelve Aadi Jyotirlinga shrines of Shiva. It is a key pilgrimage and tourist spot of Gujarat.',
    timings: '06:00 AM - 09:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tirupati Balaji (Venkateswara Temple)',
    deity: 'Lord Venkateswara (Vishnu)',
    location: 'Tirumala, Andhra Pradesh',
    description:
      'Sri Venkateswara Swami Temple is a landmark Vaishnavite temple situated in the hill town of Tirumala at Tirupati in Tirupati district of Andhra Pradesh, India.',
    timings: '05:30 AM - 10:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Meenakshi Amman Temple',
    deity: 'Goddess Meenakshi (Parvati)',
    location: 'Madurai, Tamil Nadu',
    description:
      'Meenakshi Temple is a historic Hindu temple located on the southern bank of the Vaigai River in the temple city of Madurai, Tamil Nadu. It is dedicated to Goddess Meenakshi and her consort Lord Sundareswarar.',
    timings: '05:00 AM - 12:30 PM, 04:00 PM - 10:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e1a?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kedarnath Temple',
    deity: 'Lord Shiva',
    location: 'Kedarnath, Uttarakhand',
    description:
      'Kedarnath Temple is a Hindu temple dedicated to the Hindu god Shiva. The temple is located on the Garhwal Himalayan range near the Mandakini river in the state of Uttarakhand, India.',
    timings: '04:00 AM - 09:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Shri Saibaba Sansthan Temple',
    deity: 'Shirdi Sai Baba',
    location: 'Shirdi, Ahmednagar, Maharashtra',
    description:
      'Shri Saibaba Sansthan Temple in Shirdi is a holy shrine dedicated to the revered spiritual master Sai Baba. Millions of pilgrims from all over the world visit Shirdi to seek blessings and experience solace.',
    timings: '04:00 AM - 11:00 PM',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Sai_Baba_Temple_,_Shirdi.jpg?width=1200',
  },
  {
    name: 'Shree Siddhivinayak Temple',
    deity: 'Lord Ganesha',
    location: 'Prabhadevi, Mumbai, Maharashtra',
    description:
      'The Shree Siddhivinayak Ganapati Mandir is a Hindu temple dedicated to Lord Shri Ganesha. It is one of the richest and most frequented temples in Mumbai, known for granting devotees wishes.',
    timings: '05:30 AM - 10:00 PM',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Siddhivinayak_Temple.jpg?width=1200',
  },
  {
    name: 'Trimbakeshwar Shiva Temple',
    deity: 'Lord Shiva (Jyotirlinga)',
    location: 'Trimbak, Nashik, Maharashtra',
    description:
      'Trimbakeshwar Shiva Temple is an ancient Hindu temple in the town of Trimbak, in the Nashik district of Maharashtra. It is dedicated to the god Shiva and is one of the twelve sacred Jyotirlingas, and the origin point of the sacred Godavari River.',
    timings: '05:30 AM - 09:00 PM',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Trimbakeshwar_Temple.jpg?width=1600',
  },
  {
    name: 'Shree Mahalakshmi Temple (Ambabai)',
    deity: 'Goddess Mahalakshmi',
    location: 'Kolhapur, Maharashtra',
    description:
      'The Shri Mahalakshmi Temple of Kolhapur in Maharashtra is one of the Shakti Peethas listed in various puranas of Hinduism. It is historically and architecturally renowned for the Kiranotsav (sun rays festival).',
    timings: '05:00 AM - 10:30 PM',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kolhapur%27s_Mahalaxmi_temple_exteriors_03.jpg?width=1200',
  },
  {
    name: 'Bhimashankar Jyotirlinga Temple',
    deity: 'Lord Shiva (Jyotirlinga)',
    location: 'Bhimashankar, Pune, Maharashtra',
    description:
      'Bhimashankar Temple is a Jyotirlinga shrine located 50 km northwest of Khed near Pune, in Maharashtra, India. It is located in the Ghat region of the Sahyadri Hills and is also the source of the river Bhima.',
    timings: '04:30 AM - 09:30 PM',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bhimashankar_temple.jpg?width=1600',
  },
  {
    name: 'Shree Vitthal-Rukmini Mandir',
    deity: 'Lord Vitthal (Krishna)',
    location: 'Pandharpur, Solapur, Maharashtra',
    description:
      'The Vitthal-Rukmini Temple, Pandharpur is the premier worship center for the Varkari sampradaya in Maharashtra. It sits peacefully on the banks of the sacred Chandrabhaga River.',
    timings: '04:00 AM - 11:00 PM',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vithoba_temple_pandharpur.jpg?width=1200',
  },
  {
    name: 'Grishneshwar Jyotirlinga Temple',
    deity: 'Lord Shiva (Jyotirlinga)',
    location: 'Ellora, Chhatrapati Sambhajinagar, Maharashtra',
    description:
      'Grishneshwar Jyotirlinga Temple is one of the shrines dedicated to Lord Shiva, located in Verul/Ellora, near the famous Ellora Caves in Maharashtra. It is regarded as the 12th or the last Jyotirlinga on earth.',
    timings: '05:30 AM - 09:30 PM',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Grishneshwar_temple_Ellora.jpg?width=1200',
  },
];

const importData = async () => {
  try {
    // Clear existing temple and slot data
    await Temple.deleteMany();
    await Slot.deleteMany();

    // Insert Temples
    const createdTemples = await Temple.insertMany(sampleTemples);
    console.log(`Inserted ${createdTemples.length} sample temples.`);

    // Generate upcoming dates for slots (today and next 5 days)
    const today = new Date();
    const slotTimes = ['06:00 AM - 08:00 AM', '09:00 AM - 11:00 AM', '04:00 PM - 06:00 PM', '07:00 PM - 09:00 PM'];
    
    const slotsToInsert = [];

    for (const temple of createdTemples) {
      for (let dayOffset = 0; dayOffset <= 5; dayOffset++) {
        const slotDate = new Date(today);
        slotDate.setDate(today.getDate() + dayOffset);
        slotDate.setHours(0, 0, 0, 0);

        for (const timeSlot of slotTimes) {
          slotsToInsert.push({
            temple: temple._id,
            date: slotDate,
            timeSlot,
            maxCapacity: 30,
            availableSpots: 30,
          });
        }
      }
    }

    await Slot.insertMany(slotsToInsert);
    console.log(`Generated ${slotsToInsert.length} slots for the sample temples.`);

    console.log('Database successfully seeded with sample data!');
    process.exit();
  } catch (error) {
    console.error(`Error during data seeding: ${error.message}`);
    process.exit(1);
  }
};

importData();
