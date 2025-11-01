import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { motion } from 'framer-motion';

interface StatsChartProps {
  data: { name: string; value: number }[];
  title: string;
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b'];

export const StatsChart: React.FC<StatsChartProps> = ({ data, title }) => {
  if (data.length === 0 || data.every(d => d.value === 0)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50"
      >
        <h3 className="text-xl font-bold text-gray-700 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>暂无数据</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50"
    >
      <h3 className="text-xl font-bold text-gray-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: PieLabelRenderProps) => {
              const { name, percent } = props;
              if (typeof name === 'string' && typeof percent === 'number') {
                return `${name} ${(percent * 100).toFixed(0)}%`;
              }
              return '';
            }}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
