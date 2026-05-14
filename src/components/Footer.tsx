
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
    { text: translate("footer.aboutUs"), href: "#over-ons" },
    { text: translate("nav.services"), href: "#diensten" },
    { text: translate("footer.pricing"), href: "#tarieven" }
  ];

  return (
    <footer className="bg-[#0d111c] text-white py-16 w-full">
      <div className="container mx-auto px-6 md:px-10 lg:px-20 xl:px-24">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Column 1: Logo, Description and Social Links */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/39d6c2c8-b4a1-4f97-86fb-dd3a6e9fcdbd.png" 
                alt="eDutch Management Logo" 
                className="h-16 w-auto object-contain invert"
              />
            </div>
            <p className="text-white/80 text-base leading-relaxed mb-6 max-w-md">
              {translate("footer.description")}
            </p>
            <SocialLinks className="pt-2" />
          </div>
          
          {/* Column 2: Services and Links - Combined */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12">
            {/* Services Column */}
            <div className="sm:col-span-1 md:flex md:justify-center">
              <FooterColumn title={translate("footer.services")}>
                <FooterLinkList links={serviceLinks} />
              </FooterColumn>
            </div>
            
            {/* Links Column */}
            <div className="sm:col-span-1 md:flex md:justify-center">
              <FooterColumn title={translate("footer.links")}>
                <FooterLinkList links={navLinks} />
              </FooterColumn>
            </div>
          
            {/* Column 3: Contact Information */}
            <div className="sm:col-span-1 md:flex md:justify-end">
              <FooterColumn title={translate("footer.contact")}>
                <ContactInfo />
              </FooterColumn>
            </div>
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
