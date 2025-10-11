// src/app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Transaction from '@/lib/models/Transaction';
import Ticket from '@/lib/models/Ticket';
import * as Ably from 'ably';

connectDB();

const typeDefs = `#graphql
  type Balance {
    currency: String!
    amount: Float!
  }
  
  type User {
    id: ID!
    email: String!
    name: String
    accountNumber: String
    balances: [Balance]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Transaction {
    id: ID!
    date: String!
    description: String!
    amount: Float!
    type: String!
    currency: String!
    status: String!
  }

    type FixedDeposit {
    id: ID!
    plan: String!
    currency: String!
    depositAmount: Float!
    returnAmount: Float!
    status: String!
    matureDate: String!
  }

  type TicketReply {
    author: String
    message: String
    createdAt: String
  }

  type Ticket {
    id: ID!
    ticketId: String!
    subject: String!
    status: String!
    replies: [TicketReply]
    createdAt: String
    updatedAt: String
  }

  type Query {
    me: User
    myTransactions: [Transaction]
    myFixedDeposits: [FixedDeposit]
    myTickets(status: String): [Ticket]
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload
    signInWithGoogle(googleCode: String!): AuthPayload
    createTicket(subject: String!, message: String!): Ticket
    triggerTestNotification(message: String!): String
  }
`;

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
);

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            return await User.findById(context.userId);
        },

        // --- NEW TRANSACTIONS RESOLVER ---
        myTransactions: async (_parent: any, _args: any, context: any) => {
            if (!context.userId) {
                throw new Error('Not authenticated');
            }
            // Find all transactions for the logged-in user and sort by most recent
            return await Transaction.find({ userId: context.userId }).sort({ date: -1 });
        },
        myTickets: async (_parent: any, { status }: any, context: any) => {
            if (!context.userId) { throw new Error('Not authenticated'); }

            const filter: { userId: any; status?: string } = { userId: context.userId };
            if (status) {
                filter.status = status;
            }
            return await Ticket.find(filter).sort({ updatedAt: -1 });
        },
    },
    Mutation: {
        registerUser: async (_parent: any, args: any) => {
            const existingUser = await User.findOne({ email: args.email });
            if (existingUser) { throw new Error('User with this email already exists.'); }
            const hashedPassword = await bcrypt.hash(args.password, 10);
            const newUser = new User({ name: args.name, email: args.email, password: hashedPassword });
            await newUser.save();
            return newUser;
        },
        login: async (_parent: any, args: any) => {
            const user = await User.findOne({ email: args.email });
            if (!user) { throw new Error('No user found with this email address.'); }
            const isValid = await bcrypt.compare(args.password, user.password);
            if (!isValid) { throw new Error('Invalid password.'); }
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
            return { token, user };
        },
        signInWithGoogle: async (_parent: any, { googleCode }: any) => {
            const { tokens } = await client.getToken(googleCode);
            const idToken = tokens.id_token;
            if (!idToken) { throw new Error("Failed to retrieve ID token from Google."); }
            const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
            const payload = ticket.getPayload();
            if (!payload?.email || !payload?.name) { throw new Error('Invalid Google token payload.'); }
            let user = await User.findOne({ email: payload.email });
            if (!user) {
                const randomPassword = Math.random().toString(36).slice(-8);
                const hashedPassword = await bcrypt.hash(randomPassword, 10);
                user = new User({ name: payload.name, email: payload.email, password: hashedPassword });
                await user.save();
            }
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
            return { token, user };
        },
        createTicket: async (_parent: any, { subject, message }: any, context: any) => {
            if (!context.userId) { throw new Error('Not authenticated'); }

            const newTicket = new Ticket({
                userId: context.userId,
                subject: subject,
                replies: [{ author: 'user', message: message }],
            });

            await newTicket.save();
            return newTicket;
        },
        
        triggerTestNotification: async (_parent: any, { message }: any) => {
            if (!process.env.ABLY_API_KEY) {
                throw new Error("Ably API key not configured.");
            }
            // Initialize Ably on the backend
            const ably = new Ably.Realtime(process.env.ABLY_API_KEY);
            const channel = ably.channels.get('general-notifications');

            // Publish the message to the channel
            await channel.publish('new-message', { text: message });

            ably.close();
            return "Notification sent!";
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => {
        const authHeader = req.headers.get('authorization') || '';
        const token = authHeader.split(' ')[1];

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