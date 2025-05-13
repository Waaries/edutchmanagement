
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface WelcomeCardProps {
  userEmail?: string | null;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userEmail }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Welkom, {userEmail}</CardTitle>
        <CardDescription>
          U bent ingelogd als beheerder van eDutch Management.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Vanuit dit dashboard kunt u alle aspecten van het systeem beheren.</p>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
