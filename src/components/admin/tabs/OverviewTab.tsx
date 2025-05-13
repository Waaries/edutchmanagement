
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OverviewTabProps {
  onTabChange: (tabValue: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onTabChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gebruikers</CardTitle>
          <CardDescription>Beheer gebruikersaccounts</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Bekijk, bewerk en beheer gebruikersaccounts in het systeem.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => onTabChange("users")}>Bekijk gebruikers</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Gegevens</CardTitle>
          <CardDescription>Beheer systeemgegevens</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Bekijk en bewerk de gegevens in het systeem.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => onTabChange("data")}>Bekijk gegevens</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Instellingen</CardTitle>
          <CardDescription>Configureer systeem</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Pas systeeminstellingen en configuratie aan.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => onTabChange("settings")}>Pas instellingen aan</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OverviewTab;
