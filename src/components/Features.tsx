
import { useEffect, useRef, useState } from "react";
import { Shield, Clock, Award, Briefcase, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { translate } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          entry.target.classList.add("active");
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

  // Simplified title with gradient - split subtitle properly
  const subtitle = translate("features.subtitle");
  const titleParts = subtitle.split(" van ");
  const beforeGradient = titleParts[0];
  const gradientText = titleParts.length > 1 ? "van een Bedrijfsadres" : "of a Business Address";

  return (
    <section id="voordelen" className="section-padding bg-background" ref={sectionRef}>
      <div className="container mx-auto container-padding reveal">
        <div className="text-center md:text-left max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
            {beforeGradient}{" "}
            <span className="gradient-text">
              {gradientText}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl animate-fade-in animation-delay-200">
            {translate("features.description")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featureItems.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card bg-card border border-border rounded-3xl p-6 md:p-8 hover-lift transition-all duration-300 card-shadow text-center sm:text-left opacity-0 hover:shadow-xl hover:shadow-primary/10 group animate-fade-in hover:border-primary/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 blob-shape bg-primary/10 flex items-center justify-center mb-6 mx-auto sm:mx-0 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6 md:h-7 md:w-7 text-primary transition-all duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
