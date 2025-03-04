
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export type ReminderType = 'water' | 'eyes' | 'exercise';

export interface Reminder {
  id: string;
  type: ReminderType;
  intervalMinutes: number;
  enabled: boolean;
  lastTriggered: Date | null;
  nextTrigger: Date | null;
  customMessage?: string;
  customExercise?: string;
  repetitions?: number;
}

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: 'water-reminder',
    type: 'water',
    intervalMinutes: 90, // 1.5 hours
    enabled: true,
    lastTriggered: null,
    nextTrigger: null,
    customMessage: 'Time to hydrate'
  },
  {
    id: 'eyes-reminder',
    type: 'eyes',
    intervalMinutes: 20, // 20-20-20 rule
    enabled: true,
    lastTriggered: null,
    nextTrigger: null,
    customMessage: 'Look at something 20 feet away for 20 seconds'
  },
  {
    id: 'exercise-reminder',
    type: 'exercise',
    intervalMinutes: 90, // 1.5 hours
    enabled: true,
    lastTriggered: null,
    nextTrigger: null,
    customExercise: 'Push-ups',
    repetitions: 10
  }
];

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('reminders');
    if (saved) {
      try {
        const parsedReminders = JSON.parse(saved);
        return parsedReminders.map((reminder: any) => ({
          ...reminder,
          lastTriggered: reminder.lastTriggered ? new Date(reminder.lastTriggered) : null,
          nextTrigger: reminder.nextTrigger ? new Date(reminder.nextTrigger) : null
        }));
      } catch (e) {
        console.error('Failed to parse saved reminders', e);
        return DEFAULT_REMINDERS;
      }
    }
    return DEFAULT_REMINDERS;
  });

  // Save reminders to localStorage when they change
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Setup reminder intervals
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      
      setReminders(prev => 
        prev.map(reminder => {
          if (!reminder.enabled) return reminder;
          
          const nextTrigger = reminder.nextTrigger ? new Date(reminder.nextTrigger) : null;
          
          if (!nextTrigger || nextTrigger <= now) {
            // Time to trigger the reminder
            handleReminderTrigger(reminder);
            
            // Calculate next trigger time
            const next = new Date();
            next.setMinutes(next.getMinutes() + reminder.intervalMinutes);
            
            return {
              ...reminder,
              lastTriggered: now,
              nextTrigger: next
            };
          }
          
          return reminder;
        })
      );
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const handleReminderTrigger = (reminder: Reminder) => {
    let title = '';
    let description = '';

    switch (reminder.type) {
      case 'water':
        title = 'Hydration Break';
        description = reminder.customMessage || 'Time to drink some water!';
        break;
      case 'eyes':
        title = 'Eye Rest';
        description = reminder.customMessage || 'Follow the 20-20-20 rule: Look at something 20 feet away for 20 seconds.';
        break;
      case 'exercise':
        title = 'Activity Break';
        description = `Time for ${reminder.repetitions || 10} ${reminder.customExercise || 'push-ups'}!`;
        break;
    }

    // Show toast notification
    toast(title, {
      description,
      duration: 10000,
      action: {
        label: 'Start',
        onClick: () => {
          // Could implement a timer here if needed
          console.log('User started the activity', reminder.type);
        }
      }
    });

    // You would implement actual native notifications here
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: description,
        icon: '/favicon.ico'
      });
    }
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => 
      prev.map(reminder => {
        if (reminder.id === id) {
          const updatedReminder = { ...reminder, ...updates };
          
          // If interval changed, recalculate next trigger
          if (updates.intervalMinutes && updates.intervalMinutes !== reminder.intervalMinutes) {
            const next = new Date();
            next.setMinutes(next.getMinutes() + updatedReminder.intervalMinutes);
            updatedReminder.nextTrigger = next;
          }
          
          return updatedReminder;
        }
        return reminder;
      })
    );
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => {
        if (reminder.id === id) {
          const enabled = !reminder.enabled;
          
          // If enabling, set next trigger time
          let nextTrigger = reminder.nextTrigger;
          if (enabled) {
            const next = new Date();
            next.setMinutes(next.getMinutes() + reminder.intervalMinutes);
            nextTrigger = next;
          }
          
          return {
            ...reminder,
            enabled,
            nextTrigger
          };
        }
        return reminder;
      })
    );
  };

  const resetReminders = () => {
    setReminders(DEFAULT_REMINDERS);
  };

  return {
    reminders,
    updateReminder,
    toggleReminder,
    resetReminders
  };
};
