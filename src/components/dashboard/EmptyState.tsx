import React from 'react';
import { FileSearch, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
}

export default function EmptyState({
  icon: Icon = FileSearch,
  title = "No records found",
  message = "Try adjusting your filters"
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-[#090B14]/40 border border-white/[0.04] rounded-[14px]">
      <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-4 text-[#334155]">
        <Icon className="w-10 h-10" />
      </div>
      <h4 className="text-base font-semibold text-slate-300 font-satoshi mb-1">
        {title}
      </h4>
      <p className="text-sm text-[#475569] font-satoshi">
        {message}
      </p>
    </div>
  );
}
