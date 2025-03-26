
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-brand-charcoal to-black text-white">
      <div className="container mx-auto container-padding">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-20">
          {/* Logo and Description - spans 4 columns on md screens */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/39d6c2c8-b4a1-4f97-86fb-dd3a6e9fcdbd.png" 
                alt="eDutch Management Logo" 
                className="h-16 mr-4" 
              />
              <h3 className="text-2xl font-bold">eDutch Management</h3>
            </div>
            <p className="text-white/80 text-lg leading-relaxed max-w-md">
              Wij bieden professionele bedrijfsadressen voor ondernemers en bedrijven die hun uitstraling willen verbeteren zonder de kosten van een fysiek kantoor.
            </p>
            <div className="flex space-x-5 pt-6">
              {[
                { icon: <Facebook size={20} />, label: "Facebook", href: "#facebook" },
                { icon: <Twitter size={20} />, label: "Twitter", href: "#twitter" },
                { icon: <Linkedin size={20} />, label: "LinkedIn", href: "#linkedin" },
                { icon: <Instagram size={20} />, label: "Instagram", href: "#instagram" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F97316] transition-all duration-300"
                  aria-label={`Follow us on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Services Column - spans 2 columns on md screens */}
          <div className="md:col-span-2">
            <h4 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">Diensten</h4>
            <ul className="space-y-4">
              {[
                "Basis Bedrijfsadres",
                "Premium Bedrijfsadres",
                "Zakelijk Compleet",
                "Aangepaste Pakketten",
                "Post Doorsturen",
                "Telefonische Beantwoording"
              ].map((item, index) => (
                <li key={index}>
                  <a href="#diensten" className="text-white/70 hover:text-[#F97316] transition-colors duration-300 flex items-center">
                    <span className="bg-white/10 h-1 w-1 rounded-full mr-2"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Links Column - spans 2 columns on md screens */}
          <div className="md:col-span-2">
            <h4 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">Links</h4>
            <ul className="space-y-4">
              {[
                "Home",
                "Over Ons",
                "Diensten",
                "Tarieven",
                "Veelgestelde Vragen",
                "Blog",
                "Contact"
              ].map((item, index) => (
                <li key={index}>
                  <a href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-white/70 hover:text-[#F97316] transition-colors duration-300 flex items-center">
                    <span className="bg-white/10 h-1 w-1 rounded-full mr-2"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Information - spans 3 columns on md screens */}
          <div className="md:col-span-3">
            <h4 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">Contact</h4>
            <ul className="space-y-5">
              <li className="flex items-start">
                <MapPin size={18} className="text-[#F97316] mr-3 mt-1 flex-shrink-0" />
                <span className="text-white/80">Reigersbos 100 P, 1107 ES Amsterdam</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-[#F97316] mr-3 flex-shrink-0" />
                <a href="tel:+31207370385" className="text-white/80 hover:text-[#F97316] transition-colors">
                  +31 (0)20 737 03 85
                </a>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-[#F97316] mr-3 mt-1 flex-shrink-0" />
                <a href="mailto:info@edutchmanagement.nl" className="text-white/80 hover:text-[#F97316] transition-colors">
                  info@edutchmanagement.nl
                </a>
              </li>
              <li className="flex items-center">
                <Clock size={18} className="text-[#F97316] mr-3 flex-shrink-0" />
                <span className="text-white/80">Ma-Vr: 09:00 - 17:00</span>
              </li>
            </ul>
            <div className="mt-8">
              <Button className="bg-[#F97316] hover:bg-[#E65A00] text-white border-none w-full">
                Contact Ons
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar with Copyright and Links */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/60 mb-4 md:mb-0">
              &copy; {currentYear} eDutch Management. Alle rechten voorbehouden.
            </p>
            
            <div className="flex flex-wrap justify-center space-x-6">
              <a href="#privacybeleid" className="text-sm text-white/60 hover:text-white transition-colors">
                Privacybeleid
              </a>
              <a href="#algemene-voorwaarden" className="text-sm text-white/60 hover:text-white transition-colors">
                Algemene Voorwaarden
              </a>
              <Link to="/cookiebeleid" className="text-sm text-white/60 hover:text-white transition-colors">
                Cookiebeleid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
