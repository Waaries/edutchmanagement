
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <section id="diensten" className="section-padding bg-white" ref={sectionRef}>
      <div className="container mx-auto container-padding reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-medium text-brand-blue mb-4">
            Onze Diensten
          </div>
          <h2 className="mb-6">Flexibele <span className="text-brand-blue">Adresoplossingen</span> Voor Uw Bedrijf</h2>
          <p className="text-lg text-brand-mediumgray">
            Kies het pakket dat het beste past bij de behoeften van uw bedrijf.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl overflow-hidden transition-all duration-300 border ${
                service.mostPopular 
                  ? 'border-brand-blue shadow-lg shadow-brand-blue/10' 
                  : 'border-gray-200'
              } hover-lift`}
            >
              {service.mostPopular && (
                <div className="absolute top-0 right-0 bg-brand-blue text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  Meest Gekozen
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold">{service.price}</span>
                  <span className="text-brand-mediumgray mb-1">{service.period}</span>
                </div>
                <p className="text-brand-mediumgray mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-brand-blue flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    service.mostPopular 
                      ? 'bg-brand-blue hover:bg-brand-blue/90 text-white' 
                      : 'bg-transparent hover:bg-brand-blue/5 text-brand-blue border border-brand-blue'
                  }`}
                >
                  <span>Selecteer Plan</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-brand-mediumgray mb-4">
            Heeft u specifieke behoeften die niet in onze standaardpakketten worden gedekt?
          </p>
          <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/5">
            Vraag Een Aangepast Pakket Aan
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
