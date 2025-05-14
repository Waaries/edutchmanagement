
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface StatsData {
  totalUsers: number;
  adminUsers: number;
  activeUsersLastWeek: number;
  newestUsers: number;
}

export function useAdminStats() {
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

  // Helper to create chart data from stats
  const getChartData = () => {
    return stats ? [
      { name: 'Totaal', value: stats.totalUsers },
      { name: 'Admins', value: stats.adminUsers },
      { name: 'Actief', value: stats.activeUsersLastWeek },
      { name: 'Nieuw', value: stats.newestUsers }
    ] : [];
  };
  
  return {
    stats,
    loading,
    chartData: getChartData()
  };
}
