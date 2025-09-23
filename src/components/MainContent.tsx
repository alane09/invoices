'use client';

import { useSidebar } from '@/contexts/SidebarContext';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainContent({ children, className = '' }: MainContentProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`p-4 transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      } ${className}`}
    >
      {children}
    </div>
  );
}
