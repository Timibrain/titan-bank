// src/app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import * as Ably from 'ably';
import GiftCard from '@/lib/models/GiftCard';
import sendEmail from '@/lib/email';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Transaction from '@/lib/models/Transaction';
import Ticket from '@/lib/models/Ticket';
import FixedDeposit from '@/lib/models/FixedDeposit';

connectDB();

const typeDefs = `#graphql
  type Balance { currency: String!, amount: Float! }
  type User { id: ID!, email: String!, name: String, accountNumber: String, balances: [Balance], activeFixedDepositsCount: Int, activeTicketsCount: Int }
  type AuthPayload { token: String!, user: User! }
  type Transaction { id: ID!, date: String!, description: String!, amount: Float!, type: String!, currency: String!, status: String! }
  type FixedDeposit { id: ID!, plan: String!, currency: String!, depositAmount: Float!, returnAmount: Float!, status: String!, matureDate: String! }
  type TicketReply { author: String, message: String, createdAt: String }
  type Ticket { id: ID!, ticketId: String!, subject: String!, status: String!, replies: [TicketReply], createdAt: String, updatedAt: String }

  type Query {
    me: User
    myTransactions: [Transaction]
    myFixedDeposits: [FixedDeposit]
    myTickets(status: String): [Ticket]
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String # Now returns a message
    verifyOtp(email: String!, otp: String!): AuthPayload # New mutation
    signInWithGoogle(googleCode: String!): AuthPayload
    logout: String
    deposit(amount: Float!, currency: String!): User
    applyFixedDeposit(plan: String!, currency: String!, amount: Float!): FixedDeposit
    createTicket(subject: String!, message: String!): Ticket
    triggerTestNotification(message: String!): String
    redeemGiftCard(code: String!): User 
  }
`;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:3000');

const resolvers = {
    Query: {
        me: async (_: any, __: any, context: any) => {
            if (!context.userId) throw new Error('Not authenticated');
            return await User.findById(context.userId);
        },
        myTransactions: async (_: any, __: any, context: any) => {
            if (!context.userId) throw new Error('Not authenticated');
            return await Transaction.find({ userId: context.userId }).sort({ date: -1 });
        },
        myFixedDeposits: async (_: any, __: any, context: any) => {
            if (!context.userId) throw new Error('Not authenticated');
            return await FixedDeposit.find({ userId: context.userId }).sort({ createdAt: -1 });
        },
        myTickets: async (_: any, { status }: any, context: any) => {
            if (!context.userId) throw new Error('Not authenticated');
            const filter: { userId: any; status?: string } = { userId: context.userId };
            if (status) filter.status = status;
            return await Ticket.find(filter).sort({ updatedAt: -1 });
        },
    },
    User: {
        activeFixedDepositsCount: async (parent: any) => await FixedDeposit.countDocuments({ userId: parent._id, status: 'ACTIVE' }),
        activeTicketsCount: async (parent: any) => await Ticket.countDocuments({ userId: parent._id, status: 'ACTIVE' }),
    },
    Mutation: {
        registerUser: async (_: any, args: any) => {
            const hashedPassword = await bcrypt.hash(args.password, 10);
            const newUser = new User({ name: args.name, email: args.email, password: hashedPassword });
            await newUser.save();

            // --- Send Welcome Email ---
            await sendEmail(
                newUser.email,
                "Welcome to Titan Bank!",
                `Hi ${newUser.name},\n\nThank you for registering with Titan Bank. Your account number is ${newUser.accountNumber}.\n\nBest regards,\nThe Titan Bank Team`
            );
            // --------------------------

            return newUser;
        },
        login: async (_: any, { email, password }: any) => {
            const user = await User.findOne({ email }).select('+password'); // Include password
            if (!user) { throw new Error('Invalid credentials.'); }

            const isValid = await bcrypt.compare(password, user.password!);
            if (!isValid) { throw new Error('Invalid credentials.'); }

            // Generate OTP (e.g., 6 digits)
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

            // Store OTP and expiry on the user document (add these fields to User model)
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();

            // --- Send OTP Email ---
            await sendEmail(
                email,
                "Your Titan Bank Login OTP",
                `Your One-Time Password is: ${otp}\n\nThis code will expire in 10 minutes.`
            );
            // --------------------

            
            // Option 2: Send via Email (Requires setup)
            // await sendOtpEmail(email, otp); // Implement this function

            return "OTP sent to your email address.";
        },

        verifyOtp: async (_: any, { email, otp }: any) => {
            const user = await User.findOne({ email, otp, otpExpiry: { $gt: new Date() } });

            if (!user) {
                throw new Error('Invalid or expired OTP.');
            }

            // Clear OTP fields after successful verification
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();

            // Generate JWT
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

            await sendEmail(
                user.email,
                "Successful Login to Titan Bank",
                `Hi ${user.name},\n\nWe detected a successful login to your account just now. If this wasn't you, please secure your account immediately.`
            );
            // ---------------------------


            // We return the token here; the frontend will call /api/auth/set-token
            return { token, user };
        },
        signInWithGoogle: async (_: any, { googleCode }: any) => {
            const { tokens } = await client.getToken(googleCode);
            if (!tokens.id_token) throw new Error("Failed to retrieve ID token from Google.");
            const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
            const payload = ticket.getPayload();
            if (!payload?.email || !payload?.name) throw new Error('Invalid Google token payload.');
            let user = await User.findOne({ email: payload.email });
            if (!user) {
                const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
                user = new User({ name: payload.name, email: payload.email, password: hashedPassword });
                await user.save();
            }
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
            return { token, user };
        },
        
        deposit: async (_: any, { amount, currency }: any, context: any) => {
            if (!context.userId) throw new Error('Not authenticated');
            if (amount <= 0) throw new Error('Deposit amount must be positive.');
            const user = await User.findById(context.userId);
            if (!user) throw new Error('User not found.');
            const balance = user.balances.find((b: any) => b.currency === currency);
            if (balance) balance.amount += amount;
            else user.balances.push({ currency, amount });
            const transaction = new Transaction({ userId: context.userId, amount, currency, type: 'CREDIT', description: `Deposit to ${currency} wallet` });
            await transaction.save();
            await user.save();
            return user;
        },
        applyFixedDeposit: async (_: any, { plan, currency, amount }: any, context: any) => {
            if (!context.userId) throw new Error('Not authenticated');
            let interestRate = 0, durationInMonths = 0;
            if (plan === 'starter') { interestRate = 0.05; durationInMonths = 6; }
            else if (plan === 'premium') { interestRate = 0.08; durationInMonths = 12; }
            else if (plan === 'professional') { interestRate = 0.12; durationInMonths = 24; }
            else throw new Error("Invalid plan selected.");
            const returnAmount = amount + (amount * interestRate);
            const matureDate = new Date();
            matureDate.setMonth(matureDate.getMonth() + durationInMonths);
            const newFixedDeposit = new FixedDeposit({ userId: context.userId, plan, currency, depositAmount: amount, returnAmount, status: 'ACTIVE', matureDate });
            await newFixedDeposit.save();
            return newFixedDeposit;
        },
        createTicket: async (_: any, { subject, message }: any, context: any) => {
            if (!context.userId) throw new Error('Not authenticated');
            const newTicket = new Ticket({ userId: context.userId, subject, replies: [{ author: 'user', message }] });
            await newTicket.save();
            return newTicket;
        },
        triggerTestNotification: async (_: any, { message }: any) => {
            if (!process.env.ABLY_API_KEY) throw new Error("Ably API key not configured.");
            const ably = new Ably.Realtime(process.env.ABLY_API_KEY);
            const channel = ably.channels.get('general-notifications');
            await channel.publish('new-message', { text: message });
            ably.close();
            return "Notification sent!";
        },

        redeemGiftCard: async (_: any, { code }: any, context: any) => {
            if (!context.userId) throw new Error('Not authenticated');

            // Find the gift card
            const giftCard = await GiftCard.findOne({ code: code });

            // Validation
            if (!giftCard) throw new Error('Invalid gift card code.');
            if (giftCard.isRedeemed) throw new Error('Gift card already redeemed.');

            // Find the user
            const user = await User.findById(context.userId);
            if (!user) throw new Error('User not found.');

            // Update user balance
            const balance = user.balances.find((b: any) => b.currency === giftCard.currency);
            if (balance) {
                balance.amount += giftCard.amount;
            } else {
                user.balances.push({ currency: giftCard.currency, amount: giftCard.amount });
            }

            // Mark card as redeemed
            giftCard.isRedeemed = true;
            giftCard.redeemedBy = context.userId;
            giftCard.redeemedAt = new Date();

            // Create transaction record
            const transaction = new Transaction({
                userId: context.userId,
                amount: giftCard.amount,
                currency: giftCard.currency,
                type: 'CREDIT',
                description: `Gift Card Redeemed (${giftCard.code})`,
                status: 'COMPLETED',
            });

            // Save all changes
            await user.save();
            await giftCard.save();
            await transaction.save();

            // Send email notification to admin
            await sendEmail( // Use the correct imported function name
                process.env.ADMIN_EMAIL!, // 👈 Add the recipient email
                'Gift Card Redeemed',
                `User ${user.email} (ID: ${user.id}) redeemed gift card ${giftCard.code} for ${giftCard.amount} ${giftCard.currency}.`
            );
            
            return user; // Return updated user data
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => {
        const token = req.cookies.get('auth-token')?.value || '';

        if (!token) return { userId: null };

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            return { userId: (decoded as any).userId };
        } catch (err) {
            return { userId: null };
        }
    },
});

export { handler as GET, handler as POST };