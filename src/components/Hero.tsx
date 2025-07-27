import { useState, useEffect, useRef } from "react";
import { ChevronRight, ArrowRight, Building, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackButtonClick } from "@/lib/analytics";
import ImageLoader from "@/components/ui/image-loader";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguage();

  useEffect(() => {
    setIsVisible(true);

    // Parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      // Track navigation
      trackButtonClick(`scroll_to_${sectionId}`, 'hero_section');
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background" ref={heroRef}>
      {/* Background elements with parallax */}
      <div 
        className="absolute top-0 -right-40 w-96 h-96 bg-blue-500 opacity-5 blob-shape transition-transform duration-1000"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      ></div>
      <div 
        className="absolute top-1/3 -left-20 w-80 h-80 bg-slate-500 opacity-5 blob-shape-alt transition-transform duration-1000"
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      ></div>
      <div 
        className="absolute bottom-20 right-1/4 w-64 h-64 bg-blue-400 opacity-5 blob-shape transition-transform duration-1000"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      ></div>
      
      <div className="container-full container-padding z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 space-y-8 mx-auto text-center lg:text-left">
            <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="font-bold mb-6 leading-tight text-balance text-center lg:text-left animate-fade-in">
                {translate("hero.title").split("professionele")[0]}
                <span className="text-blue-500">professionele</span>
                {translate("hero.title").split("professionele")[1]}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl text-balance text-center lg:text-left mx-auto lg:mx-0 animate-fade-in animation-delay-200">
                {translate("hero.subtitle")}
              </p>
              <p className="text-md text-slate-600 mb-8 max-w-xl text-balance text-center lg:text-left mx-auto lg:mx-0 animate-fade-in animation-delay-400">
                {translate("hero.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in animation-delay-600">
                <Button className="px-8 py-6 group hover-lift" onClick={() => scrollToSection('diensten')}>
                  <span>{translate("hero.discoverBtn")}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" className="px-8 py-6 hover-lift" onClick={() => scrollToSection('contact')}>
                  {translate("hero.contactBtn")}
                </Button>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center lg:text-left">
              {[
                {
                  icon: Building,
                  title: translate("hero.features.address.title"),
                  desc: translate("hero.features.address.desc")
                },
                {
                  icon: MapPin,
                  title: translate("hero.features.management.title"),
                  desc: translate("hero.features.management.desc")
                },
                {
                  icon: Mail,
                  title: translate("hero.features.mail.title"),
                  desc: translate("hero.features.mail.desc")
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center lg:items-start gap-4 transition-all duration-700 hover:bg-primary/5 p-4 rounded-2xl hover-lift animate-fade-in`}
                  style={{ animationDelay: `${(index + 1) * 200 + 800}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 hover:bg-primary/20 transition-colors duration-300">
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
          
          {/* Right side image section with parallax */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end transition-all duration-1000 delay-500">
            <div 
              className={`stacked-card transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
              style={{ transform: `translateY(${scrollY * -0.05}px)` }}
            >
              <div className="glass-card rounded-3xl overflow-hidden relative z-10 card-shadow hover-lift">
                <ImageLoader
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Modern office space"
                  className="w-full h-[500px]"
                  priority={true}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent flex flex-col justify-end p-8">
                  <div className="glass-card rounded-2xl p-6 max-w-md backdrop-blur-md bg-white/20 hover:bg-white/30 transition-colors duration-300">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 bg-white/30 rounded-full flex items-center justify-center mr-3"></div>
                      <h3 className="text-white font-semibold text-2xl">{translate("hero.premium")}</h3>
                    </div>
                    <p className="text-white/90">{translate("hero.premiumDesc")}</p>
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
