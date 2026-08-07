
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoLight from "@/assets/logo-light.png";


const NotFound = () => {
  const location = useLocation();
  const { translate } = useLanguage();

  useEffect(() => {
    // Update the document title
    document.title = "404 | eDutch Management";
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-900/30 blur-[120px]" />
      </div>
      <div className="relative text-center max-w-lg">
        <img 
          src="/lovable-uploads/39d6c2c8-b4a1-4f97-86fb-dd3a6e9fcdbd.png"
          alt="eDutch Management Logo"
          className="h-16 mx-auto mb-6"
        />
        <h1 className="text-8xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">404</h1>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-4">{translate("notFound.title")}</h2>
        <p className="text-lg text-slate-400 mb-8">
          {translate("notFound.subtitle")}
        </p>
        <Button asChild className="app-btn-primary rounded-full px-6 inline-flex">
          <Link to="/">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>{translate("notFound.backToHome")}</span>
          </Link>
        </Button>
      </div>
    </div>
  );

};

export default NotFound;
