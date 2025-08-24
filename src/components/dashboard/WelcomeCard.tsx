
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface WelcomeCardProps {
  user: User;
  isAdmin: boolean;
}

const WelcomeCard = ({ user, isAdmin }: WelcomeCardProps) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Controleer eerst of de profieltabel bestaat
        const { data: tableExists } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
          .throwOnError();
        
        // Als de tabel bestaat, probeer dan de profielgegevens op te halen
        if (tableExists !== null) {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .maybeSingle(); // Gebruik maybeSingle in plaats van single voor betere foutafhandeling
          
          if (error) {
            console.error('Error fetching profile:', error);
          } else if (data) {
            setFirstName(data.first_name);
          }
        } else {
          console.log('Profiles table may not exist');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user.id]);

  // Gebruik gebruikersnaam uit user_metadata of e-mail als fallback
  const userMetadata = user.user_metadata as any;
  const welcomeName = firstName || 
                      (userMetadata?.first_name) || 
                      user.email?.split('@')[0] || 
                      'gebruiker';

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
    </Card>
  );
};

export default WelcomeCard;
