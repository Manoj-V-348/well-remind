
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

interface ActivityTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  isActive: boolean;
  activity: string;
}

const ActivityTimer = ({ duration, onComplete, isActive, activity }: ActivityTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }
    
    setAnimationKey(prev => prev + 1);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, duration, onComplete]);
  
  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);
  
  const progress = isActive ? (1 - timeLeft / duration) * 100 : 0;
  
  return (
    <div className={cn(
      "w-full max-w-xs mx-auto text-center transition-opacity duration-500",
      isActive ? "opacity-100" : "opacity-50"
    )}>
      <div className="relative h-56 w-56 mx-auto">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-secondary/50"></div>
        
        {/* Progress circle */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          <circle
            key={animationKey} // Force animation restart
            className={cn(
              "stroke-primary fill-none transition-all duration-150 ease-linear",
              isActive ? "opacity-100" : "opacity-30"
            )}
            cx="50"
            cy="50"
            r="42"
            strokeWidth="5"
            strokeDasharray="264"
            strokeDashoffset={264 * (1 - progress / 100)}
            transform="rotate(-90 50 50)"
            style={{
              transition: isActive ? 'stroke-dashoffset 1s linear' : undefined
            }}
          />
        </svg>
        
        {/* Timer text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold">{timeLeft}</span>
          <span className="text-sm text-muted-foreground mt-1">seconds</span>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-medium text-lg">{activity}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isActive ? 'In progress...' : 'Ready to start'}
        </p>
      </div>
    </div>
  );
};

export default ActivityTimer;
