
import { ArrowRight } from "lucide-react";
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
              {["facebook", "twitter", "linkedin", "instagram"].map((social) => (
                <a 
                  key={social} 
                  href={`#${social}`} 
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] transition-all"
                  aria-label={`Follow us on ${social}`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 5h2v2h-2V7zm0 4h2v6h-2v-6z" />
                  </svg>
                </a>
              ))}
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
            <h4 className="text-lg font-semibold mb-4">Nieuwsbrief</h4>
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
