
import { Separator } from '@/components/ui/separator';

interface SocialAuthButtonsProps {
  context: 'login' | 'register';
}

export const SocialAuthButtons = ({ context }: SocialAuthButtonsProps) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          {context === 'login' ? 'Secure login' : 'Secure registration'}
        </span>
      </div>
    </div>
  );
};
