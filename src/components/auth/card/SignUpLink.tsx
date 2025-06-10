
import { motion } from 'framer-motion';
import React from 'react';

interface SignUpLinkProps {
  onSwitchToRegister?: () => void;
}

const SignUpLink: React.FC<SignUpLinkProps> = ({ onSwitchToRegister }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSwitchToRegister) {
      onSwitchToRegister();
    }
  };

  return (
    <motion.p 
      className="text-center text-xs text-slate-600 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Nog geen account?{' '}
      <button 
        onClick={handleClick}
        className="relative inline-block group/signup"
      >
        <span className="relative z-10 text-brand-blue group-hover/signup:text-brand-blue/70 transition-colors duration-300 font-medium">
          Registreer
        </span>
        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue group-hover/signup:w-full transition-all duration-300" />
      </button>
    </motion.p>
  );
};

export default SignUpLink;
