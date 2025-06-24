
import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import NotificationDebugger from "@/components/debug/NotificationDebugger";
import { useAuth } from "@/contexts/AuthContext";
import { usePageTracking } from "@/hooks/use-monitoring";

const Index = () => {
  const mounted = useRef(false);
  const { isAdmin } = useAuth();
  
  // Track page visits and performance
  usePageTracking('home');

  useEffect(() => {
    // Update the document title
    document.title = "eDutch Management | Professionele Bedrijfsadressen";
    
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const revealTop = element.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if(revealTop < windowHeight - revealPoint) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once on load

    // Handle hash navigation on initial load
    if (window.location.hash && !mounted.current) {
      mounted.current = true;
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);
      if (element) {
        // Add slight delay to ensure all elements are properly rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <Navbar />
      <main className="w-full">
        <Hero />
        <Features />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      {isAdmin && <NotificationDebugger />}
    </div>
  );
};

export default Index;
