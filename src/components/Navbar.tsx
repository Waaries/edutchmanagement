
import { useState, useEffect } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white bg-opacity-80 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between">
          <a 
            href="#" 
            className="flex items-center text-2xl font-bold tracking-tight text-brand-charcoal"
          >
            <img 
              src="/lovable-uploads/39d6c2c8-b4a1-4f97-86fb-dd3a6e9fcdbd.png" 
              alt="eDutch Management Logo" 
              className="h-12 mr-2"
            />
            <span className="hidden sm:inline">eDutch Management</span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Diensten", "Voordelen", "Getuigenissen", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-brand-charcoal hover:text-[#F97316] transition-colors font-medium"
              >
                {item}
              </a>
            ))}
            <Button className="bg-[#F97316] hover:bg-[#F97316]/90 text-white flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Client Login</span>
            </Button>
          </nav>

          <button 
            className="md:hidden text-brand-charcoal"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg animate-fade-in">
          <div className="container mx-auto py-5 container-padding">
            <div className="flex flex-col space-y-4">
              {["Home", "Diensten", "Voordelen", "Getuigenissen", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-brand-charcoal hover:text-[#F97316] transition-colors py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button className="bg-[#F97316] hover:bg-[#F97316]/90 text-white w-full flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Client Login</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
