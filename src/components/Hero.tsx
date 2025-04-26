import { useState, useEffect } from "react";
import { ChevronRight, ArrowRight, Building, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50"
    >
      {/* Background elements */}
      <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-500 opacity-5 blob-shape"></div>
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-slate-500 opacity-5 blob-shape-alt"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-blue-400 opacity-5 blob-shape"></div>
      
      <div className="container-full container-padding z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 space-y-8 mx-auto text-center lg:text-left">
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6 rounded-2xl animate-fade-in mx-auto">
                Professioneel Bedrijfsadres
              </div>
              <h1 className="font-bold mb-6 leading-tight text-balance text-center lg:text-left">
                Geef uw bedrijf een <span className="gradient-text">professionele</span> uitstraling
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl text-balance text-center lg:text-left mx-auto lg:mx-0">
                Huur een professioneel bedrijfsadres op een toplocatie en maak een uitstekende eerste indruk. Volledig beheer zonder zorgen.
              </p>
              <p className="text-md text-slate-600 mb-8 max-w-xl text-balance text-center lg:text-left mx-auto lg:mx-0">
                Geschikt voor KVK-inschrijving, btw-registratie en professionele postafhandeling
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button className="px-8 py-6 group">
                  <span>Ontdek Onze Diensten</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" className="px-8 py-6">
                  Contact Opnemen
                </Button>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center lg:text-left">
              {[
                { icon: Building, title: "Professioneel adres", desc: "Op toplocatie" },
                { icon: MapPin, title: "Volledig beheer", desc: "Zonder zorgen" },
                { icon: Mail, title: "Post & pakketten", desc: "Veilig ontvangen" },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center lg:items-start gap-4 transition-all duration-700 delay-${(index + 1) * 200} hover:bg-primary/5 p-4 rounded-2xl`}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 text-lg">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side image section */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end transition-all duration-1000 delay-500">
            <div className={`stacked-card ${isVisible ? 'opacity-100' : 'opacity-0 translate-x-10'}`}>
              <div className="glass-card rounded-3xl overflow-hidden relative z-10 card-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Modern office space" 
                  className="w-full h-[500px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent flex flex-col justify-end p-8">
                  <div className="glass-card rounded-2xl p-6 max-w-md backdrop-blur-md bg-white/20">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 bg-white/30 rounded-full flex items-center justify-center mr-3">
                      </div>
                      <h3 className="text-white font-semibold text-2xl">Premium Locaties</h3>
                    </div>
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
