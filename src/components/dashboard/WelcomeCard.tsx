
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
    <Card className="mb-8 bg-gradient-to-br from-blue-500/10 via-white/5 to-indigo-500/10 border-white/10 backdrop-blur-md shadow-xl shadow-blue-500/5">
      <CardHeader>
        <CardTitle className="text-2xl">
          {loading ? (
            <Skeleton className="h-8 w-64 bg-white/5" />
          ) : (
            <>Welkom, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{welcomeName}</span>!</>
          )}
        </CardTitle>
        <CardDescription className="text-slate-400">
          Bekijk uw persoonlijke dashboard bij eDutch Management.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default WelcomeCard;
