
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SuccessDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  message: string;
  onClose?: () => void;
}

const SuccessDialog = ({ open: externalOpen, onOpenChange, message, onClose }: SuccessDialogProps) => {
  const { translate } = useLanguage();
  const [internalOpen, setInternalOpen] = useState(true);
  
  // Determine if the dialog is controlled externally or internally
  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  
  const handleOpenChange = (value: boolean) => {
    if (!value) {
      if (onClose) {
        onClose();
      }
      
      if (onOpenChange) {
        onOpenChange(false);
      } else {
        setInternalOpen(false);
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            {translate("auth.register.successTitle")}
          </DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <Button 
          onClick={() => handleOpenChange(false)}
          className="w-full bg-[#F97316] hover:bg-[#F97316]/90"
        >
          {translate("auth.register.successButton")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
