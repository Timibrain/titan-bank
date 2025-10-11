// src/lib/models/Transaction.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: Schema.Types.ObjectId;
    date: Date;
    description: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    currency: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

const transactionSchema = new Schema<ITransaction>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['COMPLETED', 'PENDING', 'FAILED'], default: 'COMPLETED' },
}, { timestamps: true });

const Transaction = models.Transaction || model<ITransaction>('Transaction', transactionSchema);

export default Transaction;