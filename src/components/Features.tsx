
import { useEffect, useRef, useState } from "react";
import { Shield, Clock, Award, Briefcase, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { translate } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          entry.target.classList.add("active");
          setIsLoading(false);
          setHasAnimated(true);
          
          // Animate feature cards with staggered delay
          const cards = entry.target.querySelectorAll('.feature-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-fade-in');
            }, index * 150);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

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
      <div className="container mx-auto container-padding reveal">
        <div className="text-left max-w-3xl mx-auto mb-16">
          <h2 className="mb-6 animate-fade-in">
            {translate("features.subtitle").split(" van ")[0]} 
            <span className="gradient-text">
              {translate("features.subtitle").includes(" van ") ? "van een Bedrijfsadres" : "of a Business Address"}
            </span>
          </h2>
          <p className="text-lg text-slate-600 animate-fade-in animation-delay-200">
            {translate("features.description")}
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureItems.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card bg-white rounded-3xl p-8 hover-lift transition-all duration-500 card-shadow text-left opacity-0 hover:shadow-xl hover:shadow-primary/10 group"
              >
                <div className="w-14 h-14 blob-shape bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110">
                  <feature.icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Features;
