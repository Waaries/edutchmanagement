import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageSelector from "@/components/LanguageSelector";
import logoLight from "@/assets/logo-light.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { translate } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    // No need to manage state or navigate here, signOut handles everything
  };

  // Menu items with their translated values
  const menuItems = [
    { key: "services", id: "diensten", label: translate("nav.services") },
    { key: "testimonials", id: "getuigenissen", label: translate("nav.testimonials") },
    { key: "contact", id: "contact", label: translate("nav.contact") }
  ];

  const handleNavClick = (event, itemId) => {
    setIsMenuOpen(false);
    
    // If we're already on the home page, use smooth scrolling behavior
    if (isHomePage) {
      event.preventDefault();
      const element = document.getElementById(itemId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // If not on home page, the Link component will handle navigation to /#section
  };

  const handleLogoClick = (event) => {
    setIsMenuOpen(false);
    
    // If already on home page, scroll to top
    if (isHomePage) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If not on home page, navigate to home page
      navigate('/');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-950/85 backdrop-blur-xl shadow-2xl shadow-black/20 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-full container-padding">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-start max-w-[100px]"></div>

          <Link
            to="/"
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
          >
            <img
              src={logoLight}
              alt="eDutch Management Logo"
              className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_18px_rgba(96,165,250,0.4)]"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-end">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={isHomePage ? `#${item.id}` : `/#${item.id}`}
                className="text-slate-200 hover:text-blue-400 transition-colors font-semibold font-poppins"
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.label}
              </Link>
            ))}

            {user && (
              <Link
                to="/dashboard"
                className="text-slate-200 hover:text-blue-400 transition-colors font-semibold font-poppins flex items-center gap-1"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}

            <LanguageSelector />

            {user ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/25"
              >
                <LogOut className="h-4 w-4" />
                <span>{translate("nav.logout")}</span>
              </Button>
            ) : (
              <Link to="/auth">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30">
                  <LogIn className="h-4 w-4" />
                  <span>{translate("nav.login")}</span>
                </Button>
              </Link>
            )}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <button
              className="text-white bg-white/10 border border-white/15 p-2 rounded-xl backdrop-blur-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10 absolute top-full left-0 right-0 shadow-2xl animate-fade-in">
          <div className="container-full container-padding py-5">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  to={isHomePage ? `#${item.id}` : `/#${item.id}`}
                  className="text-slate-200 hover:text-blue-400 transition-colors py-2 font-semibold font-poppins flex items-center"
                  onClick={(e) => handleNavClick(e, item.id)}
                >
                  {item.label}
                </Link>
              ))}

              {user && (
                <Link
                  to="/dashboard"
                  className="text-slate-200 hover:text-blue-400 transition-colors py-2 font-semibold font-poppins flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}

              {user ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 mt-4 bg-white/5 border-white/15 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{translate("nav.logout")}</span>
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30">
                    <LogIn className="h-4 w-4" />
                    <span>{translate("nav.login")}</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
