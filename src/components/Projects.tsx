"use client";

import { useState } from 'react';
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
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Project } from '../types/project';
import { projects, categories } from '../data/projects';



export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of my recent work showcasing my skills and expertise
          </p>
        </motion.div>

        {/* Enhanced Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`relative px-8 py-3 rounded-2xl font-semibold transition-all duration-500 overflow-hidden ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-2xl scale-110'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50'
              }`}
            >
              {/* Active category glow effect */}
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 blur-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Category text */}
              <span className="relative z-10">{category.name}</span>
              
              {/* Hover shimmer effect */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative bg-gradient-to-br from-white via-gray-50/80 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-4xl transition-all duration-700 cursor-pointer border border-gray-200/30 dark:border-gray-700/30 hover:border-blue-400/50 dark:hover:border-blue-400/50 backdrop-blur-sm"
              onClick={() => setSelectedProject(project)}
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl transform -translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-1000" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-2xl transform translate-x-8 translate-y-8 group-hover:scale-125 transition-transform duration-1000" />
              </div>

              {/* Project Image with Enhanced Effects */}
              <div className="relative h-64 overflow-hidden">
                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                
                {/* Project Image */}
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700 group-hover:rotate-1"
                />

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-30">
                  {project.liveUrl && (
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </motion.a>
                  )}
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      <CodeBracketIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </motion.a>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-30">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-sm text-white rounded-full text-xs font-bold shadow-lg border border-white/20"
                  >
                    {project.category === 'ai-ml' ? 'AI/ML' : project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </motion.div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1500 ease-out" />
                </div>
              </div>

              {/* Enhanced Content Section */}
              <div className="p-6 relative z-10">
                {/* Title with Animated Underline */}
                <div className="mb-4">
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    {project.title}
                  </motion.h3>
                  <div className="h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500 ease-out" />
                </div>
                
                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {project.description}
                </p>

                {/* Technology Tags with Stagger Animation */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + techIndex * 0.05 + 0.4,
                        type: "spring",
                        stiffness: 200
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium shadow-sm border border-blue-200/50 dark:border-blue-700/50 group-hover:shadow-md group-hover:scale-105 transition-all duration-300"
                    >
                      {tech}
                    </motion.span>
                  ))}
                  {project.technologies.length > 3 && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.55,
                        type: "spring",
                        stiffness: 200
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700/50 dark:to-gray-600/50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium shadow-sm border border-gray-300/50 dark:border-gray-600/50 group-hover:scale-105 transition-all duration-300"
                    >
                      +{project.technologies.length - 3}
                    </motion.span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1.5, delay: index * 0.1 + 0.6 }}
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
                    />
                  </div>
                  <div className="absolute -top-1 left-0 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Hover Reveal Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                >
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-purple-600">
                    View Details
                  </button>
                </motion.div>
              </div>

              {/* Corner Decorations */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-400/5 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gradient-to-br from-white via-gray-50/90 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto mt-16 shadow-4xl border border-gray-200/50 dark:border-gray-700/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
                          {/* Enhanced Modal Header */}
            <div className="relative h-80 overflow-hidden">
              {/* Background Image with Parallax Effect */}
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover rounded-t-3xl"
                />
              </motion.div>
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 rounded-t-3xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-t-3xl" />
              
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <motion.div
                  animate={{ 
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{ 
                    x: [0, -80, 0],
                    y: [0, 60, 0],
                    scale: [1, 0.8, 1]
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"
                />
              </div>

              {/* Modal Header Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                {/* Top Bar */}
                <div className="flex justify-between items-start">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-sm text-white rounded-full text-sm font-bold shadow-lg border border-white/20"
                  >
                    {selectedProject.category === 'ai-ml' ? 'AI/ML' : selectedProject.category.charAt(0).toUpperCase() + selectedProject.category.slice(1)}
                  </motion.div>
                  
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedProject(null)}
                    className="p-3 bg-white/20 dark:bg-gray-800/30 backdrop-blur-md rounded-full shadow-lg hover:bg-white/30 dark:hover:bg-gray-700/40 transition-all duration-300 border border-white/20"
                  >
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                {/* Title and Quick Actions */}
                <div className="space-y-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-5xl font-bold text-white leading-tight"
                  >
                    {selectedProject.title}
                  </motion.h2>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4"
                  >
                    {selectedProject.liveUrl && (
                      <motion.a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                      >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">Live Demo</span>
                      </motion.a>
                    )}
                    {selectedProject.githubUrl && (
                      <motion.a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-2 px-6 py-3 bg-gray-900/30 backdrop-blur-md text-white rounded-xl hover:bg-gray-900/50 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                      >
                        <CodeBracketIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">View Code</span>
                      </motion.a>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

              {/* Enhanced Modal Content */}
              <div className="p-8 space-y-10">
                {/* Project Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                    {selectedProject.description}
                  </p>
                </motion.div>

                {/* Enhanced Content Sections */}
                <div className="space-y-12">
                  {/* Key Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Key Features
                      </h3>
                      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedProject.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="group flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100/50 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1.5 group-hover:scale-125 transition-transform duration-300" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Challenges & Solutions */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-green-500 bg-clip-text text-transparent mb-2">
                        Challenges & Solutions
                      </h3>
                      <div className="w-24 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-green-500 mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Challenges */}
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">!</span>
                          </div>
                          Challenges
                        </h4>
                        <div className="space-y-4">
                          {selectedProject.challenges.map((challenge, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.0 + index * 0.1 }}
                              className="group flex gap-4 p-5 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-100/50 dark:border-red-800/30 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mt-2 group-hover:scale-125 transition-transform duration-300" />
                              <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{challenge}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Solutions */}
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">✓</span>
                          </div>
                          Solutions
                        </h4>
                        <div className="space-y-4">
                          {selectedProject.solutions.map((solution, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.0 + index * 0.1 }}
                              className="group flex gap-4 p-5 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100/50 dark:border-green-800/30 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2 group-hover:scale-125 transition-transform duration-300" />
                              <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{solution}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Technologies Used */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Technologies Used
                      </h3>
                      <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full" />
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {selectedProject.technologies.map((tech, index) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.05 }}
                          whileHover={{ scale: 1.1, y: -5 }}
                          className="px-6 py-3 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-blue-900/30 text-blue-700 dark:text-blue-300 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50 cursor-default"
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