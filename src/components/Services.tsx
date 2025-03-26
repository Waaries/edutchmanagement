
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
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
  
  const services = [
    {
      title: "Basis Bedrijfsadres",
      price: "€49",
      period: "per maand",
      description: "Perfect voor startende ondernemers en ZZP'ers",
      features: [
        "Prestigieus zakelijk adres",
        "Post ontvangen en bewaren",
        "Digitale notificatie van ontvangen post",
        "KVK/BTW registratie mogelijk",
        "3 maanden minimale contractduur"
      ],
      mostPopular: false
    },
    {
      title: "Premium Bedrijfsadres",
      price: "€89",
      period: "per maand",
      description: "Ideaal voor groeiende bedrijven met meer behoeften",
      features: [
        "Alles uit het Basis pakket",
        "Wekelijks doorsturen van post",
        "Pakketten ontvangen en tijdelijk opslaan",
        "Telefonische bereikbaarheid via receptie",
        "Gebruik van vergaderruimte (2u/maand)"
      ],
      mostPopular: true
    },
    {
      title: "Zakelijk Compleet",
      price: "€149",
      period: "per maand",
      description: "Complete oplossing voor gevestigde bedrijven",
      features: [
        "Alles uit het Premium pakket",
        "Dagelijks doorsturen van post",
        "Bezoekersregistratie voor gasten",
        "Persoonlijke telefoniste",
        "Gebruik van vergaderruimte (10u/maand)",
        "Gratis koffie voor bezoekers"
      ],
      mostPopular: false
    }
  ];

  return (
    <section id="diensten" className="section-padding angled-bg" ref={sectionRef}>
      <div className="container mx-auto container-padding reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4 rounded-2xl flex items-center justify-center mx-auto">
            Onze Diensten
          </div>
          <h2 className="mb-6">Flexibele <span className="gradient-text">Adresoplossingen</span> Voor Uw Bedrijf</h2>
          <p className="text-lg text-slate-600">
            Kies het pakket dat het beste past bij de behoeften van uw bedrijf.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 border-2 ${
                service.mostPopular 
                  ? 'border-primary shadow-xl shadow-primary/10' 
                  : 'border-slate-200'
              } hover-lift rounded-3xl bg-white`}
            >
              {service.mostPopular && (
                <div className="absolute top-0 right-0 gradient-primary text-white px-4 py-1 text-sm font-medium rounded-bl-2xl rounded-tr-3xl">
                  Meest Gekozen
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold gradient-text">{service.price}</span>
                  <span className="text-slate-500 mb-1">{service.period}</span>
                </div>
                <p className="text-slate-600 mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    service.mostPopular 
                      ? '' 
                      : 'variant-outline'
                  }`}
                  variant={service.mostPopular ? "default" : "outline"}
                >
                  <span>Selecteer Plan</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Heeft u specifieke behoeften die niet in onze standaardpakketten worden gedekt?
          </p>
          <Button variant="outline">
            Vraag Een Aangepast Pakket Aan
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
