"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { UserIcon, CodeBracketIcon, LightBulbIcon, SparklesIcon, RocketLaunchIcon, HeartIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: UserIcon,
    title: 'User-Centric Design',
    description: 'Creating intuitive interfaces that users love to interact with, ensuring every experience is seamless and delightful.',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'from-blue-500/20 via-cyan-500/20 to-blue-600/20'
  },
  {
    icon: CodeBracketIcon,
    title: 'Clean Architecture',
    description: 'Building robust, scalable systems with clean, maintainable code that stands the test of time.',
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-500/20 via-pink-500/20 to-purple-600/20'
  },
  {
    icon: LightBulbIcon,
    title: 'Innovation First',
    description: 'Leveraging cutting-edge AI and modern technologies to solve complex problems with creative solutions.',
    color: 'from-orange-500 to-red-500',
    gradient: 'from-orange-500/20 via-red-500/20 to-orange-600/20'
  },
  {
    icon: SparklesIcon,
    title: 'Performance Optimized',
    description: 'Delivering lightning-fast applications with optimized performance and smooth user interactions.',
    color: 'from-green-500 to-emerald-500',
    gradient: 'from-green-500/20 via-emerald-500/20 to-green-600/20'
  },
  {
    icon: RocketLaunchIcon,
    title: 'Rapid Development',
    description: 'Turning ideas into reality quickly with efficient development processes and agile methodologies.',
    color: 'from-indigo-500 to-purple-500',
    gradient: 'from-indigo-500/20 via-purple-500/20 to-indigo-600/20'
  },
  {
    icon: HeartIcon,
    title: 'Passion-Driven',
    description: 'Every project is crafted with genuine enthusiasm and dedication to creating meaningful impact.',
    color: 'from-pink-500 to-rose-500',
    gradient: 'from-pink-500/20 via-rose-500/20 to-pink-600/20'
  }
];

export default function About() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <section id="about" className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium mb-6"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            Full Stack & AI Developer
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Me</span>
          </h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            I'm a passionate developer who transforms complex ideas into elegant digital solutions. 
            With expertise in full-stack development and artificial intelligence, I create impactful 
            applications that make a real difference in people's lives.
          </motion.p>
        </motion.div>

        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Animated background gradient */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Glass-morphism card */}
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 overflow-hidden">
                
                {/* Animated border gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`} />
                
                {/* Floating particles effect (client-only to avoid hydration mismatch) */}
                {mounted && (
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/60 rounded-full"
                        animate={{
                          x: [0, Math.random() * 100 - 50],
                          y: [0, Math.random() * 100 - 50],
                          scale: [0, 1, 0],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{
                          duration: Math.random() * 2 + 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Icon container with enhanced effects */}
                <motion.div 
                  className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                  whileHover={{ 
                    rotate: 360,
                    transition: { duration: 0.6 }
                  }}
                >
                  <feature.icon className="w-10 h-10 text-white" />
                </motion.div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>

                {/* Hover overlay effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Bottom Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="relative bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl" />
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
              >
                <RocketLaunchIcon className="w-12 h-12 text-white" />
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Ready to Build Something <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Amazing</span>?
              </h3>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                With a strong foundation in both front-end and back-end development, I specialize in creating 
                scalable web applications and implementing AI solutions. My approach combines technical expertise 
                with creative problem-solving to deliver exceptional results that exceed expectations.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 