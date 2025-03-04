
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useReminders } from '@/hooks/useReminders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { InfoIcon, HelpCircleIcon, RefreshCwIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from 'sonner';

const Settings = () => {
  const { reminders, updateReminder, resetReminders } = useReminders();
  const [reminderSettings, setReminderSettings] = useState(reminders);
  
  const handleInputChange = (id: string, field: string, value: any) => {
    setReminderSettings(prev => 
      prev.map(reminder => {
        if (reminder.id === id) {
          return { ...reminder, [field]: value };
        }
        return reminder;
      })
    );
  };
  
  const handleSave = () => {
    reminderSettings.forEach(reminder => {
      updateReminder(reminder.id, reminder);
    });
    
    toast('Settings Saved', {
      description: 'Your reminder preferences have been updated'
    });
  };
  
  const handleReset = () => {
    resetReminders();
    setReminderSettings(reminders);
    
    toast('Settings Reset', {
      description: 'All settings have been restored to defaults'
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-start space-y-2 mb-6">
          <h1 className="text-3xl font-medium">Settings</h1>
          <p className="text-muted-foreground">
            Customize your reminders and preferences
          </p>
        </div>
        
        <div className="neo-card p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Reminders</h2>
          
          <div className="space-y-6">
            {reminderSettings.map((reminder) => (
              <div key={reminder.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">
                      {reminder.type === 'water' && 'Hydration Reminder'}
                      {reminder.type === 'eyes' && 'Eye Rest (20-20-20 Rule)'}
                      {reminder.type === 'exercise' && 'Exercise Reminder'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {reminder.type === 'water' && 'Reminds you to drink water regularly'}
                      {reminder.type === 'eyes' && 'Look 20ft away for 20 seconds every 20 minutes'}
                      {reminder.type === 'exercise' && 'Reminds you to take exercise breaks'}
                    </p>
                  </div>
                  <Switch 
                    checked={reminder.enabled}
                    onCheckedChange={(checked) => handleInputChange(reminder.id, 'enabled', checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${reminder.id}-interval`} className="text-sm">
                        Interval (minutes)
                      </Label>
                      <Input
                        id={`${reminder.id}-interval`}
                        type="number"
                        min="5"
                        max="180"
                        value={reminder.intervalMinutes}
                        onChange={(e) => handleInputChange(
                          reminder.id, 
                          'intervalMinutes', 
                          parseInt(e.target.value) || 90
                        )}
                        className="w-full"
                      />
                    </div>
                    
                    {reminder.type === 'exercise' && (
                      <div className="space-y-2">
                        <Label htmlFor={`${reminder.id}-reps`} className="text-sm">
                          Repetitions
                        </Label>
                        <Input
                          id={`${reminder.id}-reps`}
                          type="number"
                          min="1"
                          max="30"
                          value={reminder.repetitions || 10}
                          onChange={(e) => handleInputChange(
                            reminder.id, 
                            'repetitions', 
                            parseInt(e.target.value) || 10
                          )}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                  
                  {reminder.type === 'water' && (
                    <div className="space-y-2">
                      <Label htmlFor={`${reminder.id}-message`} className="text-sm">
                        Custom Message
                      </Label>
                      <Input
                        id={`${reminder.id}-message`}
                        value={reminder.customMessage || ''}
                        onChange={(e) => handleInputChange(reminder.id, 'customMessage', e.target.value)}
                        placeholder="Time to hydrate"
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  {reminder.type === 'eyes' && (
                    <div className="space-y-2">
                      <Label htmlFor={`${reminder.id}-eye-message`} className="text-sm">
                        Eye Rest Message
                      </Label>
                      <Input
                        id={`${reminder.id}-eye-message`}
                        value={reminder.customMessage || ''}
                        onChange={(e) => handleInputChange(reminder.id, 'customMessage', e.target.value)}
                        placeholder="Look at something 20 feet away for 20 seconds"
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  {reminder.type === 'exercise' && (
                    <div className="space-y-2">
                      <Label htmlFor={`${reminder.id}-exercise`} className="text-sm">
                        Exercise Type
                      </Label>
                      <Input
                        id={`${reminder.id}-exercise`}
                        value={reminder.customExercise || ''}
                        onChange={(e) => handleInputChange(reminder.id, 'customExercise', e.target.value)}
                        placeholder="Push-ups"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                
                <Separator className="my-2" />
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex items-center"
            >
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>
        </div>
        
        <div className="neo-card p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center">
                  <HelpCircleIcon className="w-5 h-5 mr-2 text-primary" />
                  <span>About the 20-20-20 Rule</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    The 20-20-20 rule is a simple guideline to reduce eye strain when using digital screens:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Every 20 minutes</li>
                    <li>Look at something 20 feet away</li>
                    <li>For at least 20 seconds</li>
                  </ul>
                  <p className="mt-2">
                    This helps reduce Computer Vision Syndrome and eye fatigue by giving your eye muscles a break from constant near focus.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-b-0">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center">
                  <InfoIcon className="w-5 h-5 mr-2 text-primary" />
                  <span>App Information</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>App Version:</strong> 1.0.0</p>
                  <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                  <p className="pt-2">
                    WellRemind is designed to help maintain healthy habits throughout your workday, with a focus on hydration, eye health, and regular movement.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
