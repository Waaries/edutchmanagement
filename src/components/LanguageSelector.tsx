
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "nl" ? "en" : "nl");
  };

  return (
    <Button 
      onClick={toggleLanguage} 
      variant="ghost" 
      size="sm" 
      className="px-2 py-1 text-sm h-8 flex items-center"
    >
      <span className="font-semibold">
        {language === "nl" ? "EN" : "NL"}
      </span>
    </Button>
  );
}
