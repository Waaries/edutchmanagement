
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";

interface WelcomeCardProps {
  user: User;
  isAdmin: boolean;
}

const WelcomeCard = ({ user, isAdmin }: WelcomeCardProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Welkom, {user.email}</CardTitle>
        <CardDescription>
          Bekijk uw persoonlijke dashboard bij eDutch Management.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Vanuit dit dashboard kunt u al uw gegevens en activiteiten beheren.</p>
        <div className="mt-4 p-3 border rounded bg-slate-50">
          <p><strong>Account Type:</strong> {isAdmin ? 'Administrator' : 'Standaard Gebruiker'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
