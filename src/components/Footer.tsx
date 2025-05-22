
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import SocialLinks from "./footer/SocialLinks";
import FooterColumn from "./footer/FooterColumn";
import FooterLinkList from "./footer/FooterLinkList";
import ContactInfo from "./footer/ContactInfo";
import FooterBottom from "./footer/FooterBottom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { translate } = useLanguage();

  // Service links data
  const serviceLinks = [
    { text: translate("services.basic.title"), href: "#diensten" },
    { text: translate("services.premium.title"), href: "#diensten" },
    { text: translate("services.complete.title"), href: "#diensten" },
    { text: translate("services.customBtn"), href: "#diensten" }
  ];

  // Navigation links data
  const navLinks = [
    { text: translate("nav.home"), href: "#home" },
    { text: "Over Ons", href: "#over-ons" },
    { text: translate("nav.services"), href: "#diensten" },
    { text: "Tarieven", href: "#tarieven" }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto container-padding py-12">
        {/* Main Footer Content - Made more compact with improved grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-4">
          {/* Logo and Description - Made more compact */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center mb-3">
              <div className="h-16 w-16 md:h-20 md:w-20 flex items-center justify-center rounded-xl">
                <img 
                  src="/lovable-uploads/39d6c2c8-b4a1-4f97-86fb-dd3a6e9fcdbd.png" 
                  alt="eDutch Management Logo" 
                  className="h-14 md:h-16 invert"
                />
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              Wij bieden professionele bedrijfsadressen voor ondernemers en bedrijven die hun uitstraling willen verbeteren zonder de kosten van een fysiek kantoor.
            </p>
            <SocialLinks className="pt-3" />
          </div>
          
          {/* Services Column - Using 3-column layout for better spacing */}
          <div className="md:col-span-2">
            <FooterColumn title={translate("footer.services")}>
              <FooterLinkList links={serviceLinks} />
            </FooterColumn>
          </div>
          
          {/* Links Column */}
          <div className="md:col-span-2">
            <FooterColumn title={translate("footer.links")}>
              <FooterLinkList links={navLinks} />
            </FooterColumn>
          </div>
          
          {/* Contact Information */}
          <div className="md:col-span-3">
            <FooterColumn title={translate("footer.contact")}>
              <ContactInfo />
            </FooterColumn>
          </div>
        </div>
        
        {/* Bottom Bar with Copyright and Links */}
        <FooterBottom 
          currentYear={currentYear} 
          copyright={translate("footer.copyright").replace("{year}", currentYear.toString())}
          terms={translate("footer.terms")}
          privacy={translate("footer.privacy")}
          cookies={translate("footer.cookies")}
        />
      </div>
    </footer>
  );
};

export default Footer;
