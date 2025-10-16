// 悬浮操作按钮组件
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface FloatingAction {
  icon: string;
  label: string;
  onClick: () => void;
  color: string;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
}

export const FloatingActionButton = ({ actions }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                  }
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  scale: 0,
                  transition: { delay: (actions.length - index - 1) * 0.05 }
                }}
                whileHover={{
                  scale: 1.1,
                  x: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-full
                           bg-white/80 backdrop-blur-xl border border-white/30
                           shadow-lg hover:shadow-2xl transition-all`}
              >
                {/* Icon */}
                <motion.span
                  className="text-2xl"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {action.icon}
                </motion.span>

                {/* Label */}
                <span className={`text-sm font-medium whitespace-nowrap ${action.color}`}>
                  {action.label}
                </span>

                {/* Glow Effect */}
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-20 blur-xl`}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full bg-gradient-to-r from-apple-blue to-purple-500
                   text-white shadow-2xl flex items-center justify-center
                   border-4 border-white/30 backdrop-blur-xl overflow-hidden"
      >
        {/* Rotating Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-apple-blue"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10 text-2xl"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
        >
          {isOpen ? '✕' : '✨'}
        </motion.div>

        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-white"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      </motion.button>
    </div>
  );
};
