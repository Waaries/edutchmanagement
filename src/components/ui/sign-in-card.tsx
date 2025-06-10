
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedBackground from '../auth/card/AnimatedBackground';
import CardGlowEffect from '../auth/card/CardGlowEffect';
import CardHeader from '../auth/card/CardHeader';
import LoginForm from '../auth/card/LoginForm';
import RegisterForm from '../auth/RegisterForm';

const SignInCard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<string>('login');

  // For 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  // Handle URL parameters to determine active tab
  useEffect(() => {
    const isRegister = searchParams.get('register') === 'true';
    const newTab = isRegister ? 'register' : 'login';
    console.log('URL params changed, setting tab to:', newTab);
    setActiveTab(newTab);
  }, [searchParams]);

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

  const handleTabChange = (value: string) => {
    console.log('Tab change requested:', value);
    setActiveTab(value);
    // Update URL to reflect the current tab
    if (value === 'register') {
      navigate('/auth?register=true', { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }
  };

  const handleRegistrationSuccess = (message: string) => {
    console.log('Registration successful:', message);
    // Switch to login tab and show success message
    setActiveTab('login');
    navigate('/auth', { replace: true });
  };

  console.log('Current active tab:', activeTab);

  return (
    <div className="min-h-screen w-screen bg-white relative overflow-hidden flex items-center justify-center">
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
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-lg overflow-hidden">
              {/* Subtle card inner patterns */}
              <div className="absolute inset-0 opacity-[0.03]" 
                style={{
                  backgroundImage: `linear-gradient(135deg, black 0.5px, transparent 0.5px), linear-gradient(45deg, black 0.5px, transparent 0.5px)`,
                  backgroundSize: '30px 30px'
                }}
              />

              {/* Logo and header */}
              <CardHeader />

              {/* Tabs for Login/Register */}
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50 rounded-xl">
                  <TabsTrigger 
                    value="login" 
                    className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    Inloggen
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    Registreren
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-0 mt-0">
                  <LoginForm />
                </TabsContent>

                <TabsContent value="register" className="space-y-0 mt-0">
                  <RegisterForm onSuccess={handleRegistrationSuccess} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignInCard;
