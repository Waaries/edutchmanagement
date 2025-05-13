import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMobile } from '@/hooks/use-mobile';
import LanguageSelector from './LanguageSelector';
import AdminBanner from './AdminBanner';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { translate } = useLanguage();
  const { isMobile } = useMobile();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <AdminBanner />
      <div className="container relative flex items-center justify-between h-16">
        <Link to="/" className="font-bold text-xl">
          LOV
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSelector />
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button onClick={() => signOut()} variant="outline">
                {translate("nav.signOut")}
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button>
                <LogIn className="mr-2 h-4 w-4" />
                {translate("nav.signIn")}
              </Button>
            </Link>
          )}
        </div>

        {isMobile && (
          <button onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        )}

        {isMobile && (
          <div
            className={`absolute top-16 left-0 right-0 bg-white shadow-md rounded-md overflow-hidden transition-all duration-300 ${
              isMenuOpen ? 'max-h-96 py-4' : 'max-h-0'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <LanguageSelector />
              {user ? (
                <>
                  <Link to="/profile" className="block w-full text-center">
                    <Button variant="ghost" className="w-full justify-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={() => signOut()} variant="outline" className="w-full">
                    {translate("nav.signOut")}
                  </Button>
                </>
              ) : (
                <Link to="/auth" className="block w-full text-center">
                  <Button className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    {translate("nav.signIn")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
