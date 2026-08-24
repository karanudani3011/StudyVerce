import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studyverse';

async function cleanup() {
  try {
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Delete all tutors / faculty from tutors collection
    const tutorsCollection = mongoose.connection.collection('tutors');
    const deleteTutorsRes = await tutorsCollection.deleteMany({});
    console.log(`Deleted ${deleteTutorsRes.deletedCount} documents from tutors collection.`);

    // Also delete any users with role 'tutor' or 'faculty' from users collection
    const usersCollection = mongoose.connection.collection('users');
    const deleteUsersRes = await usersCollection.deleteMany({ role: { $in: ['tutor', 'faculty'] } });
    console.log(`Deleted ${deleteUsersRes.deletedCount} faculty/tutor accounts from users collection.`);

    console.log('✅ Faculty account cleanup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during cleanup:', err.message);
    process.exit(1);
  }
}

cleanup();
