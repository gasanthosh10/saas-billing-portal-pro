import mongoose from 'mongoose';

export const connectDb = async (mongoUri) => {
  if (!mongoUri) throw new Error('MONGO_URI is required');
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

