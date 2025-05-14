
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface WelcomeCardProps {
  user: User;
  isAdmin: boolean;
}

const WelcomeCard = ({ user, isAdmin }: WelcomeCardProps) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setFirstName(data.first_name);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user.id]);

  const welcomeName = firstName || user.email?.split('@')[0] || '';

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          {loading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            <>Welkom, {welcomeName}!</>
          )}
        </CardTitle>
        <CardDescription>
          Bekijk uw persoonlijke dashboard bij eDutch Management.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Vanuit dit dashboard kunt u al uw gegevens en activiteiten beheren.</p>
        <div className="mt-4 p-3 border rounded bg-slate-50">
          <p><strong>Account Type:</strong> {isAdmin ? 'Administrator' : 'Standaard Gebruiker'}</p>
          <p className="mt-1"><strong>Email:</strong> {user.email}</p>
          <p className="mt-1"><strong>Laatste login:</strong> {new Date(user.last_sign_in_at || '').toLocaleString('nl-NL')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
