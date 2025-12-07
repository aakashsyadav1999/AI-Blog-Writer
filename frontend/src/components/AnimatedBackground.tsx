import { motion } from 'motion/react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-0 -left-20 w-96 h-96 bg-gradient-to-br from-emerald-300/40 to-teal-400/40 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-green-300/30 to-emerald-400/30 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-teal-300/35 to-green-400/35 dark:from-teal-500/10 dark:to-emerald-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -80, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles - Light in light mode, subtle in dark mode */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        >
          {/* Light mode - subtle particles */}
          <div 
            className="w-2 h-2 rounded-full bg-emerald-500/40 dark:hidden"
            style={{
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.2)',
              filter: 'blur(0.5px)',
            }}
          />
          
          {/* Dark mode - subtle particles */}
          <div 
            className="hidden dark:block w-2 h-2 rounded-full"
            style={{
              background: 'rgba(16, 185, 129, 0.3)',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
              filter: 'blur(0.5px)',
            }}
          />
        </motion.div>
      ))}

      {/* Organic Shapes */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-64 h-64 opacity-30 dark:opacity-5"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="url(#gradient1)"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.3C64.8,55.4,53.8,67,40.6,73.8C27.4,80.6,13.7,82.6,-0.9,84.3C-15.5,86,-31,87.4,-43.8,80.2C-56.6,73,-66.7,57.2,-74.3,40.7C-81.9,24.2,-87,7,-86.8,-10.4C-86.6,-27.8,-81.1,-45.4,-70.7,-58.5C-60.3,-71.6,-45,-80.2,-29.4,-86.5C-13.8,-92.8,2.1,-96.8,17.4,-94.3C32.7,-91.8,30.6,-83.6,44.7,-76.4Z"
            transform="translate(100 100)"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#14b8a6', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 opacity-25 dark:opacity-5"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="url(#gradient2)"
            d="M39.5,-65.5C51.4,-58.5,61.4,-48.2,68.3,-36.2C75.2,-24.2,79,-10.5,78.8,3.4C78.6,17.3,74.4,31.4,66.3,42.8C58.2,54.2,46.2,62.9,33.1,68.3C20,73.7,5.8,75.8,-8.7,75.3C-23.2,74.8,-38,71.7,-50.3,64.8C-62.6,57.9,-72.4,47.2,-77.8,34.5C-83.2,21.8,-84.2,7.1,-81.5,-6.5C-78.8,-20.1,-72.4,-32.6,-63.5,-43.1C-54.6,-53.6,-43.2,-62.1,-30.8,-68.6C-18.4,-75.1,-5,-79.6,7.3,-79.3C19.6,-79,27.6,-72.5,39.5,-65.5Z"
            transform="translate(100 100)"
          />
          <defs>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#059669', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Wave Lines */}
      <motion.div
        className="absolute inset-0 opacity-15 dark:opacity-5"
        initial={{ backgroundPosition: '0% 0%' }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
        }}
      />
    </div>
  );
}