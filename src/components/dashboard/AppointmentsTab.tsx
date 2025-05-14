
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AppointmentsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ontvangen post</CardTitle>
        <CardDescription>Bekijk en beheer uw ontvangen post</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Ontvangen post wordt momenteel ontwikkeld. Binnenkort kunt u hier uw ontvangen post inzien en beheren.
        </p>
        <Button variant="outline" disabled>Nieuwe post registreren</Button>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTab;
