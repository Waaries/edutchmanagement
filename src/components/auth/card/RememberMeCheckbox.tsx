
import { motion } from 'framer-motion';
import React from 'react';

interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({ checked, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="appearance-none h-4 w-4 rounded border border-gray-300 bg-white checked:bg-brand-blue checked:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue/30 transition-all duration-200"
        />
        {checked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center text-white pointer-events-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </motion.div>
        )}
      </div>
      <label htmlFor="remember-me" className="text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200">
        Onthoud mij
      </label>
    </div>
  );
};

export default RememberMeCheckbox;
