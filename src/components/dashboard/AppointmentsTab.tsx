
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AppointmentsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Afsprakenbeheer</CardTitle>
        <CardDescription>Bekijk en beheer uw afspraken</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Afsprakenbeheer wordt momenteel ontwikkeld. Binnenkort kunt u hier uw afspraken inzien en beheren.
        </p>
        <Button variant="outline" disabled>Nieuwe afspraak maken</Button>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTab;
