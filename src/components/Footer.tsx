
import { Link } from "react-router-dom";
import SocialLinks from "./footer/SocialLinks";
import FooterColumn from "./footer/FooterColumn";
import FooterLinkList from "./footer/FooterLinkList";
import ContactInfo from "./footer/ContactInfo";
import FooterBottom from "./footer/FooterBottom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Service links data
  const serviceLinks = [
    { text: "Basis Bedrijfsadres", href: "#diensten" },
    { text: "Premium Bedrijfsadres", href: "#diensten" },
    { text: "Zakelijk Compleet", href: "#diensten" },
    { text: "Aangepaste Pakketten", href: "#diensten" }
  ];

  // Navigation links data
  const navLinks = [
    { text: "Home", href: "#home" },
    { text: "Over Ons", href: "#over-ons" },
    { text: "Diensten", href: "#diensten" },
    { text: "Tarieven", href: "#tarieven" }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container-full container-padding">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-20">
          {/* Logo and Description */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center mb-6">
              <div className="h-24 w-24 md:h-28 md:w-28 flex items-center justify-center rounded-2xl">
                <img 
                  src="/lovable-uploads/39d6c2c8-b4a1-4f97-86fb-dd3a6e9fcdbd.png" 
                  alt="eDutch Management Logo" 
                  className="h-20 md:h-24 invert"
                />
              </div>
            </div>
            <p className="text-white/80 text-lg leading-relaxed max-w-md text-left">
              Wij bieden professionele bedrijfsadressen voor ondernemers en bedrijven die hun uitstraling willen verbeteren zonder de kosten van een fysiek kantoor.
            </p>
            <SocialLinks className="pt-6" />
          </div>
          
          {/* Services Column */}
          <div className="md:col-span-2">
            <FooterColumn title="Diensten">
              <FooterLinkList links={serviceLinks} />
            </FooterColumn>
          </div>
          
          {/* Links Column */}
          <div className="md:col-span-2">
            <FooterColumn title="Links">
              <FooterLinkList links={navLinks} />
            </FooterColumn>
          </div>
          
          {/* Contact Information */}
          <div className="md:col-span-3">
            <FooterColumn title="Contact">
              <ContactInfo />
            </FooterColumn>
          </div>
        </div>
        
        {/* Bottom Bar with Copyright and Links */}
        <FooterBottom currentYear={currentYear} />
      </div>
    </footer>
  );
};

export default Footer;
