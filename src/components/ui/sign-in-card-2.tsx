
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import AnimatedBackground from '../auth/card/AnimatedBackground';
import CardGlowEffect from '../auth/card/CardGlowEffect';
import CardHeader from '../auth/card/CardHeader';
import LoginForm from '../auth/card/LoginForm';

const SignInCard = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // For 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="min-h-screen w-screen bg-purple-900 relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">
            {/* Card lighting effects */}
            <CardGlowEffect />
            
            {/* Glass card background */}
            <div className="relative bg-purple-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
              {/* Subtle card inner patterns */}
              <div className="absolute inset-0 opacity-[0.03]" 
                style={{
                  backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                  backgroundSize: '30px 30px'
                }}
              />

              {/* Logo and header */}
              <CardHeader />

              {/* Login form */}
              <LoginForm />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignInCard;
