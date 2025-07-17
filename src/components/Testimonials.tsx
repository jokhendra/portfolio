"use client";

import { motion } from 'framer-motion';
import { StarIcon, UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
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
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div 
          key={star}
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {star <= rating ? (
            <StarIcon className="w-5 h-5 text-yellow-400 drop-shadow-sm" />
          ) : (
            <StarOutlineIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          )}
        </motion.div>
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
    <section id="testimonials" className="bg-gradient-to-r from-blue-300 to-purple-300 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
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
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [180, 90, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            What Clients Say
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Don't just take my word for it. Here's what clients have to say about working with me.
          </motion.p>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {[
            { number: "50+", label: "Projects Delivered", color: "from-blue-500 to-cyan-500" },
            { number: "5.0", label: "Average Rating", color: "from-purple-500 to-pink-500" },
            { number: "100%", label: "Client Satisfaction", color: "from-green-500 to-emerald-500" },
            { number: "24hr", label: "Response Time", color: "from-orange-500 to-red-500" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center group"
            >
              <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop: Enhanced Grid Layout */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className="group relative h-100"
              >
                {/* Glass-morphism card */}
                <div className="relative bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-600/50 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
                  
                  <div className="relative z-10">
                    {/* Rating */}
                    <div className="mb-6">
                      <StarRating rating={testimonial.rating} />
                    </div>

                    {/* Quote icon */}
                    <div className="mb-6">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-500/30 dark:text-blue-400/30" />
                    </div>

                    {/* Content */}
                    <p className="text-gray-800 dark:text-gray-200 mb-8 leading-relaxed text-lg">
                      "{testimonial.content}"
                    </p>

                    {/* Client Info */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {testimonial.role}
                        </p>
                        <div className="flex items-center text-sm text-blue-600 dark:text-blue-300 mt-1 font-medium">
                          <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                          {testimonial.company}
                        </div>
                      </div>
                    </div>

                    {/* Project Type */}
                    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200/50 dark:border-blue-700/50">
                        {testimonial.projectType}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Enhanced Carousel Layout */}
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
                      whileHover={{ scale: 1.02 }}
                      className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />
                      
                      <div className="relative z-10">
                        {/* Rating */}
                        <div className="mb-4">
                          <StarRating rating={testimonial.rating} />
                        </div>

                        {/* Quote icon */}
                        <div className="mb-4">
                          <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500/30 dark:text-blue-400/30" />
                        </div>

                        {/* Content */}
                        <p className="text-gray-800 dark:text-gray-200 mb-6 leading-relaxed">
                          "{testimonial.content}"
                        </p>

                        {/* Client Info */}
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                              {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {testimonial.name}
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {testimonial.role}
                            </p>
                            <div className="flex items-center text-xs text-blue-600 dark:text-blue-300 mt-1">
                              <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                              {testimonial.company}
                            </div>
                          </div>
                        </div>

                        {/* Project Type */}
                        <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-200/50 dark:border-blue-700/50">
                            {testimonial.projectType}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Enhanced Carousel Navigation */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex justify-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400 mb-6">
            Ready to Join My Happy Clients?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Let's discuss your project and create something amazing together. 
            I'm committed to delivering exceptional results that exceed your expectations.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            Start Your Project
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 