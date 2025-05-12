
import { useEffect, useRef } from "react";
import { Shield, Clock, Award, Briefcase, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
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

  const featureItems = [
    {
      icon: Shield,
      title: translate("features.reliability.title"),
      description: translate("features.reliability.description")
    },
    {
      icon: Clock,
      title: translate("features.timeSaving.title"),
      description: translate("features.timeSaving.description")
    },
    {
      icon: Award,
      title: translate("features.professional.title"),
      description: translate("features.professional.description")
    },
    {
      icon: Briefcase,
      title: translate("features.flexibility.title"),
      description: translate("features.flexibility.description")
    },
    {
      icon: Mail,
      title: translate("features.mailPackages.title"),
      description: translate("features.mailPackages.description")
    },
    {
      icon: Phone,
      title: translate("features.reception.title"),
      description: translate("features.reception.description")
    }
  ];

  return (
    <section id="voordelen" className="section-padding" ref={sectionRef}>
      <div className="container-narrow mx-auto container-padding reveal">
        <div className="text-left max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4 rounded-2xl flex items-center justify-start">
            {translate("features.title")}
          </div>
          <h2 className="mb-6">{translate("features.subtitle").split(" van ")[0]} <span className="gradient-text">{translate("features.subtitle").includes(" van ") ? "van een Bedrijfsadres" : "of a Business Address"}</span></h2>
          <p className="text-lg text-slate-600">
            {translate("features.description")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-6 hover-lift transition-all duration-300 card-shadow text-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 blob-shape bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
