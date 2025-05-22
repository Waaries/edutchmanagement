
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';

interface SignInButtonProps {
  isLoading: boolean;
  onClick: (event: React.MouseEvent) => void;
}

const SignInButton: React.FC<SignInButtonProps> = ({ isLoading, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isLoading}
      onClick={onClick}
      className="w-full relative group/button mt-5"
    >
      {/* Button glow effect */}
      <div className="absolute inset-0 bg-brand-blue/20 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
      
      <div className="relative overflow-hidden bg-brand-blue text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
        {/* Button background animation */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-brand-blue/0 via-white/30 to-brand-blue/0 -z-10"
          animate={{ 
            x: ['-100%', '100%'],
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatDelay: 1
          }}
          style={{ 
            opacity: isLoading ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center"
            >
              <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.span
              key="button-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-1 text-sm font-medium"
            >
              Inloggen
              <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default SignInButton;
