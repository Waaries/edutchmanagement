
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

interface FooterBottomProps {
  currentYear: number;
  copyright: string;
  terms: string;
  privacy: string;
  cookies: string;
}

const FooterBottom = ({ 
  currentYear, 
  copyright, 
  terms, 
  privacy, 
  cookies
}: FooterBottomProps) => {
  return (
    <>
      <Separator className="bg-white/10 my-10" />
      
      <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/60 text-lg">
          {copyright}
        </p>
        
        <div className="flex items-center gap-8 text-lg">
          <Link to="/terms" className="text-white/60 hover:text-white transition-colors">
            {terms}
          </Link>
          <Link to="/privacy" className="text-white/60 hover:text-white transition-colors">
            {privacy}
          </Link>
          <Link to="/cookie-policy" className="text-white/60 hover:text-white transition-colors">
            {cookies}
          </Link>
        </div>
      </div>
    </>
  );
};

export default FooterBottom;
