import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: string;
  label: string;
  value: number | string;
  gradient: string;
  delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 120, damping: 15 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 overflow-hidden group"
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
      />

      <div className="relative z-10">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
          className="text-4xl mb-3"
        >
          {icon}
        </motion.div>
        <div
          className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}
        >
          {value}
        </div>
        <div className="text-sm text-apple-gray-600 font-medium">
          {label}
        </div>
      </div>
    </motion.div>
  );
};
