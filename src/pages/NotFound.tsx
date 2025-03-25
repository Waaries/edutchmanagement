
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-brand-silver p-6">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl font-bold text-brand-blue mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Pagina Niet Gevonden</h2>
        <p className="text-lg text-brand-mediumgray mb-8">
          De pagina die u probeert te bezoeken bestaat niet of is verplaatst.
        </p>
        <Button asChild className="bg-brand-blue hover:bg-brand-blue/90 text-white inline-flex">
          <Link to="/">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Terug naar Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
