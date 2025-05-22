
import { Facebook, Instagram } from "lucide-react";

interface SocialLinksProps {
  className?: string;
}

const SocialLinks = ({ className }: SocialLinksProps) => {
  return (
    <div className={`flex space-x-5 ${className}`}>
      {[
        { 
          icon: <Facebook size={22} />, 
          label: "Facebook", 
          href: "#facebook" 
        },
        { 
          icon: <Instagram size={22} />, 
          label: "Instagram", 
          href: "#instagram" 
        },
        { 
          icon: (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
              <path d="M16.657 18.657a8 8 0 1 0 -9.314 0"></path>
              <path d="M18 18.25v1.75l-3 -3l.5 -2l2.5 2v-7.25a1.25 1.25 0 0 0 -2.5 0v7.25"></path>
            </svg>
          ), 
          label: "TikTok", 
          href: "#tiktok" 
        }
      ].map((social, index) => (
        <a 
          key={index}
          href={social.href} 
          className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300"
          aria-label={`Follow us on ${social.label}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
