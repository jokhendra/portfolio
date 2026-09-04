import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { profile } from '@/data/profile';

/**
 * Contact intake.
 *
 * Responses carry a status only - never the stored document or internal error
 * text. Spam controls are layered: honeypot field, minimum time on form, length
 * bounds, and a per-instance rate limit.
 */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MIN_TIME_ON_FORM_MS = 3000;

/**
 * Per-instance only: serverless deployments run several instances, so treat
 * this as a speed bump rather than a guarantee. Durable limiting belongs in a
 * shared store (Redis or Upstash) if abuse becomes real.
 */
const ipToTimestamps = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'local';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (ipToTimestamps.size > 500) {
    for (const [key, stamps] of ipToTimestamps) {
      if (stamps.every((stamp) => stamp <= windowStart)) ipToTimestamps.delete(key);
    }
  }

  const timestamps = (ipToTimestamps.get(ip) || []).filter((stamp) => stamp > windowStart);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipToTimestamps.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipToTimestamps.set(ip, timestamps);
  return false;
}

const bounds = {
  name: [2, 100],
  subject: [5, 120],
  message: [10, 1000],
  company: [0, 120],
  projectType: [0, 120],
} as const;

export async function POST(req: Request) {
  try {
    if (isRateLimited(getClientIp(req))) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = (await req.json()) as Record<string, unknown>;
    const read = (key: string) => (typeof body[key] === 'string' ? (body[key] as string).trim() : '');

    const name = read('name');
    const email = read('email');
    const company = read('company');
    const projectType = read('projectType');
    const subject = read('subject');
    const message = read('message');
    const honeypot = read('companyWebsite');
    const elapsedMs = typeof body.elapsedMs === 'number' ? body.elapsedMs : undefined;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    if (honeypot.length > 0) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    if (typeof elapsedMs === 'number' && elapsedMs < MIN_TIME_ON_FORM_MS) {
      return NextResponse.json({ error: 'Form submitted too quickly' }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email' }, { status: 400 });
    }

    for (const [field, value] of Object.entries({ name, subject, message, company, projectType })) {
      const [min, max] = bounds[field as keyof typeof bounds];
      if (value.length < min || value.length > max) {
        return NextResponse.json(
          { error: `${field} must be between ${min} and ${max} characters` },
          { status: 400 }
        );
      }
    }

    if (!process.env.MONGODB_URI) {
      // Demo mode: the form stays usable without a database, and nothing about
      // the submission is echoed back to the client.
      console.warn('[contact] MONGODB_URI not set; submission accepted without persistence.');
      return NextResponse.json({ message: 'Message received (demo mode).' }, { status: 201 });
    }

    try {
      await connectDB();
      await Contact.create({ name, email, company, projectType, subject, message });
    } catch (dbError) {
      // A generic 500 would leave the sender thinking the message went through.
      // Tell them it did not, and give them a route that always works.
      console.error('[contact] persistence failed:', dbError);
      return NextResponse.json(
        { error: `Your message could not be saved. Please email ${profile.email} directly.` },
        { status: 503 }
      );
    }

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 });
  } catch (error) {
    console.error('[contact] submission failed:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
