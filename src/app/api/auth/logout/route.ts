// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // 1. Create a response object.
        const response = NextResponse.json({ success: true });

        // 2. Set the cookie on the response with maxAge: 0 to delete it.
        response.cookies.set('auth-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Expire the cookie immediately
            path: '/',
        });

        // 3. Return the response.
        return response;

    } catch (error) {
        return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
    }
}