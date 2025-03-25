
import { ArrowRight, Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/39d6c2c8-b4a1-4f97-86fb-dd3a6e9fcdbd.png" 
                alt="eDutch Management Logo" 
                className="h-10 mr-2"
              />
              <h3 className="text-xl font-bold">eDutch Management</h3>
            </div>
            <p className="text-white/70">
              Wij bieden professionele bedrijfsadressen voor ondernemers en bedrijven die hun uitstraling willen verbeteren zonder de kosten van een fysiek kantoor.
            </p>
            <div className="flex space-x-4 pt-4">
              <a 
                href="#facebook" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] transition-all"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#twitter" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] transition-all"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#linkedin" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] transition-all"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#instagram" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] transition-all"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Diensten</h4>
            <ul className="space-y-3">
              {[
                "Basis Bedrijfsadres",
                "Premium Bedrijfsadres",
                "Zakelijk Compleet",
                "Aangepaste Pakketten",
                "Post Doorsturen",
                "Telefonische Beantwoording"
              ].map((item) => (
                <li key={item}>
                  <a href="#diensten" className="text-white/70 hover:text-[#F97316] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Links</h4>
            <ul className="space-y-3">
              {[
                "Home",
                "Over Ons",
                "Diensten",
                "Tarieven",
                "Veelgestelde Vragen",
                "Blog",
                "Contact"
              ].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-white/70 hover:text-[#F97316] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPin size={16} className="text-[#F97316] mr-2" />
                <span className="text-white/70">Reigersbos 100 P, 1107 ES Amsterdam</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="text-[#F97316] mr-2" />
                <span className="text-white/70">+31 (0)20 737 03 85</span>
              </li>
              <li className="flex items-start">
                <Mail size={16} className="text-[#F97316] mr-2 mt-1" />
                <span className="text-white/70">info@edutchmanagement.nl</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#F97316] mr-2">⏰</span>
                <span className="text-white/70">Ma-Vr: 09:00 - 17:00</span>
              </li>
            </ul>
            
            <h4 className="text-lg font-semibold mb-4 mt-8">Nieuwsbrief</h4>
            <p className="text-white/70 mb-4">
              Schrijf u in voor onze nieuwsbrief om op de hoogte te blijven van aanbiedingen en updates.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Uw e-mailadres" 
                className="px-4 py-2 rounded-l-md bg-white/10 border-white/10 border focus:outline-none focus:ring-1 focus:ring-[#F97316] w-full"
              />
              <Button className="bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-l-none" aria-label="Subscribe">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <hr className="border-white/10" />
        
        <div className="py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/60">
            &copy; {currentYear} eDutch Management. Alle rechten voorbehouden.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Privacybeleid", "Algemene Voorwaarden", "Cookiebeleid"].map((item) => (
              <a key={item} href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
