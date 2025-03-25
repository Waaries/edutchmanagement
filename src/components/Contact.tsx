import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ArrowRight, Check } from "lucide-react";

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formState);
    // Here you would normally send the data to your server
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });
    }, 3000);
  };

  return (
    <section id="contact" className="section-padding bg-brand-silver" ref={sectionRef}>
      <div className="container mx-auto container-padding reveal">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-medium text-brand-blue mb-4">
            Contact Opnemen
          </div>
          <h2 className="mb-6">Klaar Om Uw <span className="text-brand-blue">Bedrijfsadres</span> Te Upgraden?</h2>
          <p className="text-lg text-brand-mediumgray">
            Neem contact met ons op voor meer informatie of om een pakket te kiezen dat bij uw bedrijf past.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="glass-card rounded-xl p-8 md:p-10">
            <h3 className="text-2xl font-semibold mb-6">Stuur ons een bericht</h3>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Bericht Verzonden!</h4>
                <p className="text-brand-mediumgray">
                  Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Naam
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                      placeholder="Uw volledige naam"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                      placeholder="uw@email.nl"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Telefoonnummer
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                      placeholder="Uw telefoonnummer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="service" className="block text-sm font-medium">
                      Gewenst Pakket
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formState.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all bg-white"
                    >
                      <option value="">Selecteer een pakket</option>
                      <option value="basic">Basis Bedrijfsadres</option>
                      <option value="premium">Premium Bedrijfsadres</option>
                      <option value="complete">Zakelijk Compleet</option>
                      <option value="custom">Aangepast Pakket</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium">
                    Uw Bericht
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    placeholder="Vertel ons wat meer over uw behoeften..."
                  ></textarea>
                </div>
                
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 text-white w-full py-6">
                  <span>Verstuur Bericht</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
          
          <div className="glass-card rounded-xl p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contactgegevens</h3>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Ons Adres</h4>
                    <p className="text-brand-mediumgray">
                      Reigersbos 100 P<br />
                      1107 ES Amsterdam
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Telefoonnummer</h4>
                    <p className="text-brand-mediumgray">+31 (0)20 123 4567</p>
                    <p className="text-sm text-brand-mediumgray">Ma-Vr: 9:00 - 17:30</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">E-mail</h4>
                    <p className="text-brand-mediumgray">info@bedrijfsadres.nl</p>
                    <p className="text-sm text-brand-mediumgray">Antwoord binnen 24 uur</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden h-64 relative">
              <div className="absolute inset-0 bg-gray-600 opacity-10"></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2438.4499798694825!2d4.979604376940437!3d52.30021574461772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c60be2375814c1%3A0x4e2e41c3de0fc814!2sReigersbos%20100%2C%201107%20ES%20Amsterdam!5e0!3m2!1sen!2snl!4v1697029838428!5m2!1sen!2snl" 
                width="100%" 
                height="100%" 
                className="border-0"
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
