
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "nl" ? "en" : "nl");
  };

  return (
    <Button 
      onClick={toggleLanguage} 
      variant="outline" 
      size="sm" 
      className="px-3 py-1 text-sm h-8 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border-2 border-primary/20 rounded-xl text-foreground"
    >
      <Globe className="h-4 w-4 text-primary" />
      <span className="font-bold text-foreground">
        {language === "nl" ? "EN" : "NL"}
      </span>
    </Button>
  );
}
