
import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
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
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      clearInterval(interval);
    };
  }, []);

  const handlePrev = () => {
    setActiveTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveTestimonial((prev) => 
      (prev + 1) % testimonials.length
    );
  };
  
  const testimonials = [
    {
      quote: "Het huren van een bedrijfsadres via deze dienst heeft onze professionele uitstraling aanzienlijk verbeterd. Onze klanten zijn onder de indruk van ons prestigieuze adres, terwijl wij flexibel blijven werken.",
      author: "Sophie van den Berg",
      company: "Directeur, InnovateTech BV"
    },
    {
      quote: "Als startende ondernemer was dit precies wat ik nodig had. Een betaalbaar professioneel adres zonder de kosten van een fysiek kantoor. De postafhandeling is uiterst efficiënt en betrouwbaar.",
      author: "Thomas Bakker",
      company: "Oprichter, WebSolutions"
    },
    {
      quote: "De klantenservice is uitzonderlijk. Ze gaan verder dan verwacht om onze specifieke behoeften te vervullen. Het Premium pakket biedt alles wat we nodig hebben voor ons groeiende team.",
      author: "Emma Visser",
      company: "Marketing Manager, GrowBiz"
    }
  ];

  return (
    <section id="getuigenissen" className="section-padding bg-slate-50 text-slate-800 overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto container-padding reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="h-4 w-4 mr-2" />
            Ervaringen
          </div>
          <h2 className="mb-6">Wat Onze <span className="text-primary">Klanten</span> Zeggen</h2>
          <p className="text-lg text-muted-foreground">
            Ontdek waarom ondernemers kiezen voor onze bedrijfsadresservice.
          </p>
        </div>
        
        <div className="relative min-h-[300px] flex items-center justify-center">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`absolute w-full max-w-4xl transition-all duration-700 ease-in-out ${
                index === activeTestimonial
                  ? 'opacity-100 translate-x-0 z-10'
                  : index < activeTestimonial
                    ? 'opacity-0 -translate-x-full z-0'
                    : 'opacity-0 translate-x-full z-0'
              }`}
            >
              <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 card-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  
                  <p className="text-xl md:text-2xl mb-8 text-slate-700 text-balance">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="text-center">
                    <p className="font-semibold text-slate-800">{testimonial.author}</p>
                    <p className="text-slate-600 text-sm">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8 gap-4">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors duration-300"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-3 h-3 rounded-full mx-1 transition-all ${
                index === activeTestimonial ? 'bg-primary' : 'bg-slate-300'
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
          
          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors duration-300"
            aria-label="Next testimonial"
          >
            <ArrowRight className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
