
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import SocialLinks from "./footer/SocialLinks";
import FooterColumn from "./footer/FooterColumn";
import FooterLinkList from "./footer/FooterLinkList";
import ContactInfo from "./footer/ContactInfo";
import FooterBottom from "./footer/FooterBottom";
import logoLight from "@/assets/logo-light.png";

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
    <footer className="relative bg-slate-950 text-white py-20 w-full border-t border-white/10 overflow-hidden">
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="relative container mx-auto px-6 md:px-10 lg:px-20 xl:px-24">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Column 1: Logo, Description and Social Links */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col">
            <div className="mb-6">
              <img 
                src={logoLight} 
                alt="eDutch Management Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <p className="text-white/80 text-base leading-relaxed mb-6 max-w-md">
              {translate("footer.description")}
            </p>
            <SocialLinks className="pt-2" />
          </div>
          
          {/* Column 2: Services and Links - Combined */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col sm:flex-row sm:flex-wrap gap-x-16 gap-y-10 md:pl-4 lg:pl-6">
            {/* Services Column */}
            <FooterColumn title={translate("footer.services")}>
              <FooterLinkList links={serviceLinks} />
            </FooterColumn>

            {/* Links Column */}
            <FooterColumn title={translate("footer.links")}>
              <FooterLinkList links={navLinks} />
            </FooterColumn>

            {/* Column 3: Contact Information */}
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
