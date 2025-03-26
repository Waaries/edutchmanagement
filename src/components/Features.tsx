
import { useEffect, useRef } from "react";
import { Shield, Clock, Award, Briefcase, Mail, Phone } from "lucide-react";

const Features = () => {
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

  const features = [
    {
      icon: Shield,
      title: "Betrouwbaarheid",
      description: "Uw bedrijfsadres in vertrouwde handen met gegarandeerde privacy en professionele afhandeling."
    },
    {
      icon: Clock,
      title: "Tijdbesparing",
      description: "Geen zorgen over postafhandeling of kantooronderhoud, zodat u zich kunt richten op uw kernactiviteiten."
    },
    {
      icon: Award,
      title: "Professionele Uitstraling",
      description: "Een prestigieus zakelijk adres verbetert uw bedrijfsimago en maakt indruk op potentiële klanten."
    },
    {
      icon: Briefcase,
      title: "Flexibiliteit",
      description: "Werk vanuit waar dan ook terwijl u profiteert van een vaste, professionele zakelijke aanwezigheid."
    },
    {
      icon: Mail,
      title: "Post & Pakketten",
      description: "Al uw zakelijke post en pakketten worden veilig ontvangen en beheerd, met doorstuuropties."
    },
    {
      icon: Phone,
      title: "Receptie Service",
      description: "Optionele telefoondiensten zodat u nooit een belangrijke zakelijke oproep mist."
    }
  ];

  return (
    <section id="voordelen" className="section-padding bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto container-padding reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 mb-4 rounded-full">
            Waarom Kiezen Voor Ons
          </div>
          <h2 className="mb-6">Voordelen van een Virtueel <span className="gradient-text">Bedrijfsadres</span></h2>
          <p className="text-lg text-slate-600">
            Ontdek hoe een professioneel bedrijfsadres uw bedrijf naar een hoger niveau kan tillen.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 hover-lift transition-all duration-300 card-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <feature.icon className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
