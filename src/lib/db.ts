// src/db.ts
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined in the .env file');
        }
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;