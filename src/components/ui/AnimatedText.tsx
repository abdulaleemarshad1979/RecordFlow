import React from 'react';
import { motion } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export default function AnimatedText({
  text,
  className = '',
  delay = 0,
  once = true,
}: AnimatedTextProps) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      filter: 'blur(8px)', 
      y: 12 
    },
    show: { 
      opacity: 1, 
      filter: 'blur(0px)', 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1] 
      } 
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block mr-[0.25em]"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
