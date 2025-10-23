// src/lib/models/GiftCard.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IGiftCard extends Document {
    code: string;
    currency: string;
    amount: number;
    isRedeemed: boolean;
    redeemedBy?: Schema.Types.ObjectId;
    redeemedAt?: Date;
}

const giftCardSchema = new Schema<IGiftCard>({
    code: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    isRedeemed: { type: Boolean, default: false },
    redeemedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    redeemedAt: { type: Date },
}, { timestamps: true });

const GiftCard = models.GiftCard || model<IGiftCard>('GiftCard', giftCardSchema);

export default GiftCard;