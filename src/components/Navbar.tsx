
import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-lg py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-full container-padding">
        <div className="flex items-center justify-between">
          <a 
            href="#" 
            className="flex items-center text-2xl font-bold tracking-tight"
          >
            <div className="h-14 w-14 md:h-16 md:w-16 mr-3 gradient-primary flex items-center justify-center rounded-2xl shadow-lg shadow-primary/20">
              <img 
                src="/lovable-uploads/39d6c2c8-b4a1-4f97-86fb-dd3a6e9fcdbd.png" 
                alt="eDutch Management Logo" 
                className="h-10 md:h-12 invert"
              />
            </div>
            <span className="hidden sm:inline gradient-text">eDutch Management</span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Diensten", "Voordelen", "Getuigenissen", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-700 hover:text-primary transition-colors font-medium border-animate"
              >
                {item}
              </a>
            ))}
            {user ? (
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Uitloggen</span>
              </Button>
            ) : (
              <Link to="/auth">
                <Button className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Inloggen</span>
                </Button>
              </Link>
            )}
          </nav>

          <button 
            className="md:hidden text-slate-800 bg-slate-100 p-2 rounded-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-2xl animate-fade-in">
          <div className="container-full container-padding py-5">
            <div className="flex flex-col space-y-4">
              {["Home", "Diensten", "Voordelen", "Getuigenissen", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-slate-700 hover:text-primary transition-colors py-2 font-medium flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  {item}
                </a>
              ))}
              {user ? (
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 mt-4"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Uitloggen</span>
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full flex items-center justify-center gap-2 mt-4">
                    <LogIn className="h-4 w-4" />
                    <span>Inloggen</span>
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
