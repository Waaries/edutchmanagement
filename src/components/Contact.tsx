
import { useRef, useEffect } from "react";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import MapSection from "@/components/contact/MapSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-muted/20" ref={sectionRef}>
      <div className="container mx-auto px-4 reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in">
            Klaar Om Uw Bedrijfsadres Te Upgraden?
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in animation-delay-200">
            {translate("contact.description") || "Neem contact met ons op voor een persoonlijk advies over uw bedrijfsadres."}
          </p>
        </div>
        
        <div className="space-y-12 max-w-6xl mx-auto">
          {/* Contact Form and Info - Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in animation-delay-400 lg:items-stretch">
            <ContactForm />
            <ContactInfo />
          </div>
          
          {/* Map Section - Full width */}
          <div className="animate-fade-in animation-delay-600">
            <MapSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
