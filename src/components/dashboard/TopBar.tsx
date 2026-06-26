import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../hooks/useAuth';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { toggleSidebar, notificationCount, clearNotifications } = useDashboard();
  const { user } = useAuth();
  const location = useLocation();

  const name = user?.name || 'User';

  // Get initials for profile avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="h-[60px] bg-[#050816]/80 backdrop-blur-xl border-b border-white/[0.05] sticky top-0 z-40 px-6 lg:px-8 flex items-center justify-between select-none">
      {/* Left: Mobile Hamburger & Page Titles */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={toggleSidebar}
          className="lg:hidden flex items-center justify-center p-1 rounded hover:bg-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          data-interactive="true"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>
        
        <div className="flex items-baseline">
          <h1 className="text-[17px] font-semibold text-white font-satoshi">
            {title}
          </h1>
          {subtitle && (
            <span className="hidden md:inline-block text-[12.5px] text-[#475569] font-satoshi ml-3">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Right: Notifications & User Avatar */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon with Badge */}
        <button
          onClick={clearNotifications}
          className="relative p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center cursor-pointer"
          data-interactive="true"
        >
          <Bell className="w-[18px] h-[18px]" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] rounded-full bg-[#3B82F6] text-white text-[9px] font-bold font-satoshi flex items-center justify-center px-0.5">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-5 bg-white/[0.08]" />

        {/* User Card info */}
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-full bg-accent-blue/20 border border-accent-blue/30 text-accent-blue font-satoshi font-semibold text-xs flex items-center justify-center flex-shrink-0">
            {getInitials(name)}
          </div>
          <span className="hidden md:inline-block text-sm font-medium font-satoshi text-white">
            {name}
          </span>
        </div>
      </div>
    </header>
  );
}
