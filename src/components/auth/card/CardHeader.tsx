
import { motion } from 'framer-motion';
import React from 'react';

const CardHeader: React.FC = () => {
  return (
    <div className="text-center space-y-1 mb-5">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="mx-auto w-10 h-10 rounded-full border border-brand-blue/20 flex items-center justify-center relative overflow-hidden bg-brand-blue/10"
      >
        {/* Logo placeholder */}
        <span className="text-lg font-bold text-brand-blue">E</span>
        
        {/* Inner lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-transparent opacity-50" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-brand-darkgrey"
      >
        Welkom Terug
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-brand-mediumgray text-xs"
      >
        Log in om door te gaan naar eDutch
      </motion.p>
    </div>
  );
};

export default CardHeader;
