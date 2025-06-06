
import React from 'react';
import { cn } from "@/lib/utils";
import LoadingSpinner from "./loading-spinner";

interface EnhancedLoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
  fullScreen?: boolean;
}

const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({ 
  size = "md", 
  className, 
  message = "Laden...",
  fullScreen = false 
}) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center p-4";

  return (
    <div 
      className={cn(containerClasses, className)}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="text-center">
        <LoadingSpinner size={size} />
        <p className="mt-2 text-sm text-gray-600 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default EnhancedLoading;
