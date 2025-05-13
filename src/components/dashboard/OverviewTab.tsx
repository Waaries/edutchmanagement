
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
}

const OverviewTab = ({ setActiveTab }: OverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profiel</CardTitle>
          <CardDescription>Bekijk en bewerk uw profiel</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Bekijk en bewerk uw persoonlijke gegevens.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setActiveTab("profile")}>Naar profiel</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Afspraken</CardTitle>
          <CardDescription>Beheer uw afspraken</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Bekijk en beheer uw geplande afspraken.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setActiveTab("appointments")}>Bekijk afspraken</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Instellingen</CardTitle>
          <CardDescription>Pas uw voorkeuren aan</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Pas uw account- en notificatie-instellingen aan.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Instellingen bekijken</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OverviewTab;
