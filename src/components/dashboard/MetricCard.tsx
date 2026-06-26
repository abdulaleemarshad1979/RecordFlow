import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'red';
  index?: number;
}

const MetricCardComponent = ({
  label,
  value,
  subtext,
  icon: Icon,
  color = 'blue',
  index = 0
}: MetricCardProps) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/10 text-[#3B82F6]'
    },
    green: {
      bg: 'bg-green-500/10 text-[#22C55E]'
    },
    amber: {
      bg: 'bg-amber-500/10 text-[#F59E0B]'
    },
    red: {
      bg: 'bg-red-500/10 text-[#EF4444]'
    }
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -2, borderColor: 'rgba(255, 255, 255, 0.08)' }}
      className="bg-[#0B1120] border border-white/[0.05] rounded-[14px] p-5 flex flex-col gap-4 transition-all duration-200 shadow-md"
    >
      {/* Top Row: Icon and Label */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 ${selectedColor.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[13px] font-medium text-slate-400 font-satoshi select-none">
          {label}
        </span>
      </div>

      {/* Middle and Bottom */}
      <div className="flex flex-col gap-1">
        <span className="text-[28px] font-bold text-white tracking-tight leading-none font-satoshi">
          {value}
        </span>
        <span className="text-[12px] text-[#475569] font-satoshi">
          {subtext}
        </span>
      </div>
    </motion.div>
  );
};

export default React.memo(MetricCardComponent);
