
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "@/components/admin/UsersTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const UsersTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gebruikersbeheer</CardTitle>
        <CardDescription>Beheer gebruikersaccounts en toegangsrechten</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Belangrijk</AlertTitle>
          <AlertDescription>
            U kunt hier gebruikers beheren, adminrechten toekennen of intrekken. Uw eigen gebruikersaccount 
            is gemarkeerd en kan niet verwijderd worden.
          </AlertDescription>
        </Alert>
        <UsersTable />
      </CardContent>
    </Card>
  );
};

export default UsersTab;
