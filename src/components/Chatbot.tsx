"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftIcon, XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Hello! I\'m Jokhendra\'s AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Custom response function
  const getCustomResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Your custom responses here
    if (message.includes('hello') || message.includes('hi')) {
      return "Hi there! I'm Jokhendra's assistant. Nice to meet you! 👋";
    }
    
    if (message.includes('portfolio') || message.includes('work')) {
      return "I'd love to show you my work! Check out my portfolio section to see some of my recent projects. I specialize in full-stack development and AI solutions.";
    }
    
    if (message.includes('experience') || message.includes('years')) {
      return "I have over 5 years of experience in full-stack development and AI. I've worked on 50+ projects and maintain a 100% client satisfaction rate!";
    }
    
    if (message.includes('contact') || message.includes('email')) {
      return "You can reach me through the contact form on this website, or connect with me on LinkedIn. I'm always open to new opportunities!";
    }
    
    if (message.includes('skills') || message.includes('technologies')) {
      return "My tech stack includes React, Next.js, Node.js, Python, AI/ML, and cloud technologies. I'm always learning new technologies!";
    }
    
    if (message.includes('hire') || message.includes('project')) {
      return "I'm currently available for new projects! I offer full-stack development, AI solutions, and consulting services. Let's discuss your project!";
    }
    
    if (message.includes('thank')) {
      return "You're welcome! Feel free to ask me anything about my work or experience. I'm here to help! 😊";
    }
    
    // Default response for unrecognized messages
    return "Thanks for your message! I'll get back to you soon, or you can reach me directly through the contact form. Is there anything specific about my work you'd like to know?";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Get custom response
    const botResponse = getCustomResponse(input);

    // Simulate typing delay
    setTimeout(() => {
      const botMessage: Message = {
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Enhanced Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 group"
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChatBubbleLeftIcon className="w-7 h-7" />
        </motion.div>
        {/* Pulse ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-96 bg-white/10 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 overflow-hidden border border-white/20 dark:border-gray-700/50"
          >
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 flex justify-between items-center relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/10" />
              
              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                </motion.div>
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-yellow-300" />
                  <h3 className="font-bold text-lg">Jokhendra's Assistant</h3>
                </div>
              </div>
              
              <motion.button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 transition-all duration-300 p-2 rounded-full relative z-10 group"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <XMarkIcon className="w-6 h-6 group-hover:text-red-200 transition-colors" />
              </motion.button>
            </div>

            {/* Enhanced Messages */}
            <div className="h-96 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/25'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50 shadow-gray-500/10'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className={`text-xs mt-2 block ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Form */}
            <form onSubmit={handleSubmit} className="p-5 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full p-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 backdrop-blur-sm"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0"
                    animate={{ opacity: input ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 