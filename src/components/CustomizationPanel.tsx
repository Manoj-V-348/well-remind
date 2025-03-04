
import { useState, useEffect } from 'react';
import { Reminder } from '@/hooks/useReminders';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface CustomizationPanelProps {
  reminder: Reminder | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Reminder>) => void;
}

const CustomizationPanel = ({ reminder, isOpen, onClose, onSave }: CustomizationPanelProps) => {
  const [formValues, setFormValues] = useState<Partial<Reminder>>({});
  
  useEffect(() => {
    if (reminder) {
      setFormValues({
        intervalMinutes: reminder.intervalMinutes,
        customMessage: reminder.customMessage || '',
        customExercise: reminder.customExercise || '',
        repetitions: reminder.repetitions || 10
      });
    }
  }, [reminder]);

  const handleInputChange = (field: keyof Reminder, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (reminder) {
      onSave(reminder.id, formValues);
      onClose();
    }
  };

  if (!reminder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between pb-2">
            <DialogTitle className="text-xl font-medium">
              Customize Reminder
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="interval" className="text-sm font-medium">
                Reminder Interval
              </Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="interval"
                  value={[formValues.intervalMinutes || 90]}
                  min={5}
                  max={180}
                  step={5}
                  onValueChange={(value) => handleInputChange('intervalMinutes', value[0])}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16 text-right">
                  {formValues.intervalMinutes ? 
                    formValues.intervalMinutes < 60 ? 
                      `${formValues.intervalMinutes}m` : 
                      `${Math.floor(formValues.intervalMinutes / 60)}h ${formValues.intervalMinutes % 60}m` 
                    : '90m'}
                </span>
              </div>
            </div>
            
            {reminder.type === 'water' && (
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Custom Message
                </Label>
                <Input
                  id="message"
                  value={formValues.customMessage || ''}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)}
                  placeholder="Time to hydrate"
                  className="w-full"
                />
              </div>
            )}
            
            {reminder.type === 'eyes' && (
              <div className="space-y-2">
                <Label htmlFor="eyeMessage" className="text-sm font-medium">
                  Eye Rest Message
                </Label>
                <Input
                  id="eyeMessage"
                  value={formValues.customMessage || ''}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)}
                  placeholder="Look at something 20 feet away for 20 seconds"
                  className="w-full"
                />
              </div>
            )}
            
            {reminder.type === 'exercise' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="exercise" className="text-sm font-medium">
                    Exercise Type
                  </Label>
                  <Input
                    id="exercise"
                    value={formValues.customExercise || ''}
                    onChange={(e) => handleInputChange('customExercise', e.target.value)}
                    placeholder="Push-ups"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="repetitions" className="text-sm font-medium">
                    Repetitions
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="repetitions"
                      value={[formValues.repetitions || 10]}
                      min={1}
                      max={30}
                      step={1}
                      onValueChange={(value) => handleInputChange('repetitions', value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-8 text-right">
                      {formValues.repetitions || 10}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <DialogFooter className="bg-muted/30 px-6 py-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationPanel;
