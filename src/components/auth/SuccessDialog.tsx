
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

const SuccessDialog = ({ open, onOpenChange, message }: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            Registration Successful
          </DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <Button 
          onClick={() => onOpenChange(false)}
          className="w-full bg-[#F97316] hover:bg-[#F97316]/90"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
