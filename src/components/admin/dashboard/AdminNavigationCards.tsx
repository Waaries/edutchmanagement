
import React from "react";
import NavigationCard from "./NavigationCard";

interface AdminNavigationCardsProps {
  onTabChange: (tabValue: string) => void;
}

const AdminNavigationCards: React.FC<AdminNavigationCardsProps> = ({ onTabChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NavigationCard
        title="Gebruikers"
        description="Beheer gebruikersaccounts"
        content="Bekijk, bewerk en beheer gebruikersaccounts in het systeem."
        buttonText="Bekijk gebruikers"
        onButtonClick={() => onTabChange("users")}
      />
      
      <NavigationCard
        title="Gegevens"
        description="Beheer systeemgegevens"
        content="Bekijk en bewerk de gegevens in het systeem."
        buttonText="Bekijk gegevens"
        onButtonClick={() => onTabChange("data")}
      />
      
      <NavigationCard
        title="Admin logboek"
        description="Activiteiten administratielogboek"
        content="Bekijk een logboek van alle administratieve acties."
        buttonText="Bekijk logboek"
        onButtonClick={() => onTabChange("logs")}
      />
    </div>
  );
};

export default AdminNavigationCards;
