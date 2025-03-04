
import { useState } from 'react';
import { Reminder, ReminderType } from '@/hooks/useReminders';
import { Switch } from '@/components/ui/switch';
import { Clock, Droplet, Eye, Activity, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
}

const ReminderCard = ({ reminder, onToggle, onEdit }: ReminderCardProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const getIcon = (type: ReminderType) => {
    switch (type) {
      case 'water':
        return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'eyes':
        return <Eye className="w-5 h-5 text-violet-500" />;
      case 'exercise':
        return <Activity className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTitle = (type: ReminderType) => {
    switch (type) {
      case 'water':
        return 'Hydration Reminder';
      case 'eyes':
        return 'Eye Rest (20-20-20)';
      case 'exercise':
        return `Exercise: ${reminder.customExercise || 'Push-ups'}`;
      default:
        return 'Reminder';
    }
  };
  
  const getDescription = (reminder: Reminder) => {
    switch (reminder.type) {
      case 'water':
        return reminder.customMessage || 'Time to drink water';
      case 'eyes':
        return reminder.customMessage || 'Look 20 feet away for 20 seconds';
      case 'exercise':
        return `${reminder.repetitions || 10} ${reminder.customExercise || 'push-ups'}`;
      default:
        return '';
    }
  };
  
  const formatInterval = (minutes: number) => {
    if (minutes < 60) return `Every ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    return `Every ${hours}h${min ? ` ${min}m` : ''}`;
  };
  
  const handleStartNow = () => {
    toast(`${getTitle(reminder.type)} Started`, {
      description: getDescription(reminder)
    });
  };

  return (
    <div 
      className={cn(
        "neo-card hover-card p-4 w-full transition-all duration-300",
        reminder.enabled ? "opacity-100" : "opacity-60"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            reminder.type === 'water' ? "bg-blue-50" : "",
            reminder.type === 'eyes' ? "bg-violet-50" : "",
            reminder.type === 'exercise' ? "bg-green-50" : "",
          )}>
            {getIcon(reminder.type)}
          </div>
          <h3 className="font-medium">{getTitle(reminder.type)}</h3>
        </div>
        <Switch 
          checked={reminder.enabled} 
          onCheckedChange={() => onToggle(reminder.id)}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      
      <div className="space-y-1 mb-3">
        <p className="text-sm text-muted-foreground">{getDescription(reminder)}</p>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatInterval(reminder.intervalMinutes)}</span>
        </div>
      </div>
      
      <div className={cn(
        "grid grid-cols-2 gap-2 mt-4 transition-opacity duration-300",
        isHovering ? "opacity-100" : "opacity-0"
      )}>
        <button 
          className="flex items-center justify-center py-1.5 px-3 text-xs font-medium rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-all active:scale-95"
          onClick={handleStartNow}
        >
          Start Now
        </button>
        <button 
          className="flex items-center justify-center py-1.5 px-3 text-xs font-medium rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-all active:scale-95"
          onClick={() => onEdit(reminder)}
        >
          Customize
          <ChevronRight className="ml-1 w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default ReminderCard;
