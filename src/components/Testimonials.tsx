
import { useEffect, useRef, useState } from "react";

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
  
  const testimonials = [
    {
      quote: "Het huren van een bedrijfsadres via deze dienst heeft onze professionele uitstraling aanzienlijk verbeterd. Onze klanten zijn onder de indruk van ons prestigieuze adres, terwijl wij flexibel blijven werken.",
      author: "Sophie van den Berg",
      company: "Directeur, InnovateTech BV",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      quote: "Als startende ondernemer was dit precies wat ik nodig had. Een betaalbaar professioneel adres zonder de kosten van een fysiek kantoor. De postafhandeling is uiterst efficiënt en betrouwbaar.",
      author: "Thomas Bakker",
      company: "Oprichter, WebSolutions",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "De klantenservice is uitzonderlijk. Ze gaan verder dan verwacht om onze specifieke behoeften te vervullen. Het Premium pakket biedt alles wat we nodig hebben voor ons groeiende team.",
      author: "Emma Visser",
      company: "Marketing Manager, GrowBiz",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];

  return (
    <section id="getuigenissen" className="section-padding bg-brand-charcoal text-white" ref={sectionRef}>
      <div className="container mx-auto container-padding reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white mb-4">
            Ervaringen
          </div>
          <h2 className="mb-6">Wat Onze <span className="text-brand-blue">Klanten</span> Zeggen</h2>
          <p className="text-lg text-white/80">
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
              <div className="glass-card bg-white/5 backdrop-blur-xs border-white/10 rounded-2xl p-8 md:p-12">
                <div className="flex flex-col items-center text-center">
                  <svg className="h-12 w-12 text-brand-blue mb-6 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                  
                  <p className="text-xl md:text-2xl mb-8 text-white/90 text-balance">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="w-14 h-14 rounded-full mr-4 border-2 border-brand-blue"
                    />
                    <div className="text-left">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-white/70 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-3 h-3 rounded-full mx-1 transition-all ${
                index === activeTestimonial ? 'bg-brand-blue' : 'bg-white/30'
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
