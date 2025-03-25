
import { useState, useEffect } from "react";
import { ChevronRight, Building, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-white to-brand-silver"
    >
      {/* Background shapes */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-brand-blue opacity-5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto container-padding z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-medium text-brand-blue mb-6 animate-fade-in">
              Professioneel Bedrijfsadres
            </div>
            <h1 className="font-bold mb-6 leading-tight text-balance">
              Uw <span className="text-brand-blue">Bedrijfsadres</span> op een Toplocatie
            </h1>
            <p className="text-lg md:text-xl text-brand-mediumgray mb-8 max-w-lg text-balance">
              Huur een professioneel bedrijfsadres en maak een uitstekende eerste indruk. Volledig beheer zonder zorgen.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-6 rounded-md group">
                <span>Bekijk Onze Diensten</span>
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/5 rounded-md px-8 py-6">
                Contact Opnemen
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Building, title: "Professioneel adres", desc: "Op toplocatie" },
                { icon: MapPin, title: "Volledig beheer", desc: "Zonder zorgen" },
                { icon: Mail, title: "Post & pakketten", desc: "Veilig ontvangen" },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-4 transition-all duration-700 delay-${(index + 1) * 200}`}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-charcoal text-lg">{item.title}</h3>
                    <p className="text-brand-mediumgray">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="absolute inset-0 -m-2 rounded-xl bg-brand-blue blur-md opacity-10 transform rotate-3"></div>
              <div className="absolute inset-0 -m-6 rounded-xl bg-brand-charcoal blur-md opacity-5 transform -rotate-3"></div>
              <div className="glass-card rounded-xl overflow-hidden relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Modern office space" 
                  className="w-full h-[500px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/50 to-transparent flex flex-col justify-end p-8">
                  <div className="glass-card rounded-lg p-6 max-w-md backdrop-blur-md bg-white/30">
                    <h3 className="text-white font-semibold text-2xl mb-2">Premium Kantoorlocaties</h3>
                    <p className="text-white/90">Indrukwekkende adressen in de beste zakendistricten voor uw bedrijf.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
