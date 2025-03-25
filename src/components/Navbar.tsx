
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
            className="text-2xl font-bold tracking-tight text-brand-charcoal"
          >
            BusinessAddress
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Diensten", "Voordelen", "Getuigenissen", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-brand-charcoal hover:text-brand-blue transition-colors font-medium"
              >
                {item}
              </a>
            ))}
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white">
              Neem Contact Op
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
                  className="text-brand-charcoal hover:text-brand-blue transition-colors py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white w-full">
                Neem Contact Op
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
