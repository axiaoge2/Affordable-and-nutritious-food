import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      bg: 'from-green-500 to-emerald-500',
      icon: '✓',
      shadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
    },
    error: {
      bg: 'from-red-500 to-pink-500',
      icon: '✕',
      shadow: '0 10px 40px rgba(239, 68, 68, 0.3)'
    },
    warning: {
      bg: 'from-yellow-500 to-orange-500',
      icon: '⚠',
      shadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
    },
    info: {
      bg: 'from-blue-500 to-cyan-500',
      icon: 'ℹ',
      shadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
    }
  };

  const style = typeStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[10000]
                  px-6 py-4 rounded-2xl bg-gradient-to-r ${style.bg}
                  text-white font-medium shadow-lg
                  flex items-center gap-3 min-w-[300px] max-w-[500px]`}
      style={{ boxShadow: style.shadow }}
    >
      {/* 图标 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center
                   text-xl flex-shrink-0"
      >
        {style.icon}
      </motion.div>

      {/* 消息 */}
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="flex-1"
      >
        {message}
      </motion.p>

      {/* 关闭按钮 */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30
                   flex items-center justify-center transition-colors
                   flex-shrink-0"
      >
        <span className="text-sm">✕</span>
      </motion.button>

      {/* 进度条 */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/40 rounded-b-2xl"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
};

// Toast 容器组件
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: ToastType }>;
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <AnimatePresence mode="popLayout">
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          initial={{ y: -20 * index }}
          animate={{ y: 0 }}
          style={{ position: 'relative', zIndex: 10000 - index }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default Toast;
