"use client";

import { motion } from 'framer-motion';
import { UserIcon, CodeBracketIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: UserIcon,
    title: 'User-Centric Approach',
    description: 'I prioritize creating intuitive and accessible solutions that enhance user experience.'
  },
  {
    icon: CodeBracketIcon,
    title: 'Clean Code',
    description: 'Writing maintainable, efficient, and well-documented code is my top priority.'
  },
  {
    icon: LightBulbIcon,
    title: 'Innovative Solutions',
    description: 'I leverage cutting-edge technologies to solve complex problems creatively.'
  }
];

export default function About() {
  return (
    <section id="about" className="bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            I'm a passionate developer with expertise in full-stack development and artificial intelligence.
            My journey in tech is driven by a desire to create impactful solutions that make a difference.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            With a strong foundation in both front-end and back-end development, I specialize in creating
            scalable web applications and implementing AI solutions. My approach combines technical expertise
            with creative problem-solving to deliver exceptional results.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 