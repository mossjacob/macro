import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EventNotificationProps {
  event: any;
  onContinue: () => void;
  onClose: () => void;
}

export function EventNotification({ event, onContinue, onClose }: EventNotificationProps) {
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{event.description}</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Pause</Button>
            <Button onClick={onContinue}>Continue</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}