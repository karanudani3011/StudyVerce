import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Set connection options for better reliability
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,  // 10 second timeout
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.error(`\n💡 Troubleshooting Tips:`);
    console.error(`   1. Go to MongoDB Atlas → Network Access → Add your current IP (or 0.0.0.0/0 for dev)`);
    console.error(`   2. Check if your MongoDB URI is correct in server/.env`);
    console.error(`   3. Make sure your cluster is active at https://cloud.mongodb.com\n`);
    // Don't exit — keep server alive so user can check health endpoint
    console.error(`⚠️  Server is running WITHOUT database. Fix the connection and restart.\n`);
  }
};
