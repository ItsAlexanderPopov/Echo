import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_prompt",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    isConnected = true;
    console.log('New MongoDB connection established')
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};