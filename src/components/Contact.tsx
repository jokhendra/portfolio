"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  MapPinIcon, 
  PaperAirplaneIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  PhoneIcon,
  CalendarDaysIcon,
  BoltIcon,
  AcademicCapIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  preferredContact: string;
  projectType: string;
  timeline: string;
  budget: string;
  portfolio?: string;
  company?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  portfolio?: string;
  company?: string;
}

const MAX_MESSAGE_LENGTH = 1000;

// Mock testimonials data - replace with real testimonials
const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechVision",
    content: "Jokhendra delivered exceptional work on our web application. Professional, timely, and exceeded our expectations.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "CTO, DataFlow",
    content: "Outstanding developer with great communication skills. Highly recommend for any web development project.",
    rating: 5
  }
];

const projectTypes = [
  "Web Application Development",
  "E-commerce Platform",
  "Portfolio Website",
  "Landing Page",
  "API Development",
  "Mobile App",
  "Other"
];

const timelines = [
  "ASAP (Rush Project)",
  "1-2 weeks",
  "1 month",
  "2-3 months",
  "3+ months",
  "Just exploring"
];

const budgetRanges = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
  "Let's discuss"
];

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    projectType: '',
    timeline: '',
    budget: '',
    portfolio: '',
    company: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate form fields
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : '';
      case 'subject':
        return value.length < 5 ? 'Subject must be at least 5 characters' : '';
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters' : '';
      case 'portfolio':
        if (!value) return '';
        return !/^https?:\/\/.+\..+/.test(value) ? 'Please enter a valid URL (starting with http:// or https://)' : '';
      case 'company':
        if (value && value.length < 2) return 'Company name must be at least 2 characters';
        return '';
      default:
        return '';
    }
  };

  // Validate form on field blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFormErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate all fields before submission
    const errors: FormErrors = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      if (typeof formData[key] === 'string') {
        const error = validateField(key, formData[key]);
        if (error) errors[key as keyof FormErrors] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      // Focus on first error field for accessibility
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      element?.focus();
      return;
    }
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setIsSubmitted(true);
      setFormData({ 
        name: '', 
        email: '', 
        subject: '', 
        message: '', 
        preferredContact: 'email',
        projectType: '',
        timeline: '',
        budget: '',
        portfolio: '',
        company: ''
      });
      setTouched({});
      setFormErrors({});
      
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Prevent message from exceeding max length
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (touched[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  // Character count color
  const getCharacterCountColor = () => {
    const length = formData.message.length;
    if (length > MAX_MESSAGE_LENGTH * 0.9) return 'text-red-500 dark:text-red-400';
    if (length > MAX_MESSAGE_LENGTH * 0.7) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ready to discuss your project? I'm here to help bring your ideas to life with modern, scalable solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Enhanced Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Professional Availability Status */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 dark:text-green-400 font-semibold">Available for New Projects</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <BoltIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Typical response: 2-6 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Project start: Available immediately</span>
                </div>
              </div>
            </div>

            {/* Professional Credentials */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-yellow-500" />
                Professional Highlights
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">Full-Stack Developer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-gray-600 dark:text-gray-300">50+ Projects Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-300">5.0 Client Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <BoltIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-600 dark:text-gray-300">React & Node.js Expert</span>
                </div>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Email
                  </h3>
                  <a 
                    href="mailto:jokhendra.dev@outlook.com"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    jokhendra.dev@outlook.com
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Best for project inquiries and detailed discussions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Phone
                  </h3>
                  <a 
                    href="tel:+917388187060"
                    className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    +91 7388187060
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Available 9:00 AM - 6:00 PM IST for urgent matters
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Location
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Bhopal, Madhya Pradesh, India
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Remote work worldwide • IST timezone
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Connect on Social
              </h3>
              <div className="flex gap-4">
                <motion.a
                  href="https://github.com/jokhendra"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  aria-label="Visit my GitHub profile"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/jokhendra-prajapati-560a841aa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  aria-label="Connect with me on LinkedIn"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-.88-.06-1.601-1-1.601-1 0-1.15.781-1.15 1.601v5.604h-3v-11h3v1.765c.5-.8 1.6-1.1 2.5-1.1 1.9 0 3.5 1.6 3.5 5.606v6.739z"/>
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Client Testimonials */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                What Clients Say
              </h3>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/30"
                  >
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      "{testimonial.content}"
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{testimonial.name}</span>
                      <span className="mx-1">•</span>
                      <span>{testimonial.role}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/30"
            noValidate
            role="form"
            aria-labelledby="contact-form-title"
          >
            <div className="text-center mb-6">
              <h3 id="contact-form-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Start Your Project
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tell me about your project and I'll get back to you within 6 hours
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-invalid={touched.name && formErrors.name ? 'true' : 'false'}
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
                      touched.name && formErrors.name 
                        ? 'border-red-500 dark:border-red-500' 
                        : touched.name && !formErrors.name
                        ? 'border-green-500 dark:border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200`}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                  {touched.name && (formErrors.name ? (
                    <ExclamationCircleIcon className="absolute right-3 top-3.5 h-5 w-5 text-red-500" aria-hidden="true" />
                  ) : (
                    <CheckCircleIcon className="absolute right-3 top-3.5 h-5 w-5 text-green-500" aria-hidden="true" />
                  ))}
                </div>
                {touched.name && formErrors.name && (
                  <p className="mt-2 text-sm text-red-500" id="name-error" role="alert">
                    {formErrors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-invalid={touched.email && formErrors.email ? 'true' : 'false'}
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
                      touched.email && formErrors.email 
                        ? 'border-red-500 dark:border-red-500' 
                        : touched.email && !formErrors.email
                        ? 'border-green-500 dark:border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200`}
                    placeholder="your.email@example.com"
                    autoComplete="email"
                  />
                  {touched.email && (formErrors.email ? (
                    <ExclamationCircleIcon className="absolute right-3 top-3.5 h-5 w-5 text-red-500" aria-hidden="true" />
                  ) : (
                    <CheckCircleIcon className="absolute right-3 top-3.5 h-5 w-5 text-green-500" aria-hidden="true" />
                  ))}
                </div>
                {touched.email && formErrors.email && (
                  <p className="mt-2 text-sm text-red-500" id="email-error" role="alert">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
                      touched.company && formErrors.company 
                        ? 'border-red-500 dark:border-red-500' 
                        : touched.company && !formErrors.company && formData.company
                        ? 'border-green-500 dark:border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200`}
                    placeholder="Your company name"
                    autoComplete="organization"
                  />
                  {touched.company && formData.company && (formErrors.company ? (
                    <ExclamationCircleIcon className="absolute right-3 top-3.5 h-5 w-5 text-red-500" aria-hidden="true" />
                  ) : (
                    <CheckCircleIcon className="absolute right-3 top-3.5 h-5 w-5 text-green-500" aria-hidden="true" />
                  ))}
                </div>
                {touched.company && formErrors.company && (
                  <p className="mt-2 text-sm text-red-500" role="alert">
                    {formErrors.company}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Contact Method
                </label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="video">Video Call</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="">Select type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timeline
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="">Select timeline</option>
                  {timelines.map((timeline) => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="">Select budget</option>
                  {budgetRanges.map((budget) => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Website/Portfolio (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
                    touched.portfolio && formErrors.portfolio 
                      ? 'border-red-500 dark:border-red-500' 
                      : touched.portfolio && !formErrors.portfolio && formData.portfolio
                      ? 'border-green-500 dark:border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200`}
                  placeholder="https://your-current-website.com"
                  autoComplete="url"
                />
                {touched.portfolio && formData.portfolio && (formErrors.portfolio ? (
                  <ExclamationCircleIcon className="absolute right-3 top-3.5 h-5 w-5 text-red-500" aria-hidden="true" />
                ) : (
                  <CheckCircleIcon className="absolute right-3 top-3.5 h-5 w-5 text-green-500" aria-hidden="true" />
                ))}
              </div>
              {touched.portfolio && formErrors.portfolio && (
                <p className="mt-2 text-sm text-red-500" role="alert">
                  {formErrors.portfolio}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  aria-required="true"
                  aria-invalid={touched.subject && formErrors.subject ? 'true' : 'false'}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
                    touched.subject && formErrors.subject 
                      ? 'border-red-500 dark:border-red-500' 
                      : touched.subject && !formErrors.subject
                      ? 'border-green-500 dark:border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200`}
                  placeholder="Brief project summary or inquiry type"
                />
                {touched.subject && (formErrors.subject ? (
                  <ExclamationCircleIcon className="absolute right-3 top-3.5 h-5 w-5 text-red-500" aria-hidden="true" />
                ) : (
                  <CheckCircleIcon className="absolute right-3 top-3.5 h-5 w-5 text-green-500" aria-hidden="true" />
                ))}
              </div>
              {touched.subject && formErrors.subject && (
                <p className="mt-2 text-sm text-red-500" role="alert">
                  {formErrors.subject}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Details *
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  aria-required="true"
                  aria-invalid={touched.message && formErrors.message ? 'true' : 'false'}
                  rows={5}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
                    touched.message && formErrors.message 
                      ? 'border-red-500 dark:border-red-500' 
                      : touched.message && !formErrors.message
                      ? 'border-green-500 dark:border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200 resize-vertical`}
                  placeholder="Tell me about your project goals, requirements, and any specific features you need..."
                />
                {touched.message && (formErrors.message ? (
                  <ExclamationCircleIcon className="absolute right-3 top-3 h-5 w-5 text-red-500" aria-hidden="true" />
                ) : (
                  <CheckCircleIcon className="absolute right-3 top-3 h-5 w-5 text-green-500" aria-hidden="true" />
                ))}
              </div>
              {touched.message && formErrors.message && (
                <p className="mt-2 text-sm text-red-500" role="alert">
                  {formErrors.message}
                </p>
              )}
              <div className={`mt-2 text-sm ${getCharacterCountColor()} text-right`}>
                {formData.message.length}/{MAX_MESSAGE_LENGTH} characters
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg flex items-start gap-3">
              <ShieldCheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium mb-1">Your Privacy is Protected</p>
                <p>
                  Your information is securely processed and never shared with third parties. 
                  By submitting this form, you agree to be contacted about your project.
                </p>
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              aria-describedby="submit-button-description"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  <span>Sending Your Message...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" aria-hidden="true" />
                  <span>Send Project Details</span>
                </>
              )}
            </motion.button>
            <p id="submit-button-description" className="sr-only">
              Submit your project details to start the conversation
            </p>

            {/* Enhanced Success/Error Messages */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 justify-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
                role="alert"
                aria-live="polite"
              >
                <CheckCircleIcon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-medium">Message sent successfully!</p>
                  <p className="text-sm">I'll get back to you within 6 hours with next steps.</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 justify-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800"
                role="alert"
                aria-live="assertive"
              >
                <ExclamationCircleIcon className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-medium">Message failed to send</p>
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
} 