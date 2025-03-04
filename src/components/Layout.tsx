
import { ReactNode } from 'react';
import Header from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      <Header />
      
      <main className={cn(
        "flex-grow px-4 pt-6 pb-24 max-w-5xl mx-auto w-full animate-fade-in",
        className
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
