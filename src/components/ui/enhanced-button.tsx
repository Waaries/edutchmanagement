
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
        "relative overflow-hidden",
        loading && "cursor-not-allowed opacity-90",
        className
      )}
      aria-busy={loading}
      aria-live="polite"
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 bg-current opacity-10 animate-pulse" />
      )}
      <div className={cn("flex items-center gap-2", loading && "opacity-80")}>
        {loading && (
          <Loader2 
            className="h-4 w-4 animate-spin" 
            aria-hidden="true"
          />
        )}
        <span>{loading && loadingText ? loadingText : children}</span>
      </div>
    </Button>
  );
};

export default EnhancedButton;
