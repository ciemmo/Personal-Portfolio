import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Server-side validation (duplicate client validation for security)
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Additional validation: prevent extremely long messages that could be abusive
    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message is too long (maximum 1000 characters)" },
        { status: 400 }
      );
    }

    // Configure nodemailer transporter
    // You'll need to set these environment variables in your .env.local file
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO, // Your personal email where you want to receive messages
      subject: `New Portfolio Contact: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}

        Message:
        ${message}
      `,
      // You can also send HTML version if preferred
      // html: `<b>Name:</b> ${name}<br><b>Email:</b> ${email}<br><br><b>Message:</b><br>${message}`
    });

    console.log("Email sent: %s", info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Contact form error:", error);

    // Handle specific nodemailer errors
    if (error instanceof Error) {
      if (error.message.includes("auth")) {
        return NextResponse.json(
          { error: "Email authentication failed. Please check your email credentials." },
          { status: 500 }
        );
      }

      if (error.message.includes("connection")) {
        return NextResponse.json(
          { error: "Failed to connect to email service. Please try again later." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}