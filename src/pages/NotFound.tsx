
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-brand-silver p-6">
      <div className="text-center max-w-lg">
        <img 
          src="/lovable-uploads/39d6c2c8-b4a1-4f97-86fb-dd3a6e9fcdbd.png"
          alt="eDutch Management Logo"
          className="h-16 mx-auto mb-6"
        />
        <h1 className="text-8xl font-bold text-[#F97316] mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">{translate("notFound.title")}</h2>
        <p className="text-lg text-brand-mediumgray mb-8">
          {translate("notFound.subtitle")}
        </p>
        <Button asChild className="bg-[#F97316] hover:bg-[#F97316]/90 text-white inline-flex">
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
