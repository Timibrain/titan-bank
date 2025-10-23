// src/lib/email.ts
import nodemailer from 'nodemailer';

async function sendEmail(to: string, subject: string, text: string) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Email configuration missing in .env.local. Cannot send email.");
        // Optionally throw an error or handle differently in production
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: false, // Often false for port 587 with TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // Add TLS options if needed, especially for Gmail
        tls: {
            rejectUnauthorized: false // Necessary for local development sometimes
        }
    });

    try {
        const info = await transporter.sendMail({
            from: `"Titan Bank" <${process.env.EMAIL_USER}>`, // Sender address
            to: to, // List of receivers
            subject: subject, // Subject line
            text: text, // Plain text body
            // html: "<b>Hello world?</b>", // HTML body (optional)
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        // Handle the error appropriately in a real application
    }
}

export default sendEmail;