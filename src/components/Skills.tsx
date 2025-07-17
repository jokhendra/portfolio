"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  CodeBracketIcon,
  ServerIcon,
  CpuChipIcon,
  CloudArrowUpIcon,
  CloudIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const categories = [
  { id: 'frontend', name: 'Frontend', icon: CodeBracketIcon, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'backend', name: 'Backend', icon: ServerIcon, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-500/20 to-pink-500/20' },
  { id: 'frameworks', name: 'Frameworks', icon: CodeBracketIcon, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-500/20 to-cyan-500/20'},
  { id: 'ai-ml', name: 'AI/ML', icon: CpuChipIcon, color: 'from-orange-500 to-red-500', bgColor: 'from-orange-500/20 to-red-500/20' },
  { id: 'devops', name: 'DevOps', icon: CloudArrowUpIcon, color: 'from-green-500 to-emerald-500', bgColor: 'from-green-500/20 to-emerald-500/20' },
  { id: 'cloud', name: 'Cloud', icon: CloudIcon, color: 'from-indigo-500 to-blue-500', bgColor: 'from-indigo-500/20 to-blue-500/20' },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon, color: 'from-yellow-500 to-amber-500', bgColor: 'from-yellow-500/20 to-amber-500/20' },
];

const skills = {
  frontend: [
    { name: 'React', level: 90, icon: '⚛️' },
    { name: 'Next.js', level: 85, icon: '▲' },
    { name: 'TypeScript', level: 80, icon: '📘' },
    { name: 'Tailwind CSS', level: 95, icon: '🎨' },
    { name: 'JavaScript', level: 90, icon: '💛' },
    { name: 'HTML/CSS', level: 95, icon: '🌐' },
  ],
  backend: [
    { name: 'Node.js', level: 85, icon: '🟢' },
    { name: 'Python', level: 80, icon: '🐍' },
    { name: 'Java', level: 75, icon: '☕' },
    { name: 'SQL', level: 85, icon: '🗄️' },
    { name: 'MongoDB', level: 80, icon: '🍃' },
    { name: 'Redis', level: 75, icon: '🔴' },
  ],
  frameworks: [
    { name: 'Express.Js', level: 95, icon: '⚡' },
    { name: 'Laravel', level: 65, icon: '🔥' },
    { name: 'Django', level: 75, icon: '🐍' },
    { name: 'LangChain', level: 60, icon: '🔗' },
    { name: 'MediaSoup', level: 70, icon: '📹' },
    { name: 'Socket.io', level: 75, icon: '🔌' },
  ],
  'ai-ml': [
    { name: 'TensorFlow', level: 75, icon: '🧠' },
    { name: 'PyTorch', level: 70, icon: '🔥' },
    { name: 'Scikit-learn', level: 80, icon: '📊' },
    { name: 'OpenCV', level: 70, icon: '👁️' },
    { name: 'NLP', level: 75, icon: '💬' },
    { name: 'Computer Vision', level: 70, icon: '🖼️' },
  ],
  devops: [
    { name: 'Docker', level: 80, icon: '🐳' },
    { name: 'Kubernetes', level: 75, icon: '☸️' },
    { name: 'Jenkins', level: 70, icon: '🤖' },
    { name: 'Git', level: 90, icon: '📝' },
    { name: 'CI/CD', level: 85, icon: '🔄' },
    { name: 'Terraform', level: 75, icon: '🏗️' },
  ],
  cloud: [
    { name: 'AWS', level: 80, icon: '☁️' },
    { name: 'Azure', level: 75, icon: '🔷' },
    { name: 'GCP', level: 70, icon: '🌐' },
    { name: 'CloudFormation', level: 75, icon: '📋' },
    { name: 'S3', level: 85, icon: '💾' },
    { name: 'EC2', level: 80, icon: '🖥️' },
  ],
  security: [
    { name: 'OAuth', level: 80, icon: '🔐' },
    { name: 'JWT', level: 85, icon: '🎫' },
    { name: 'SSL/TLS', level: 75, icon: '🔒' },
    { name: 'Penetration Testing', level: 70, icon: '🛡️' },
    { name: 'Security Best Practices', level: 85, icon: '✅' },
    { name: 'Data Encryption', level: 80, icon: '🔏' },
  ],
};

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="skills" className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      <FloatingParticles />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <SparklesIcon className="w-12 h-12 text-blue-500 mx-auto" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="w-12 h-12 border-2 border-blue-500/30 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Technical Expertise
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A comprehensive showcase of my technical skills and expertise across multiple domains
          </p>
        </motion.div>

        {/* Enhanced Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 min-w-[160px] backdrop-blur-sm ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-2xl shadow-blue-500/25`
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50'
              }`}
            >
              <motion.div
                animate={activeCategory === category.id ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex items-center justify-center w-8 h-8"
              >
                <category.icon className="w-6 h-6" />
              </motion.div>
              <span className="relative z-10 font-semibold text-lg">{category.name}</span>
              
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.color}`}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {skills[activeCategory as keyof typeof skills].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${categories.find(c => c.id === activeCategory)?.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Floating elements */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className="absolute top-4 right-4 text-4xl opacity-20"
                >
                  {skill.icon}
                </motion.div>
                
                {/* Skill Content */}
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                      {skill.name}
                    </h3>
                    <motion.span 
                      className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {skill.level}%
                    </motion.span>
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="relative mb-4">
                    <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 2, ease: "easeOut", delay: index * 0.1 }}
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${categories.find(c => c.id === activeCategory)?.color} rounded-full relative overflow-hidden`}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          animate={{ x: [-100, 300] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        />
                      </motion.div>
                    </div>
                    
                    {/* Progress indicator dots */}
                    <div className="flex justify-between mt-2">
                      {[0, 25, 50, 75, 100].map((mark) => (
                        <div
                          key={mark}
                          className={`w-2 h-2 rounded-full ${
                            skill.level >= mark 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Skill level description */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.level >= 90 ? 'Expert' : 
                     skill.level >= 80 ? 'Advanced' : 
                     skill.level >= 70 ? 'Intermediate' : 
                     skill.level >= 60 ? 'Beginner' : 'Learning'}
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20">
            <SparklesIcon className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Continuously learning and evolving
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 