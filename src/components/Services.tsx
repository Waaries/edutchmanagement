
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { translate } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          entry.target.classList.add("active");
          setHasAnimated(true);
          
          // Animate service cards with staggered delay
          const cards = entry.target.querySelectorAll('.service-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-fade-in');
            }, index * 200);
          });
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
  }, [hasAnimated]);

  // Cast the features to string[] to ensure TypeScript knows it's an array
  const services = [
    {
      title: translate("services.basic.title"),
      price: translate("services.basic.price"),
      period: translate("services.basic.period"),
      description: translate("services.basic.description"),
      features: translate("services.basic.features") as unknown as string[],
      mostPopular: false,
      planType: "basic"
    },
    {
      title: translate("services.premium.title"),
      price: translate("services.premium.price"),
      period: translate("services.premium.period"),
      description: translate("services.premium.description"),
      features: translate("services.premium.features") as unknown as string[],
      mostPopular: true,
      mostPopularText: translate("services.premium.mostPopular"),
      planType: "premium"
    },
    {
      title: translate("services.complete.title"),
      price: translate("services.complete.price"),
      period: translate("services.complete.period"),
      description: translate("services.complete.description"),
      features: translate("services.complete.features") as unknown as string[],
      mostPopular: false,
      planType: "complete"
    }
  ];

  const handleSelectPlan = (planType: string) => {
    // Navigate to the address request page with the selected plan as a query parameter
    navigate(`/aanvragen?plan=${planType}`);
  };

  return (
    <section id="diensten" className="section-padding angled-bg" ref={sectionRef}>
      <div className="container mx-auto container-padding reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-6 animate-fade-in">
            {translate("services.subtitle").split("Adresoplossingen")[0]}
            <span className="gradient-text">
              {translate("services.subtitle").includes("Adresoplossingen") ? "Adresoplossingen" : "Address Solutions"}
            </span>
            {translate("services.subtitle").includes("For Your Business") ? " For Your Business" : " Voor Uw Bedrijf"}
          </h2>
          <p className="text-lg text-slate-600 animate-fade-in animation-delay-200">
            {translate("services.description")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`service-card relative overflow-hidden transition-all duration-500 border-2 opacity-0 hover-lift group animate-fade-in ${
                service.mostPopular ? 'border-primary shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 scale-105' : 'border-slate-200 hover:border-primary/30 hover:shadow-xl'
              } rounded-3xl bg-white flex flex-col`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {service.mostPopular && (
                <div className="absolute top-0 right-0 gradient-primary text-white px-4 py-1 text-sm font-medium rounded-bl-2xl rounded-tr-3xl animate-pulse">
                  {service.mostPopularText}
                </div>
              )}
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-3xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">{service.price}</span>
                    <span className="text-slate-500 mb-1 group-hover:text-slate-600 transition-colors duration-300">{service.period}</span>
                  </div>
                  <p className="text-slate-600 mb-6 group-hover:text-slate-700 transition-colors duration-300">{service.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start group/item">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 group-hover/item:bg-primary/20 transition-colors duration-300">
                          <Check className="h-3 w-3 text-primary group-hover/item:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="group-hover/item:text-slate-700 transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className={`w-full mt-auto transition-all duration-300 group/btn ${service.mostPopular ? 'hover:scale-105' : 'variant-outline hover:scale-105'}`} 
                  variant={service.mostPopular ? "default" : "outline"}
                  onClick={() => handleSelectPlan(service.planType)}
                >
                  <span>{translate("services.selectPlan")}</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center animate-fade-in animation-delay-800">
          <p className="text-slate-600 mb-4">
            {translate("services.customNeeds")}
          </p>
          <Button variant="outline" className="hover-lift" onClick={() => navigate("/aanvragen")}>
            {translate("services.customBtn")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
