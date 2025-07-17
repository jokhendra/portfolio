"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownIcon, ArrowDownTrayIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadCV = () => {
    // Replace with your actual CV file path
    window.open('https://www.dropbox.com/scl/fi/e710kdfn08r3zf8kzwacl/Jokhendra-Prajapati.pdf?rlkey=6kqrd0rwgw84aw8ssjjbiax8i&st=kb00roru&dl=0', '_blank');
  };
  // Typewriter-style rotating keywords
  const keywords = ['Full Stack Developer', 'AI Developer','Python Developer','JavaScript Developer', 'MongoDB', 'Express.js','Nest.js', 'React', 'Node.js', 'Next.js', 'Tailwind CSS', 'Git', 'GitHub', 'Docker', 'AWS', 'Linux', 'SQL', 'NoSQL'];
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const currentWord = keywords[wordIndex];
    let timer: NodeJS.Timeout;

    if (displayedText === currentWord && !isDeleting) {
      timer = setTimeout(() => setIsDeleting(true), 1000);
    } else if (displayedText === '' && isDeleting) {
      setIsDeleting(false);
      setWordIndex((wordIndex + 1) % keywords.length);
    } else {
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentWord.substring(0, displayedText.length - 1)
          : currentWord.substring(0, displayedText.length + 1);
        setDisplayedText(nextText);
      }, isDeleting ? 100 : 200);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, wordIndex]);

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 dark:from-cyan-500/8 dark:to-blue-500/8 rounded-full blur-2xl"
        />
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Sparkle icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center"
          >
            <SparklesIcon className="w-8 h-8 text-yellow-500 animate-pulse" />
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Jokhendra Prajapati
            </span>
          </motion.h1>
          
          <motion.h2 
            className="text-3xl md:text-4xl text-gray-700 dark:text-gray-300 font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              {displayedText}
              <motion.span
                className="inline-block ml-1"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                |
              </motion.span>
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Transforming ideas into{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">powerful digital solutions</span>{" "}
            through cutting-edge technologies, with a focus on building{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">intuitive and impactful</span>{" "}
            user experiences that drive real-world results.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadCV}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              <ArrowDownTrayIcon className="w-6 h-6" />
              Download CV
            </motion.button>
            <motion.a
              href="#contact"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => smoothScroll(e, 'contact')}
              className="px-10 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white rounded-full font-semibold hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 flex items-center gap-3 border-2 border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Get in Touch
            </motion.a>
          </motion.div>

          {/* Stats or highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.a 
          href="#about" 
          onClick={(e) => smoothScroll(e, 'about')}
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          whileHover={{ scale: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDownIcon className="w-8 h-8" />
          </motion.div>
        </motion.a>
      </motion.div>
    </section>
  );
} 