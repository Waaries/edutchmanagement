
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  totalUsers: number;
  adminUsers: number;
  activeUsersLastWeek: number;
  newestUsers: number;
}

interface OverviewTabProps {
  onTabChange: (tabValue: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onTabChange }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  const fetchStatsData = async () => {
    try {
      setLoading(true);
      
      // Get all users count via the get_users function
      const { data: usersData, error: usersError } = await supabase.rpc('get_users');
      
      if (usersError) {
        console.error("Error fetching users for stats:", usersError);
        toast({
          title: "Fout bij ophalen statistieken",
          description: "Er was een probleem bij het ophalen van gebruikersstatistieken.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Process the data to get statistics
      if (usersData) {
        // Get current date and date 7 days ago for active users calculation
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        
        // Count active users in the last week
        const activeUsersLastWeek = usersData.filter(user => 
          user.last_sign_in_at && new Date(user.last_sign_in_at) >= sevenDaysAgo
        ).length;
        
        // Count users registered in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        const newestUsers = usersData.filter(user => 
          new Date(user.created_at) >= thirtyDaysAgo
        ).length;
        
        // Check admin status
        let adminCount = 0;
        for (const user of usersData) {
          const { data: isUserAdmin } = await supabase.rpc('is_admin_user', { 
            user_id_param: user.id 
          });
          if (isUserAdmin) adminCount++;
        }
        
        setStats({
          totalUsers: usersData.length,
          adminUsers: adminCount,
          activeUsersLastWeek,
          newestUsers
        });
      }
    } catch (error) {
      console.error("Error calculating stats:", error);
      toast({
        title: "Fout bij statistieken",
        description: "Er is een fout opgetreden bij het genereren van statistieken.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);
  
  // Chart data based on our statistics
  const chartData = stats ? [
    { name: 'Totaal', value: stats.totalUsers },
    { name: 'Admins', value: stats.adminUsers },
    { name: 'Actief', value: stats.activeUsersLastWeek },
    { name: 'Nieuw', value: stats.newestUsers }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Totaal gebruikers</CardTitle>
            <CardDescription>Alle geregistreerde accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-4xl font-bold text-primary">{stats?.totalUsers || 0}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Admin gebruikers</CardTitle>
            <CardDescription>Met admin rechten</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-4xl font-bold text-amber-600">{stats?.adminUsers || 0}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Actief afgelopen week</CardTitle>
            <CardDescription>Ingelogd in de afgelopen 7 dagen</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-4xl font-bold text-green-600">{stats?.activeUsersLastWeek || 0}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Nieuwe gebruikers</CardTitle>
            <CardDescription>Geregistreerd in de afgelopen 30 dagen</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-4xl font-bold text-blue-600">{stats?.newestUsers || 0}</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Chart visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Gebruikersstatistieken</CardTitle>
          <CardDescription>Visueel overzicht van gebruikersdata</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gebruikers</CardTitle>
            <CardDescription>Beheer gebruikersaccounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Bekijk, bewerk en beheer gebruikersaccounts in het systeem.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => onTabChange("users")}>Bekijk gebruikers</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gegevens</CardTitle>
            <CardDescription>Beheer systeemgegevens</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Bekijk en bewerk de gegevens in het systeem.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => onTabChange("data")}>Bekijk gegevens</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin logboek</CardTitle>
            <CardDescription>Activiteiten administratielogboek</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Bekijk een logboek van alle administratieve acties.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => onTabChange("logs")}>Bekijk logboek</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
