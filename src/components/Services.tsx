
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { translate } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          setIsLoading(false);
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

  // Cast the features to string[] to ensure TypeScript knows it's an array
  const services = [
    {
      title: translate("services.basic.title"),
      price: translate("services.basic.price"),
      period: translate("services.basic.period"),
      description: translate("services.basic.description"),
      features: translate("services.basic.features") as unknown as string[],
      mostPopular: false
    },
    {
      title: translate("services.premium.title"),
      price: translate("services.premium.price"),
      period: translate("services.premium.period"),
      description: translate("services.premium.description"),
      features: translate("services.premium.features") as unknown as string[],
      mostPopular: true,
      mostPopularText: translate("services.premium.mostPopular")
    },
    {
      title: translate("services.complete.title"),
      price: translate("services.complete.price"),
      period: translate("services.complete.period"),
      description: translate("services.complete.description"),
      features: translate("services.complete.features") as unknown as string[],
      mostPopular: false
    }
  ];

  return (
    <section id="diensten" className="section-padding angled-bg" ref={sectionRef}>
      <div className="container mx-auto container-padding reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-6">
            {translate("services.subtitle").split("Adresoplossingen")[0]}
            <span className="gradient-text">
              {translate("services.subtitle").includes("Adresoplossingen") ? "Adresoplossingen" : "Address Solutions"}
            </span>
            {translate("services.subtitle").includes("For Your Business") ? " For Your Business" : " Voor Uw Bedrijf"}
          </h2>
          <p className="text-lg text-slate-600">
            {translate("services.description")}
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden transition-all duration-300 border-2 ${
                  service.mostPopular ? 'border-primary shadow-xl shadow-primary/10' : 'border-slate-200'
                } hover-lift rounded-3xl bg-white flex flex-col`}
              >
                {service.mostPopular && (
                  <div className="absolute top-0 right-0 gradient-primary text-white px-4 py-1 text-sm font-medium rounded-bl-2xl rounded-tr-3xl">
                    {service.mostPopularText}
                  </div>
                )}
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-3xl font-bold gradient-text">{service.price}</span>
                      <span className="text-slate-500 mb-1">{service.period}</span>
                    </div>
                    <p className="text-slate-600 mb-6">{service.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className={`w-full mt-auto ${service.mostPopular ? '' : 'variant-outline'}`} 
                    variant={service.mostPopular ? "default" : "outline"}
                  >
                    <span>{translate("services.selectPlan")}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            {translate("services.customNeeds")}
          </p>
          <Button variant="outline">
            {translate("services.customBtn")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
