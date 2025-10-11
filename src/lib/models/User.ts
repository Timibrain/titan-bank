// src/lib/models/User.ts
import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Check if the model already exists in Mongoose's cache before creating it
const User = models.User || model('User', userSchema);

export default User;