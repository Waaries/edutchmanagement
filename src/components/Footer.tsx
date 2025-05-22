
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
    <footer className="bg-[#0d111c] text-white py-16 w-full">
      <div className="container-full max-w-[1600px] mx-auto px-6 md:px-10 lg:px-20 xl:px-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Column 1: Logo, Description and Social Links */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="h-24 w-24 flex items-center justify-center rounded-lg">
                <img 
                  src="/lovable-uploads/39d6c2c8-b4a1-4f97-86fb-dd3a6e9fcdbd.png" 
                  alt="eDutch Management Logo" 
                  className="h-20 invert"
                />
              </div>
            </div>
            <p className="text-white/80 text-base leading-relaxed mb-6 max-w-md">
              Wij bieden professionele bedrijfsadressen voor ondernemers en bedrijven die hun uitstraling willen verbeteren zonder de kosten van een fysiek kantoor.
            </p>
            <SocialLinks className="pt-2" />
          </div>
          
          {/* Column 2: Services and Links - Combined */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {/* Services Column */}
            <FooterColumn title={translate("footer.services")}>
              <FooterLinkList links={serviceLinks} />
            </FooterColumn>
            
            {/* Links Column */}
            <FooterColumn title={translate("footer.links")}>
              <FooterLinkList links={navLinks} />
            </FooterColumn>
          </div>
          
          {/* Column 3: Contact Information */}
          <div className="flex flex-col">
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
