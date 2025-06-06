
import React from 'react';
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  fullWidth?: boolean;
  background?: 'default' | 'muted' | 'primary' | 'accent';
}

const backgroundClasses = {
  default: 'bg-background',
  muted: 'bg-muted',
  primary: 'bg-primary/5',
  accent: 'bg-accent',
};

const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  className,
  children,
  as: Component = 'section',
  fullWidth = false,
  background = 'default',
}) => {
  return (
    <Component
      id={id}
      className={cn(
        'section-padding w-full reveal',
        backgroundClasses[background],
        className
      )}
    >
      <div className={cn(
        'mx-auto container-padding', 
        fullWidth ? 'w-full' : 'container'
      )}>
        {children}
      </div>
    </Component>
  );
};

export default SectionContainer;
