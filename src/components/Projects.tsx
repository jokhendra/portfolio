"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CodeBracketIcon, 
  ServerIcon, 
  CpuChipIcon, 
  CloudIcon, 
  ShieldCheckIcon,
  CommandLineIcon,
  BeakerIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShoppingCartIcon,
  ChatBubbleLeftRightIcon,
  PresentationChartLineIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  StarIcon,
  FireIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Project } from '../types/project';
import { projects, categories } from '../data/projects';

// Floating particles component
const FloatingParticles = () => {
  const [positions, setPositions] = useState<Array<{ left: string; top: string }>>([]);
  useEffect(() => {
    // Generate stable positions on client after mount to avoid hydration mismatch
    const generated = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setPositions(generated);
  }, []);
  if (positions.length === 0) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
          style={{ left: pos.left, top: pos.top }}
        />
      ))}
    </div>
  );
};

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="projects" className="relative bg-gradient-to-r from-blue-300 to-purple-300 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-700/50 mb-6"
          >
            <SparklesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Featured Work</span>
            <SparklesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            My Creative Portfolio
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Explore a curated collection of innovative projects that showcase my expertise in full-stack development, AI/ML solutions, and cutting-edge technologies.
          </motion.p>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center gap-8 mt-12"
          >
            {[
              { icon: RocketLaunchIcon, value: projects.length, label: "Projects" },
              { icon: StarIcon, value: "100%", label: "Success Rate" },
              { icon: FireIcon, value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 mb-20"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.1, 
                y: -8,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`relative px-8 py-4 rounded-3xl font-bold transition-all duration-500 overflow-hidden group ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-2xl scale-110 ring-4 ring-blue-400/30'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-xl hover:shadow-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/50 dark:hover:border-blue-400/50'
              }`}
            >
              {/* Active category glow effect */}
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-blue-400/30 blur-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Category text */}
              <span className="relative z-10 flex items-center gap-2">
                {category.id === 'ai-ml' && <CpuChipIcon className="w-5 h-5" />}
                {category.id === 'web' && <GlobeAltIcon className="w-5 h-5" />}
                {category.id === 'mobile' && <ShoppingCartIcon className="w-5 h-5" />}
                {category.id === 'backend' && <ServerIcon className="w-5 h-5" />}
                {category.name}
              </span>
              
              {/* Enhanced hover effects */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                y: -20,
                scale: 1.05,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              className="group relative bg-gradient-to-br from-white via-gray-50/90 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-4xl transition-all duration-700 cursor-pointer border border-gray-200/30 dark:border-gray-700/30 hover:border-blue-400/50 dark:hover:border-blue-400/50 backdrop-blur-sm"
              onClick={() => setSelectedProject(project)}
            >
              {/* Enhanced Animated Background Elements */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <motion.div
                  animate={{ 
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl transform -translate-x-8 -translate-y-8"
                />
                <motion.div
                  animate={{ 
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                    scale: [1, 0.8, 1]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-2xl transform translate-x-8 translate-y-8"
                />
              </div>

              {/* Enhanced Project Image */}
              <div className="relative h-72 overflow-hidden">
                {/* Multiple Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-15" />
                
                {/* Project Image with Enhanced Effects */}
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transform group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                />

                {/* Enhanced Floating Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-30">
                  {project.liveUrl && (
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 hover:bg-white dark:hover:bg-gray-700"
                    >
                      <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </motion.a>
                  )}
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 hover:bg-white dark:hover:bg-gray-700"
                    >
                      <CodeBracketIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </motion.a>
                  )}
                </div>

                {/* Enhanced Category Badge */}
                <div className="absolute top-6 left-6 z-30">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/95 to-purple-500/95 backdrop-blur-sm text-white rounded-2xl text-sm font-bold shadow-2xl border border-white/30 group-hover:scale-110 transition-transform duration-300"
                  >
                    {project.category === 'ai-ml' ? 'AI/ML' : project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </motion.div>
                </div>

                {/* Enhanced Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-2000 ease-out" />
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-purple-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>

              {/* Enhanced Content Section */}
              <div className="p-8 relative z-10">
                {/* Enhanced Title with Animated Underline */}
                <div className="mb-6">
                  <motion.h3 
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    {project.title}
                  </motion.h3>
                  <div className="h-1 w-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:w-full transition-all duration-700 ease-out rounded-full" />
                </div>
                
                {/* Enhanced Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {project.description}
                </p>

                {/* Enhanced Technology Tags */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1 + techIndex * 0.1 + 0.4,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50 group-hover:border-blue-400/70 dark:group-hover:border-blue-400/70"
                    >
                      {tech}
                    </motion.span>
                  ))}
                  {project.technologies.length > 3 && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.7,
                        type: "spring",
                        stiffness: 200
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700/60 dark:to-gray-600/60 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-300/50 dark:border-gray-600/50"
                    >
                      +{project.technologies.length - 3}
                    </motion.span>
                  )}
                </div>

                {/* Enhanced Progress Bar */}
                <div className="relative mb-6">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 2, delay: index * 0.1 + 0.8 }}
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </motion.div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 1.2, type: "spring" }}
                    className="absolute -top-1 left-0 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                  />
                </div>

                {/* Enhanced Hover Reveal Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 1.0 }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
                >
                  <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold text-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105">
                    Explore Project
                  </button>
                </motion.div>
              </div>

              {/* Enhanced Corner Decorations */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50, rotateX: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gradient-to-br from-white via-gray-50/95 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto mt-16 shadow-4xl border border-gray-200/50 dark:border-gray-700/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Modal Header */}
              <div className="relative h-96 overflow-hidden">
                {/* Background Image with Enhanced Parallax Effect */}
                <motion.div
                  initial={{ scale: 1.2, rotate: 5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover rounded-t-3xl"
                  />
                </motion.div>
                
                {/* Enhanced Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 rounded-t-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-t-3xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-t-3xl" />
                
                {/* Enhanced Animated Background Elements */}
                <div className="absolute inset-0">
                  <motion.div
                    animate={{ 
                      x: [0, 100, 0],
                      y: [0, -50, 0],
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
                  />
                  <motion.div
                    animate={{ 
                      x: [0, -100, 0],
                      y: [0, 80, 0],
                      scale: [1, 0.7, 1],
                      rotate: [360, 180, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-10 right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"
                  />
                </div>

                {/* Enhanced Modal Header Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-10 z-10">
                  {/* Top Bar */}
                  <div className="flex justify-between items-start">
                    <motion.div
                      initial={{ opacity: 0, x: -30, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500/95 to-purple-500/95 backdrop-blur-sm text-white rounded-2xl text-sm font-bold shadow-2xl border border-white/30"
                    >
                      {selectedProject.category === 'ai-ml' ? 'AI/ML' : selectedProject.category.charAt(0).toUpperCase() + selectedProject.category.slice(1)}
                    </motion.div>
                    
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedProject(null)}
                      className="p-4 bg-white/25 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/30 hover:bg-white/35 dark:hover:bg-gray-700/50"
                    >
                      <XMarkIcon className="w-7 h-7 text-white" />
                    </motion.button>
                  </div>

                  {/* Enhanced Title and Quick Actions */}
                  <div className="space-y-6">
                    <motion.h2
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="text-5xl md:text-6xl font-bold text-white leading-tight"
                    >
                      {selectedProject.title}
                    </motion.h2>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="flex gap-6"
                    >
                      {selectedProject.liveUrl && (
                        <motion.a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="group flex items-center gap-3 px-8 py-4 bg-white/25 backdrop-blur-md text-white rounded-2xl hover:bg-white/35 transition-all duration-300 shadow-2xl hover:shadow-3xl border border-white/30"
                        >
                          <ArrowTopRightOnSquareIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-bold text-lg">Live Demo</span>
                        </motion.a>
                      )}
                      {selectedProject.githubUrl && (
                        <motion.a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="group flex items-center gap-3 px-8 py-4 bg-gray-900/40 backdrop-blur-md text-white rounded-2xl hover:bg-gray-900/60 transition-all duration-300 shadow-2xl hover:shadow-3xl border border-white/20"
                        >
                          <CodeBracketIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-bold text-lg">View Code</span>
                        </motion.a>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Enhanced Modal Content */}
              <div className="p-10 space-y-12">
                {/* Enhanced Project Description */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="text-center"
                >
                  <p className="text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
                    {selectedProject.description}
                  </p>
                </motion.div>

                {/* Enhanced Content Sections */}
                <div className="space-y-16">
                  {/* Enhanced Key Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, type: "spring" }}
                  >
                    <div className="text-center mb-12">
                      <motion.h3 
                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
                        whileHover={{ scale: 1.05 }}
                      >
                        Key Features
                      </motion.h3>
                      <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {selectedProject.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                          whileHover={{ scale: 1.05, x: 10 }}
                          className="group flex items-start gap-6 p-8 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl border border-blue-100/50 dark:border-blue-800/30 hover:shadow-2xl transition-all duration-500 hover:scale-105"
                        >
                          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 group-hover:scale-150 transition-transform duration-300" />
                          <span className="text-gray-700 dark:text-gray-300 font-semibold text-lg">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Enhanced Challenges & Solutions */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, type: "spring" }}
                  >
                    <div className="text-center mb-12">
                      <motion.h3 
                        className="text-4xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-green-500 bg-clip-text text-transparent mb-4"
                        whileHover={{ scale: 1.05 }}
                      >
                        Challenges & Solutions
                      </motion.h3>
                      <div className="w-32 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-green-500 mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Enhanced Challenges */}
                      <div className="space-y-8">
                        <h4 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">!</span>
                          </div>
                          Challenges
                        </h4>
                        <div className="space-y-6">
                          {selectedProject.challenges.map((challenge, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -40 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.0 + index * 0.1, type: "spring" }}
                              whileHover={{ scale: 1.05, x: 15 }}
                              className="group flex gap-6 p-6 bg-gradient-to-br from-red-50/80 to-orange-50/80 dark:from-red-900/30 dark:to-orange-900/30 rounded-3xl border border-red-100/50 dark:border-red-800/30 hover:shadow-2xl transition-all duration-500"
                            >
                              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mt-2 group-hover:scale-150 transition-transform duration-300" />
                              <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{challenge}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Enhanced Solutions */}
                      <div className="space-y-8">
                        <h4 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">✓</span>
                          </div>
                          Solutions
                        </h4>
                        <div className="space-y-6">
                          {selectedProject.solutions.map((solution, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.0 + index * 0.1, type: "spring" }}
                              whileHover={{ scale: 1.05, x: -15 }}
                              className="group flex gap-6 p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl border border-green-100/50 dark:border-green-800/30 hover:shadow-2xl transition-all duration-500"
                            >
                              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2 group-hover:scale-150 transition-transform duration-300" />
                              <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{solution}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Technologies Used */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, type: "spring" }}
                  >
                    <div className="text-center mb-12">
                      <motion.h3 
                        className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                        whileHover={{ scale: 1.05 }}
                      >
                        Technologies Used
                      </motion.h3>
                      <div className="w-32 h-2 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full" />
                    </div>
                    <div className="flex flex-wrap gap-6 justify-center">
                      {selectedProject.technologies.map((tech, index) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 1.2 + index * 0.05, type: "spring" }}
                          whileHover={{ scale: 1.15, y: -10, rotate: 5 }}
                          className="px-8 py-4 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50 cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 