import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IFixedDeposit extends Document {
    userId: Schema.Types.ObjectId;
    plan: string;
    currency: string;
    depositAmount: number;
    returnAmount: number;
    status: 'ACTIVE' | 'MATURED' | 'CLOSED';
    matureDate: Date;
}

const fixedDepositSchema = new Schema<IFixedDeposit>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, required: true },
    currency: { type: String, required: true },
    depositAmount: { type: Number, required: true },
    returnAmount: { type: Number, required: true },
    status: { type: String, enum: ['ACTIVE', 'MATURED', 'CLOSED'], default: 'ACTIVE' },
    matureDate: { type: Date, required: true },
}, { timestamps: true });

const FixedDeposit = models.FixedDeposit || model<IFixedDeposit>('FixedDeposit', fixedDepositSchema);

export default FixedDeposit;