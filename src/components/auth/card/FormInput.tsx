
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
  type?: string;
}

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

interface FormInputProps {
  type: 'email' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  focusedInput: string | null;
  inputName: string;
  onFocus: () => void;
  onBlur: () => void;
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  icon,
  focusedInput,
  inputName,
  onFocus,
  onBlur
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType ? (showPassword ? 'text' : 'password') : type;
  const isFocused = focusedInput === inputName;

  return (
    <motion.div 
      className={`relative ${isFocused ? 'z-10' : ''}`}
      whileFocus={{ scale: 1.02 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      <div className="relative flex items-center overflow-hidden rounded-lg">
        <div className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
          isFocused ? 'text-white' : 'text-white/40'
        }`}>
          {icon}
        </div>
        
        <Input
          type={effectiveType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 ${isPasswordType ? 'pr-10' : 'pr-3'} focus:bg-white/10`}
        />
        
        {isPasswordType && (
          <div 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-3 cursor-pointer"
          >
            {showPassword ? (
              <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
            ) : (
              <EyeOff className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
            )}
          </div>
        )}
        
        {/* Input highlight effect */}
        {isFocused && (
          <motion.div 
            layoutId="input-highlight"
            className="absolute inset-0 bg-white/5 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default FormInput;
