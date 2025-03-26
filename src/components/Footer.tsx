
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto container-padding">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-20">
          {/* Logo and Description - spans 5 columns on md screens */}
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
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-all duration-300"
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
                  <a href="#diensten" className="text-white/70 hover:text-blue-300 transition-colors duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
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
                  <a href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-white/70 hover:text-blue-300 transition-colors duration-300 flex items-center group">
                    <ChevronRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
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
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Ons Adres</h4>
                  <p className="text-white/80">
                    Reigersbos 100 P<br />
                    1107 ES Amsterdam
                  </p>
                </div>
              </li>
              
              <li className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Telefoonnummer</h4>
                  <a href="tel:+31207370385" className="text-white/80 hover:text-blue-300 transition-colors">
                    +31 (0)20 737 03 85
                  </a>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">E-mail</h4>
                  <a href="mailto:info@edutchmanagement.nl" className="text-white/80 hover:text-blue-300 transition-colors">
                    info@edutchmanagement.nl
                  </a>
                </div>
              </li>
              
              <li className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Openingstijden</h4>
                  <p className="text-white/80">Ma-Vr: 09:00 - 17:00</p>
                </div>
              </li>
            </ul>
            <div className="mt-8">
              <Button className="gradient-primary hover:bg-blue-600 text-white border-none w-full">
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
