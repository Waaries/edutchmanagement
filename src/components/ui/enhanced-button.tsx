
import React from 'react';
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  variant = "default",
  size = "default",
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={cn(
        "transition-all duration-200",
        loading && "cursor-not-allowed",
        className
      )}
      aria-busy={loading}
      aria-live="polite"
      {...props}
    >
      {loading && (
        <Loader2 
          className="mr-2 h-4 w-4 animate-spin" 
          aria-hidden="true"
        />
      )}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
};

export default EnhancedButton;
