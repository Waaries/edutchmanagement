
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Systeeminstellingen</CardTitle>
        <CardDescription>Configureer het systeem</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Deze functie wordt momenteel ontwikkeld. Binnenkort kunt u hier instellingen beheren.
        </p>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
