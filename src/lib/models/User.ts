// src/lib/models/User.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

const balanceSchema = new Schema({
    currency: { type: String, required: true },
    amount: { type: Number, default: 0 },
}, { _id: false });

// Define the interface for the User document
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; 
    otp?: string;
    otpExpiry?: Date;
    accountNumber?: string;
    balances: { currency: string; amount: number }[];
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String, select: false }, // select: false prevents it from being returned by default
    otpExpiry: { type: Date, select: false },
    password: { type: String, required: true, select: false }, // Prevent password from being returned by default
    accountNumber: { type: String, unique: true },
    balances: [balanceSchema],
}, { timestamps: true });

userSchema.pre('save', function (next) {
    if (this.isNew) {
        if (!this.accountNumber) {
            this.accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        }
        if (!this.balances || this.balances.length === 0) {
            this.balances = [
                { currency: 'USD', amount: 0 },
                { currency: 'EUR', amount: 0 },
                { currency: 'CAD', amount: 0 },
                { currency: 'GBP', amount: 0 },
                { currency: 'AUD', amount: 0 },
            ] as any; // Use 'as any' to bypass strict subdocument typing
        }
    }
    next();
});

const User = models.User || model<IUser>('User', userSchema);

export default User;