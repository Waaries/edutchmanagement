
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import React from 'react';

const SignUpLink: React.FC = () => {
  return (
    <motion.p 
      className="text-center text-xs text-white/60 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Nog geen account?{' '}
      <Link 
        to="/auth?register=true" 
        className="relative inline-block group/signup"
      >
        <span className="relative z-10 text-white group-hover/signup:text-white/70 transition-colors duration-300 font-medium">
          Registreer
        </span>
        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/signup:w-full transition-all duration-300" />
      </Link>
    </motion.p>
  );
};

export default SignUpLink;
