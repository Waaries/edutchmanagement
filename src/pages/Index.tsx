
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
import ProductionAnalyticsDebugger from "@/components/ProductionAnalyticsDebugger";
import SectionErrorBoundary from "@/components/ui/section-error-boundary";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useResponsive, useViewportHeight } from "@/hooks/use-responsive";

const Index = () => {
  const mounted = useRef(false);
  const { isAdmin } = useAuth();
  const { announce } = useAccessibility();
  const { isMobile } = useResponsive();
  useViewportHeight(); // Initialize viewport height handling

  useEffect(() => {
    // Update the document title
    document.title = "eDutch Management | Professionele Bedrijfsadressen";
    
    // Announce page load for screen readers
    announce("Welkom bij eDutch Management. Hoofdpagina geladen.");

    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const revealTop = element.getBoundingClientRect().top;
        const revealPoint = isMobile ? 100 : 150; // Adjust for mobile
        
        if(revealTop < windowHeight - revealPoint) {
          element.classList.add('active');
        }
      });
    };

    // Use passive listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger once on load

    // Handle hash navigation on initial load
    if (window.location.hash && !mounted.current) {
      mounted.current = true;
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);
      if (element) {
        // Add slight delay to ensure all elements are properly rendered
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' 
          });
          // Announce navigation for screen readers
          announce(`Genavigeerd naar ${hash} sectie`);
        }, 100);
      }
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [announce, isMobile]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50 rounded-br"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
          announce('Naar hoofdinhoud gesprongen');
        }}
      >
        Ga naar hoofdinhoud
      </a>

      <Navbar />
      
      <main id="main-content" className="w-full" tabIndex={-1}>
        <SectionErrorBoundary sectionName="Hero">
          <Hero />
        </SectionErrorBoundary>
        
        <SectionErrorBoundary sectionName="Features">
          <Features />
        </SectionErrorBoundary>
        
        <SectionErrorBoundary sectionName="Services">
          <Services />
        </SectionErrorBoundary>
        
        <SectionErrorBoundary sectionName="Testimonials">
          <Testimonials />
        </SectionErrorBoundary>
        
        <SectionErrorBoundary sectionName="Contact">
          <Contact />
        </SectionErrorBoundary>
      </main>
      
      <SectionErrorBoundary sectionName="Footer">
        <Footer />
      </SectionErrorBoundary>
      
      <BackToTop />
      {isAdmin && <NotificationDebugger />}
      <ProductionAnalyticsDebugger />
    </div>
  );
};

export default Index;
