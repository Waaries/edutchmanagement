
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
    <section id="contact" className="relative py-24 md:py-32 bg-slate-50 overflow-hidden border-t border-slate-200" ref={sectionRef}>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/[0.04] blur-[140px] pointer-events-none" />
      <div className="relative container mx-auto px-6 reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1] animate-fade-in">
            {translate("contact.subtitle")}
          </h2>
          <p className="text-lg text-slate-600 animate-fade-in animation-delay-200">
            {translate("contact.description")}
          </p>
        </div>

        
        <div className="space-y-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in animation-delay-400 lg:items-stretch">
            <ContactForm />
            <ContactInfo />
          </div>
          <div className="animate-fade-in animation-delay-600">
            <MapSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
