import { Facebook, Mail } from "lucide-react";

interface SocialLinksProps {
  className?: string;
}

const SocialLinks = ({ className }: SocialLinksProps) => {
  return (
    <div className={`flex space-x-4 ${className}`}>
      {[
        { 
          icon: <Facebook size={20} />, 
          label: "Facebook", 
          href: "https://www.facebook.com/profile.php?id=61576336456020" 
        },
        { 
          icon: <Mail size={20} />,
          label: "Email", 
          href: "mailto:info@edutchmanagement.nl" 
        }
      ].map((social, index) => (
        <a 
          key={index}
          href={social.href} 
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300"
          aria-label={`Follow us on ${social.label}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
