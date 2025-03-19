"use client";

import { useState } from 'react';
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
} from '@heroicons/react/24/outline';

const categories = [
  { id: 'frontend', name: 'Frontend', icon: CodeBracketIcon, color: 'from-blue-500 to-cyan-500' },
  { id: 'backend', name: 'Backend', icon: ServerIcon, color: 'from-purple-500 to-pink-500' },
  { id: 'frameworks', name: 'Frameworks', icon: CodeBracketIcon, color: 'from-blue-500 to-cyan-500'},
  { id: 'ai-ml', name: 'AI/ML', icon: CpuChipIcon, color: 'from-orange-500 to-red-500' },
  { id: 'devops', name: 'DevOps', icon: CloudArrowUpIcon, color: 'from-green-500 to-emerald-500' },
  { id: 'cloud', name: 'Cloud', icon: CloudIcon, color: 'from-indigo-500 to-blue-500' },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon, color: 'from-yellow-500 to-amber-500' },
];

const skills = {
  frontend: [
    { name: 'React', level: 90 },
    { name: 'Next.js', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'Tailwind CSS', level: 95 },
    { name: 'JavaScript', level: 90 },
    { name: 'HTML/CSS', level: 95 },
  ],
  backend: [
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'Java', level: 75 },
    { name: 'SQL', level: 85 },
    { name: 'MongoDB', level: 80 },
    { name: 'Redis', level: 75 },
  ],
  frameworks: [
    { name: 'Express.Js', level: 95 },
    { name: 'Laravel', level: 65 },
    { name: 'Django', level: 75 },
    { name: 'LangChain', level: 60 },
    { name: 'MediaSoup', level: 70 },
    { name: 'Socket.io', level: 75 },
  ],
  'ai-ml': [
    { name: 'TensorFlow', level: 75 },
    { name: 'PyTorch', level: 70 },
    { name: 'Scikit-learn', level: 80 },
    { name: 'OpenCV', level: 70 },
    { name: 'NLP', level: 75 },
    { name: 'Computer Vision', level: 70 },
  ],
  devops: [
    { name: 'Docker', level: 80 },
    { name: 'Kubernetes', level: 75 },
    { name: 'Jenkins', level: 70 },
    { name: 'Git', level: 90 },
    { name: 'CI/CD', level: 85 },
    { name: 'Terraform', level: 75 },
  ],
  cloud: [
    { name: 'AWS', level: 80 },
    { name: 'Azure', level: 75 },
    { name: 'GCP', level: 70 },
    { name: 'CloudFormation', level: 75 },
    { name: 'S3', level: 85 },
    { name: 'EC2', level: 80 },
  ],
  security: [
    { name: 'OAuth', level: 80 },
    { name: 'JWT', level: 85 },
    { name: 'SSL/TLS', level: 75 },
    { name: 'Penetration Testing', level: 70 },
    { name: 'Security Best Practices', level: 85 },
    { name: 'Data Encryption', level: 80 },
  ],
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('frontend');

  return (
    <section id="skills" className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Expertise
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and expertise
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group relative flex items-center justify-center gap-3 px-6 py-3 rounded-full transition-all duration-300 min-w-[140px] ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center w-6 h-6">
                <category.icon className="w-5 h-5" />
              </span>
              <span className="relative z-10 font-medium">{category.name}</span>
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${category.color}`}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {skills[activeCategory as keyof typeof skills].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${categories.find(c => c.id === activeCategory)?.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Skill Content */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {skill.level}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${categories.find(c => c.id === activeCategory)?.color} rounded-full`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
} 