"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { profile } from '@/data/profile';

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  subject: string;
  message: string;
  /** Honeypot: real users never see or fill this. */
  companyWebsite: string;
}

type FormErrors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;

const MAX_MESSAGE_LENGTH = 1000;

const projectTypes = [
  'Senior AI engineering role',
  'Agentic system build',
  'RAG / retrieval build',
  'AI architecture review',
  'Full-stack product work',
  'Something else',
];

const helpWith = [
  'Designing agent graphs that survive tool failures and long conversations',
  'Taking a RAG prototype to something you can measure and defend',
  'Reviewing an LLM architecture before it becomes expensive to change',
  'Shipping the whole thing: API, interface, deployment, instrumentation',
];

const emptyForm: FormData = {
  name: '',
  email: '',
  company: '',
  projectType: projectTypes[0],
  subject: '',
  message: '',
  companyWebsite: '',
};

function validateField(name: string, value: string): string {
  switch (name) {
    case 'name':
      return value.trim().length < 2 ? 'Please enter at least 2 characters' : '';
    case 'email':
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : '';
    case 'subject':
      return value.trim().length < 5 ? 'Please enter at least 5 characters' : '';
    case 'message':
      return value.trim().length < 10 ? 'Please add a little more detail' : '';
    default:
      return '';
  }
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [startedAt, setStartedAt] = useState(() => Date.now());

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return;

    setFormData((previous) => ({ ...previous, [name]: value }));
    if (touched[name]) {
      setFormErrors((previous) => ({ ...previous, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));
    setFormErrors((previous) => ({ ...previous, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const errors: FormErrors = {};
    (['name', 'email', 'subject', 'message'] as const).forEach((field) => {
      const message = validateField(field, formData[field]);
      if (message) errors[field] = message;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTouched({ name: true, email: true, subject: true, message: true });
      const firstError = Object.keys(errors)[0];
      document.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, elapsedMs: Date.now() - startedAt }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      setIsSubmitted(true);
      setFormData({ ...emptyForm });
      setTouched({});
      setFormErrors({});
      setStartedAt(Date.now());
      setTimeout(() => setIsSubmitted(false), 6000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldBorder = (field: keyof FormErrors) =>
    touched[field] && formErrors[field] ? { borderColor: 'var(--accent)' } : undefined;

  return (
    <section id="contact" className="section-band py-20 sm:py-28">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="eyebrow">Contact</p>
          <h2 className="section-heading mt-4">Tell me what you are building</h2>
          <p className="lede mt-5">{profile.availability.status}.</p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ background: 'var(--accent)', opacity: 0.5 }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--accent)' }} />
              </span>
              <p className="mono text-[11px] uppercase tracking-[0.16em] text-accent">
                Open to work
              </p>
            </div>

            <h3 className="mt-8 text-xs uppercase tracking-[0.18em] text-faint">Where I help most</h3>
            <ul className="mt-4 space-y-3">
              {helpWith.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-2 h-1 w-1 shrink-0" style={{ background: 'var(--accent)' }} />
                  {item}
                </li>
              ))}
            </ul>

            <dl className="mt-10 space-y-6 border-t pt-8" style={{ borderColor: 'var(--line)' }}>
              <div className="flex gap-4">
                <EnvelopeIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <dt className="mono text-[10px] uppercase tracking-wider text-faint">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${profile.email}`} className="text-sm text-ink transition-colors hover:text-accent">
                      {profile.email}
                    </a>
                    <p className="mt-1 text-xs text-faint">{profile.availability.responseTime}</p>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <dt className="mono text-[10px] uppercase tracking-wider text-faint">Based in</dt>
                  <dd className="mt-1 text-sm text-ink">
                    {profile.location}
                    <p className="mt-1 text-xs text-faint">
                      {profile.remote} · {profile.timezone}
                    </p>
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 flex gap-3">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost !px-4 !py-2 text-xs"
              >
                GitHub
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost !px-4 !py-2 text-xs"
              >
                LinkedIn
              </a>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            noValidate
            className="border bg-surface p-6 sm:p-8"
            style={{ borderColor: 'var(--line)' }}
          >
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="companyWebsite">Company website</label>
              <input
                type="text"
                id="companyWebsite"
                name="companyWebsite"
                tabIndex={-1}
                autoComplete="off"
                value={formData.companyWebsite}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mono text-[10px] uppercase tracking-wider text-faint">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="name"
                  aria-invalid={Boolean(touched.name && formErrors.name)}
                  aria-describedby={formErrors.name ? 'name-error' : undefined}
                  className="field mt-2"
                  style={fieldBorder('name')}
                />
                {touched.name && formErrors.name && (
                  <p id="name-error" role="alert" className="mt-2 text-xs" style={{ color: 'var(--accent)' }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mono text-[10px] uppercase tracking-wider text-faint">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="email"
                  aria-invalid={Boolean(touched.email && formErrors.email)}
                  aria-describedby={formErrors.email ? 'email-error' : undefined}
                  className="field mt-2"
                  style={fieldBorder('email')}
                />
                {touched.email && formErrors.email && (
                  <p id="email-error" role="alert" className="mt-2 text-xs" style={{ color: 'var(--accent)' }}>
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="company" className="mono text-[10px] uppercase tracking-wider text-faint">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  autoComplete="organization"
                  className="field mt-2"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="mono text-[10px] uppercase tracking-wider text-faint">
                  Reason
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="field mt-2"
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="subject" className="mono text-[10px] uppercase tracking-wider text-faint">
                Subject *
              </label>
              <input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-invalid={Boolean(touched.subject && formErrors.subject)}
                aria-describedby={formErrors.subject ? 'subject-error' : undefined}
                className="field mt-2"
                style={fieldBorder('subject')}
              />
              {touched.subject && formErrors.subject && (
                <p id="subject-error" role="alert" className="mt-2 text-xs" style={{ color: 'var(--accent)' }}>
                  {formErrors.subject}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="mono text-[10px] uppercase tracking-wider text-faint">
                Details *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-invalid={Boolean(touched.message && formErrors.message)}
                aria-describedby={formErrors.message ? 'message-error' : undefined}
                placeholder="What are you building, and where does it currently break?"
                className="field mt-2 resize-y"
                style={fieldBorder('message')}
              />
              <div className="mt-2 flex items-center justify-between">
                {touched.message && formErrors.message ? (
                  <p id="message-error" role="alert" className="text-xs" style={{ color: 'var(--accent)' }}>
                    {formErrors.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="mono text-[10px] text-faint">
                  {formData.message.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full disabled:opacity-60">
              {isSubmitting ? 'Sending…' : 'Send message'}
            </button>

            {isSubmitted && (
              <p
                role="status"
                className="mt-4 flex items-center gap-2 text-sm"
                style={{ color: 'var(--accent)' }}
              >
                <CheckCircleIcon className="h-5 w-5" />
                Message sent. I will reply from {profile.email}.
              </p>
            )}

            {error && (
              <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-muted">
                <ExclamationCircleIcon className="h-5 w-5 shrink-0" style={{ color: 'var(--accent)' }} />
                {error}
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
