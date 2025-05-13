
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DataTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gegevensbeheer</CardTitle>
        <CardDescription>Beheer systeemgegevens</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Deze functie wordt momenteel ontwikkeld. Binnenkort kunt u hier gegevens beheren.
        </p>
      </CardContent>
    </Card>
  );
};

export default DataTab;
