
import { Link } from "react-router-dom";

interface FooterBottomProps {
  currentYear: number;
}

const FooterBottom = ({ currentYear }: FooterBottomProps) => {
  return (
    <div className="border-t border-white/10 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center text-left">
        <p className="text-sm text-slate-400 mb-4 md:mb-0">
          &copy; {currentYear} eDutch Management. Alle rechten voorbehouden.
        </p>
        
        <div className="flex flex-wrap justify-center space-x-6">
          <a href="#privacybeleid" className="text-sm text-slate-400 hover:text-white transition-colors">
            Privacybeleid
          </a>
          <a href="#algemene-voorwaarden" className="text-sm text-slate-400 hover:text-white transition-colors">
            Algemene Voorwaarden
          </a>
          <Link to="/cookiebeleid" className="text-sm text-slate-400 hover:text-white transition-colors">
            Cookiebeleid
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
