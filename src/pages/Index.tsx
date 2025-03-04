
import { useState } from 'react';
import Layout from '@/components/Layout';
import ReminderCard from '@/components/ReminderCard';
import CustomizationPanel from '@/components/CustomizationPanel';
import ActivityTimer from '@/components/ActivityTimer';
import { useReminders, Reminder } from '@/hooks/useReminders';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon, CheckCheckIcon } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { reminders, updateReminder, toggleReminder } = useReminders();
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState<{
    isActive: boolean;
    activity: string;
    duration: number;
    type: string;
  } | null>(null);

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsCustomizationOpen(true);
  };

  const handleCloseCustomization = () => {
    setIsCustomizationOpen(false);
    setEditingReminder(null);
  };

  const handleSaveCustomization = (id: string, updates: Partial<Reminder>) => {
    updateReminder(id, updates);
    toast('Reminder Updated', {
      description: 'Your custom settings have been saved'
    });
  };

  const handleStartActivity = (type: string) => {
    let activity = '';
    let duration = 0;
    
    switch (type) {
      case 'water':
        activity = 'Drink water';
        duration = 5; // Time to drink water
        break;
      case 'eyes':
        activity = 'Look away (20-20-20 rule)';
        duration = 20; // 20 seconds
        break;
      case 'exercise':
        const exerciseReminder = reminders.find(r => r.type === 'exercise');
        activity = `${exerciseReminder?.repetitions || 10} ${exerciseReminder?.customExercise || 'push-ups'}`;
        duration = 30; // Time for exercise
        break;
    }
    
    setActiveTimer({ isActive: true, activity, duration, type });
  };

  const handleCompleteActivity = () => {
    if (activeTimer) {
      toast('Activity Completed', {
        description: `Great job completing: ${activeTimer.activity}`,
      });
      setActiveTimer(null);
    }
  };

  return (
    <Layout>
      <section className="grid gap-8">
        <div className="flex flex-col items-center justify-center text-center space-y-3 mb-6 mt-4">
          <h1 className="text-3xl font-medium">WellRemind</h1>
          <p className="text-muted-foreground max-w-md">
            Customizable reminders for hydration, eye health, and exercise throughout your day.
          </p>
        </div>
        
        {activeTimer && (
          <div className="neo-card p-6 mb-6 animate-fade-in">
            <ActivityTimer 
              duration={activeTimer.duration}
              isActive={activeTimer.isActive}
              activity={activeTimer.activity}
              onComplete={handleCompleteActivity}
            />
            
            <div className="flex justify-center space-x-4 mt-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTimer(prev => prev ? { ...prev, isActive: !prev.isActive } : null)}
                className="rounded-full px-6"
              >
                {activeTimer.isActive ? (
                  <>
                    <PauseIcon className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              
              <Button 
                variant="default"
                size="sm" 
                onClick={handleCompleteActivity}
                className="rounded-full px-6 bg-primary hover:bg-primary/90"
              >
                <CheckCheckIcon className="w-4 h-4 mr-2" />
                Complete
              </Button>
            </div>
          </div>
        )}
        
        {!activeTimer && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex animate-fade-in">
                <ReminderCard
                  reminder={reminder}
                  onToggle={toggleReminder}
                  onEdit={handleEdit}
                />
              </div>
            ))}
          </div>
        )}
        
        {!activeTimer && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              onClick={() => handleStartActivity('water')}
              variant="outline" 
              className="py-6 h-auto neo-card hover:bg-blue-50 border-0"
            >
              Start Hydration Break
            </Button>
            <Button 
              onClick={() => handleStartActivity('eyes')}
              variant="outline" 
              className="py-6 h-auto neo-card hover:bg-violet-50 border-0"
            >
              Start Eye Rest (20s)
            </Button>
            <Button 
              onClick={() => handleStartActivity('exercise')}
              variant="outline" 
              className="py-6 h-auto neo-card hover:bg-green-50 border-0"
            >
              Start Exercise
            </Button>
          </div>
        )}
        
        <CustomizationPanel
          reminder={editingReminder}
          isOpen={isCustomizationOpen}
          onClose={handleCloseCustomization}
          onSave={handleSaveCustomization}
        />
      </section>
    </Layout>
  );
};

export default Index;
