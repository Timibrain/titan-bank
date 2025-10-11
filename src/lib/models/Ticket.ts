// src/lib/models/Ticket.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

const ticketReplySchema = new Schema({
    author: { type: String, required: true }, // Can be 'user' or 'admin'
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export interface ITicket extends Document {
    userId: Schema.Types.ObjectId;
    ticketId: string;
    subject: string;
    status: 'PENDING' | 'ACTIVE' | 'CLOSED';
    replies: { author: string; message: string; createdAt: Date }[];
}

const ticketSchema = new Schema<ITicket>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ticketId: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'ACTIVE', 'CLOSED'], default: 'PENDING' },
    replies: [ticketReplySchema],
}, { timestamps: true });

// Pre-save hook to generate a random ticket ID
ticketSchema.pre('save', function (next) {
    if (this.isNew && !this.ticketId) {
        this.ticketId = `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    next();
});

const Ticket = models.Ticket || model<ITicket>('Ticket', ticketSchema);

export default Ticket;