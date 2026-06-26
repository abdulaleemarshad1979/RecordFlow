import React from 'react';

interface StatusBadgeProps {
  status: 'graded' | 'pending' | 'overdue';
}

const StatusBadgeComponent = ({ status }: StatusBadgeProps) => {
  const config = {
    graded: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-[#22C55E]',
      label: 'Graded'
    },
    pending: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-[#F59E0B]',
      label: 'Pending'
    },
    overdue: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-[#EF4444]',
      label: 'Overdue'
    }
  };

  const current = config[status] || config.pending;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[12px] font-medium font-satoshi ${current.bg} ${current.border} ${current.text}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{current.label}</span>
    </div>
  );
};

export default React.memo(StatusBadgeComponent);
