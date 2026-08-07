
import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { translate } = useLanguage();
  
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
  
  const testimonials = translate("testimonials.items") as unknown as Array<{
    quote: string;
    author: string;
    company: string;
  }>;

  return (
    <section id="getuigenissen" className="relative py-24 md:py-32 bg-white overflow-hidden border-t border-slate-200" ref={sectionRef}>
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-500/[0.04] blur-[140px] pointer-events-none" />
      <div className="relative container mx-auto px-6 reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-slate-100 border border-slate-200">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-600">{translate("testimonials.title")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
            {translate("testimonials.subtitle")}
          </h2>
          <p className="text-lg text-slate-600">
            {translate("testimonials.description")}
          </p>
        </div>

        <div className="relative min-h-[320px] flex items-center justify-center">
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
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 md:p-12">
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-6">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-xl md:text-2xl mb-8 text-slate-700 text-balance leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-slate-500 text-sm">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center items-center mt-8 gap-3">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:border-blue-400 transition-colors"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeTestimonial ? 'bg-blue-600 w-8' : 'bg-slate-300 w-2'
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
          
          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:border-blue-400 transition-colors"
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
