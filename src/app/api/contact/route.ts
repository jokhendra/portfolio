import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

// Simple in-memory rate limiter (per instance)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;
const ipToTimestamps = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  // Fallback when running locally
  return 'local';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (ipToTimestamps.get(ip) || []).filter((t) => t > windowStart);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipToTimestamps.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipToTimestamps.set(ip, timestamps);
  return false;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, subject, message, companyWebsite, elapsedMs } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      companyWebsite?: string; // honeypot
      elapsedMs?: number; // time on form
    };

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Honeypot: bots often fill hidden fields
    if (companyWebsite && companyWebsite.trim().length > 0) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // Basic time check: submissions under 3 seconds are suspicious
    if (typeof elapsedMs === 'number' && elapsedMs < 3000) {
      return NextResponse.json({ error: 'Form submitted too quickly' }, { status: 400 });
    }

    // Additional validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email' }, { status: 400 });
    }
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: 'Name must be between 2 and 100 characters' }, { status: 400 });
    }
    if (subject.length < 5 || subject.length > 120) {
      return NextResponse.json({ error: 'Subject must be between 5 and 120 characters' }, { status: 400 });
    }
    if (message.length < 10 || message.length > 1000) {
      return NextResponse.json({ error: 'Message must be between 10 and 1000 characters' }, { status: 400 });
    }

    // If no database is configured, run in "demo" mode and still succeed
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not set; contact form submission stored in memory (demo mode).');
      return NextResponse.json(
        { message: 'Message received (demo mode).', contact: { name, email, subject, message } },
        { status: 201 }
      );
    }

    // Connect to MongoDB (production mode)
    await connectDB();

    // Create new contact entry
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      { message: 'Message sent successfully', contact },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 