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

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  category: string;
  features: string[];
  challenges: string[];
  solutions: string[];
}

const projects: Project[] = [
  {
    "id": 1,
    "title": "Hybrid RAG Chat Application",
    "description": "An advanced chat application leveraging Retrieval-Augmented Generation (RAG) to provide intelligent responses based on website content. Users can input a website link and ask questions related to its content, with real-time AI-driven insights.",
    "image": "https://i.ytimg.com/vi/r2m9DbEmeqI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBxev6gEP3QDs9PujkAKnGrG5C-Eg",
    "technologies": ["Python", "LangChain", "FAISS", "BM25", "Groq API", "FastAPI", "Streamlit"],
    "liveUrl": "https://hybrid-rag-chat.vercel.app",
    "githubUrl": "https://github.com/yourusername/hybrid-rag-chat",
    "category": "AI/ML",
    "features": [
      "Website-based context-aware AI responses",
      "Real-time messaging with WebSocket",
      "Code syntax highlighting",
      "Markdown support",
      "Dark mode",
      "Responsive design"
    ],
    "challenges": [
      "Efficient retrieval and processing of website content",
      "Managing AI response latency for large web pages",
      "Handling diverse website structures",
      "Ensuring data security and privacy"
    ],
    "solutions": [
      "Used FAISS & BM25 for efficient document retrieval",
      "Implemented caching and response optimization",
      "Developed a robust HTML parsing and content extraction pipeline",
      "Applied end-to-end encryption for secure interactions"
    ]
  },

  {
    id: 2,
    title: "Solar Energy Savings and Efficiency Assistant",
    description: "Developed an AI-powered conversational assistant using LangChain, Groq, and Python to help users calculate potential savings, estimate carbon footprint reduction, and find local solar installers. The assistant leverages tools like Tavily Search for real-time data and integrates with a local SQLite database for feedback collection.",
    image: "https://picsum.photos/seed/ecommerce/600/400",
    technologies: ["LangChain", "Groq", "Python", "SQLite", "Tavily Search", "Matplotlib "],
    liveUrl: "https://ecommerce-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/ecommerce",
    category: "AI/ML",
    features: [
      "Savings Calculation",
      "Carbon Footprint Estimation",
      "Local Installer Search",
      "Government Incentives",
      "Real-Time Data",
      "Feedback Collection"
    ],
    challenges: [
      "Handling incomplete or ambiguous user inputs",
      "Fetching and processing real-time data from external APIs",
      "Dynamically selecting and invoking the right tool based on user queries",
      "Generating and visualizing data (e.g., savings charts) efficiently",
      "Collecting and storing user feedback reliably",
      "Managing tool execution errors gracefully",
      "Ensuring scalability and extensibility for future tools"
  ],
  solutions: [
      "Implemented prompt engineering and validation checks to guide users toward providing complete inputs",
      "Integrated Tavily Search API with fallback mechanisms and caching for reliable real-time data",
      "Used LangChain's ToolNode and conditional edges to route queries to the appropriate tool",
      "Leveraged Matplotlib to generate on-the-fly savings charts and optimized performance for dynamic visualizations",
      "Built a lightweight SQLite database to store user feedback with a simple schema",
      "Developed a centralized error-handling mechanism using RunnableLambda and ToolNode.with_fallbacks",
      "Designed a modular architecture with standalone tools and LangGraph for state management"
  ]
  },
  {
    id: 3,
    title: "WhatsApp Chat Analyzer: Data visualization & sentiment analysis.",
    description: "This is a comprehensive WhatsApp chat analysis tool built as a web application that allows users to upload their WhatsApp chat exports and gain insights through various analytical visualizations and metrics.",
    image: "https://picsum.photos/seed/cloud-dash/600/400",
    technologies: ["Python", "Streamlit", "Pandas", "Matplotlib & Seaborn","Natural Language Processing","Topic Modeling","Regular Expressions"],
    liveUrl: "https://cloud-dashboard-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/cloud-dashboard",
    category: "AI/ML",
    features: [
      "Chat Preprocessing : Converts raw WhatsApp chat exports into structured data",
      "User-specific Analysis : Filter analysis by individual users or view overall statistics",
      "Message Statistics : Total messages, word count, media messages, and link sharing analysis",
      "Temporal Analysis : Message frequency by month, day, and time period",
      "Emoji Analysis : Tracks and visualizes emoji usage patterns",
      "Sentiment Analysis : Categorizes messages as positive, negative, or neutral",
      "Response Time Analysis : Measures conversation engagement through response times",
      "Message Length Analysis : Identifies users with the longest/shortest messages",
      "Topic Modeling : Identifies key topics and themes in the chat",
      "Word Cloud Generation : Visualizes the most frequently used words",
      "Interactive Visualizations : Provides interactive charts and graphs for better insights"
    ],
    challenges: [
      "Processing diverse WhatsApp chat formats and handling different date formats",
      "Filtering out irrelevant content like system notifications and media placeholders",
      "Handling multilingual conversations with mixed languages",
      "Visualizing temporal trends in an intuitive way",
      "Accurate sentiment analysis of informal chat messages",
      "Extracting meaningful topics from casual conversations",
      "Creating an intuitive user interface for non-technical users"
    ],
    solutions: [
      "Implemented robust regex patterns for message extraction and standardized date parsing",
      "Created specific filters to identify and handle non-message content",
      `Implemented custom stop word filtering with support for "Hinglish" (Hindi-English mix)`,
      "Developed interactive time-based visualizations with adjustable granularity (daily/weekly/monthly)",
      "Implemented a specialized sentiment analyzer tuned for conversational text",
      "Applied LDA topic modeling with customizable topic numbers and visualization",
      "Designed a streamlined Streamlit interface with clear sections and interactive filters"
    ]
  },
  {
    id: 4,
    title: "Machine Learning Platform",
    description: "An interactive platform for training and deploying machine learning models with visualization tools.",
    image: "https://picsum.photos/seed/ml-platform/600/400",
    technologies: ["Python", "TensorFlow", "React", "D3.js"],
    liveUrl: "https://ml-platform-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/ml-platform",
    category: "ai-ml",
    features: [
      "Model training interface",
      "Data visualization",
      "Model deployment",
      "Performance metrics",
      "API integration"
    ],
    challenges: [
      "Managing computational resources",
      "Optimizing training performance",
      "Handling large datasets",
      "Ensuring reproducibility"
    ],
    solutions: [
      "Implemented resource scheduling",
      "Used distributed training",
      "Optimized data pipeline",
      "Added experiment tracking"
    ]
  },
  {
    id: 5,
    title: "Analytics Dashboard",
    description: "A powerful analytics dashboard with interactive charts and real-time data updates.",
    image: "https://picsum.photos/seed/analytics/600/400",
    technologies: ["Next.js", "D3.js", "Firebase", "Tailwind CSS"],
    liveUrl: "https://analytics-dashboard-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/analytics-dashboard",
    category: "frontend",
    features: [
      "Interactive charts",
      "Real-time updates",
      "Custom reports",
      "Data export",
      "User management"
    ],
    challenges: [
      "Processing real-time data",
      "Visualizing complex metrics",
      "Integrating multiple APIs",
      "Ensuring data accuracy"
    ],
    solutions: [
      "Used WebSocket for live updates",
      "Implemented D3.js for visualization",
      "Created unified API layer",
      "Added data validation"
    ]
  },
  {
    id: 6,
    title: "Microservices Architecture",
    description: "A scalable microservices architecture with containerization and service discovery.",
    image: "https://picsum.photos/seed/microservices/600/400",
    technologies: ["Docker", "Kubernetes", "Node.js", "MongoDB"],
    liveUrl: "https://microservices-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/microservices",
    category: "backend",
    features: [
      "Service discovery",
      "Load balancing",
      "Container orchestration",
      "Health monitoring",
      "Logging system"
    ],
    challenges: [
      "Service communication",
      "Data consistency",
      "Deployment complexity",
      "Monitoring and debugging"
    ],
    solutions: [
      "Used gRPC for communication",
      "Implemented event sourcing",
      "Adopted GitOps practices",
      "Added observability tools"
    ]
  },
  {
    id: 7,
    title: "Security System",
    description: "A comprehensive security system with real-time threat detection and monitoring.",
    image: "https://picsum.photos/seed/security/600/400",
    technologies: ["Python", "TensorFlow", "React", "WebSocket"],
    liveUrl: "https://security-system-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/security-system",
    category: "security",
    features: [
      "Threat detection",
      "Real-time monitoring",
      "Alert system",
      "Incident response",
      "Security reports"
    ],
    challenges: [
      "Processing security events",
      "Reducing false positives",
      "Ensuring system security",
      "Managing alerts"
    ],
    solutions: [
      "Used ML for threat detection",
      "Implemented alert correlation",
      "Added security controls",
      "Created alert prioritization"
    ]
  },
  {
    id: 8,
    title: "Cloud Native Application",
    description: "A modern cloud-native application built with microservices and serverless architecture.",
    image: "https://picsum.photos/seed/cloud-native/600/400",
    technologies: ["AWS Lambda", "React", "DynamoDB", "API Gateway"],
    liveUrl: "https://cloud-native-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/cloud-native",
    category: "cloud",
    features: [
      "Serverless functions",
      "API integration",
      "Data persistence",
      "Scalability",
      "Monitoring"
    ],
    challenges: [
      "Cold start latency",
      "State management",
      "Cost control",
      "Monitoring"
    ],
    solutions: [
      "Used provisioned concurrency",
      "Implemented distributed caching",
      "Added cost monitoring",
      "Created comprehensive logging"
    ]
  }
];

const categories = [
  { id: 'all', name: 'All Projects' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'ai-ml', name: 'AI/ML' },
  { id: 'security', name: 'Security' },
  { id: 'cloud', name: 'Cloud' }
];

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
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100/50 dark:border-gray-700/50 hover:border-blue-500/30 dark:hover:border-blue-400/30 hover:-translate-y-1"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-8 relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-blue-600 dark:group-hover:from-blue-400 dark:group-hover:via-purple-400 dark:group-hover:to-blue-400 transition-all duration-300">
                    {project.title}
                  </h3>
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium whitespace-nowrap shadow-sm">
                    {project.category === 'ai-ml' ? 'AI/ML' : project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 text-lg leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium shadow-sm backdrop-blur-sm border border-blue-100/50 dark:border-blue-800/50"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-4 py-2 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/30 dark:to-gray-800/30 text-gray-600 dark:text-gray-300 rounded-xl text-sm shadow-sm backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mt-16 shadow-2xl border border-gray-100/50 dark:border-gray-700/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-72">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover rounded-t-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-3xl" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="p-8">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {selectedProject.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="flex gap-4 mb-8">
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="relative font-medium">Live Demo</span>
                  </a>
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden border border-gray-200/50 dark:border-gray-600/50"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-gray-200/0 via-white/20 to-gray-200/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                    <CodeBracketIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="relative font-medium">View Code</span>
                  </a>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Key Features
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProject.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Challenges & Solutions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-xl font-medium text-gray-900 dark:text-white">
                          Challenges
                        </h4>
                        <ul className="space-y-3">
                          {selectedProject.challenges.map((challenge, index) => (
                            <li key={index} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                              <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xl font-medium text-gray-900 dark:text-white">
                          Solutions
                        </h4>
                        <ul className="space-y-3">
                          {selectedProject.solutions.map((solution, index) => (
                            <li key={index} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                              <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                              <span className="text-gray-700 dark:text-gray-300">{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 