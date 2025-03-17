"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const projects = [
  {
    title: "AI-Powered Chat Application",
    description: "A real-time chat application with AI-powered message suggestions and sentiment analysis.",
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    technologies: ["React", "Node.js", "TensorFlow", "Socket.io"],
    liveUrl: "#",
    githubUrl: "#",
    category: "ai"
  },
  {
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with real-time inventory management and payment processing.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    technologies: ["Next.js", "MongoDB", "Stripe", "Redux"],
    liveUrl: "#",
    githubUrl: "#",
    category: "frontend"
  },
  {
    title: "Cloud Infrastructure Dashboard",
    description: "A comprehensive dashboard for monitoring and managing cloud resources across multiple providers.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    technologies: ["AWS", "Docker", "Kubernetes", "Grafana"],
    liveUrl: "#",
    githubUrl: "#",
    category: "devops"
  },
  {
    title: "Machine Learning Model Training Platform",
    description: "A platform for training and deploying machine learning models with automated hyperparameter tuning.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    technologies: ["Python", "PyTorch", "FastAPI", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
    category: "ai"
  },
  {
    title: "Social Media Analytics Dashboard",
    description: "Real-time analytics dashboard for social media metrics with predictive trend analysis.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    technologies: ["React", "D3.js", "Node.js", "MongoDB"],
    liveUrl: "#",
    githubUrl: "#",
    category: "frontend"
  },
  {
    title: "Microservices Architecture",
    description: "A scalable microservices architecture with service discovery and load balancing.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    technologies: ["Spring Boot", "Docker", "Kubernetes", "gRPC"],
    liveUrl: "#",
    githubUrl: "#",
    category: "backend"
  },
  {
    title: "Cybersecurity Monitoring System",
    description: "Real-time security monitoring system with threat detection and automated response.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    technologies: ["Python", "Elasticsearch", "Kibana", "Snort"],
    liveUrl: "#",
    githubUrl: "#",
    category: "security"
  },
  {
    title: "Cloud-Native Application",
    description: "A cloud-native application built with serverless architecture and event-driven design.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    technologies: ["AWS Lambda", "DynamoDB", "SQS", "CloudWatch"],
    liveUrl: "#",
    githubUrl: "#",
    category: "cloud"
  }
];

const categories = [
  { id: 'all', name: 'All Projects', icon: CodeBracketIcon },
  { id: 'frontend', name: 'Frontend', icon: CommandLineIcon },
  { id: 'backend', name: 'Backend', icon: ServerIcon },
  { id: 'ai', name: 'AI/ML', icon: CpuChipIcon },
  { id: 'devops', name: 'DevOps', icon: CloudIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon }
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Explore some of my recent work and personal projects
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <category.icon className="w-5 h-5" />
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/20 dark:border-gray-700/20 flex flex-col"
            >
              {/* Project Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-200 text-sm line-clamp-2">{project.description}</p>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
                  <a
                    href={project.liveUrl}
                    className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <span className="relative">
                      <span className="absolute -inset-1 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        View Demo
                      </span>
                    </span>
                  </a>
                  <a
                    href={project.githubUrl}
                    className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                  >
                    <span className="relative">
                      <span className="absolute -inset-1 bg-gray-100 dark:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                        </svg>
                        Source Code
                      </span>
                    </span>
                  </a>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 