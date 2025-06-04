
import { useRef, useEffect } from "react";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
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
    <section id="contact" className="section-padding bg-white" ref={sectionRef}>
      <div className="container mx-auto container-padding reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-6 animate-fade-in">
            Klaar Om Uw <span className="text-blue-500">Bedrijfsadres</span> Te Upgraden?
          </h2>
          <p className="text-lg text-slate-600 animate-fade-in animation-delay-200">
            {translate("contact.description")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in animation-delay-400">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  );
};

export default Contact;
