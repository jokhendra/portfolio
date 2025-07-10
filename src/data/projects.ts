import { Project } from '../types/project';

export const projects: Project[] = [
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
      "Implemented custom stop word filtering with support for \"Hinglish\" (Hindi-English mix)",
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
      "Incident response"
    ],
    challenges: [
      "Real-time processing",
      "False positive reduction",
      "System integration",
      "Alert management"
    ],
    solutions: [
      "Implemented ML models",
      "Added verification steps",
      "Used microservices",
      "Created alert hierarchy"
    ]
  }
]; 


export const categories = [
  { id: 'all', name: 'All Projects' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'ai-ml', name: 'AI/ML' },
  { id: 'security', name: 'Security' },
  { id: 'cloud', name: 'Cloud' }
];