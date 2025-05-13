
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "@/components/admin/UsersTable";

const UsersTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gebruikersbeheer</CardTitle>
        <CardDescription>Beheer gebruikersaccounts en toegangsrechten</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          <p>
            U kunt hier gebruikers beheren, adminrechten toekennen of intrekken. Uw eigen gebruikersaccount 
            is gemarkeerd en kan niet verwijderd worden.
          </p>
        </div>
        <UsersTable />
      </CardContent>
    </Card>
  );
};

export default UsersTab;
