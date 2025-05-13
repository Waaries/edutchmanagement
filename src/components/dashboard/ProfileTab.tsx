
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

interface ProfileTabProps {
  user: User;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profielgegevens</CardTitle>
        <CardDescription>Bekijk en bewerk uw profiel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="font-medium text-sm text-muted-foreground">E-mail</span>
            <span>{user.email}</span>
          </div>
          <div>
            <p className="text-muted-foreground mb-4">
              Profielbewerking wordt momenteel ontwikkeld. Binnenkort kunt u hier uw gegevens bijwerken.
            </p>
            <Button variant="outline" disabled>Profiel bewerken</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
