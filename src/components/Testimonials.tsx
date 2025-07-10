"use client";

import { motion } from 'framer-motion';
import { StarIcon, UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
  projectType: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Product Manager",
    company: "TechFlow Solutions",
    content: "Jokhendra delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and ability to understand complex requirements made the entire project seamless. The final product was launched on time and has significantly improved our sales conversion.",
    rating: 5,
    image: "/api/placeholder/60/60?text=SM",
    projectType: "E-commerce Platform"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CTO",
    company: "DataVision Analytics",
    content: "Working with Jokhendra on our AI-powered analytics dashboard was remarkable. His expertise in both frontend and backend development, combined with machine learning integration, created a solution that our clients absolutely love. Highly professional and skilled.",
    rating: 5,
    image: "/api/placeholder/60/60?text=MC",
    projectType: "AI Dashboard"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Creative Agency Plus",
    content: "Jokhendra transformed our outdated website into a modern, responsive masterpiece. His design sense and technical skills are outstanding. The site now loads faster, looks amazing on all devices, and our client inquiries have increased by 40%.",
    rating: 5,
    image: "/api/placeholder/60/60?text=ER",
    projectType: "Website Redesign"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Founder",
    company: "StartupLaunch",
    content: "As a startup, we needed someone who could wear multiple hats and deliver quality work quickly. Jokhendra developed our entire web application from scratch, including user authentication, payment integration, and admin dashboard. Exceptional work!",
    rating: 5,
    image: "/api/placeholder/60/60?text=DT",
    projectType: "Full-Stack App"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Operations Manager",
    company: "Global Logistics Co",
    content: "The inventory management system Jokhendra built for us has revolutionized our operations. The real-time tracking, automated reporting, and intuitive interface have saved us countless hours. His communication throughout the project was excellent.",
    rating: 5,
    image: "/api/placeholder/60/60?text=LW",
    projectType: "Management System"
  },
  {
    id: 6,
    name: "James Parker",
    role: "Restaurant Owner",
    company: "Parker's Bistro",
    content: "Jokhendra created a comprehensive restaurant management system with online ordering, inventory tracking, and customer management. The system is user-friendly and has streamlined our entire operation. Couldn't be happier with the results!",
    rating: 5,
    image: "/api/placeholder/60/60?text=JP",
    projectType: "Restaurant System"
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star}>
          {star <= rating ? (
            <StarIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          )}
        </div>
      ))}
    </div>
  );
};

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1
    );
  };

  return (
    <section id="testimonials" className="bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            What Clients Say
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Don't just take my word for it. Here's what clients have to say about working with me.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-300">Projects Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">5.0</div>
            <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</div>
            <div className="text-gray-600 dark:text-gray-300">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">24hr</div>
            <div className="text-gray-600 dark:text-gray-300">Response Time</div>
          </div>
        </motion.div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Client Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                    <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                      <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Project Type */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    {testimonial.projectType}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Carousel Layout */}
        <div className="md:hidden">
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: -currentIndex * 100 + '%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex"
              >
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                    >
                      {/* Rating */}
                      <div className="mb-4">
                        <StarRating rating={testimonial.rating} />
                      </div>

                      {/* Content */}
                      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        "{testimonial.content}"
                      </p>

                      {/* Client Info */}
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                          <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                            <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                            {testimonial.company}
                          </div>
                        </div>
                      </div>

                      {/* Project Type */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                          {testimonial.projectType}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-600 dark:bg-blue-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Join My Happy Clients?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create something amazing together. 
            I'm committed to delivering exceptional results that exceed your expectations.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Your Project
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 