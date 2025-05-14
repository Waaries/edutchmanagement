
import React from "react";
import StatsCard from "./StatsCard";
import { useAdminStats } from "@/hooks/use-admin-stats";

const AdminStatsDashboard: React.FC = () => {
  const { stats, loading } = useAdminStats();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Totaal gebruikers"
        description="Alle geregistreerde accounts"
        value={stats?.totalUsers}
        loading={loading}
        colorClass="text-primary"
      />
      
      <StatsCard
        title="Admin gebruikers"
        description="Met admin rechten"
        value={stats?.adminUsers}
        loading={loading}
        colorClass="text-amber-600"
      />
      
      <StatsCard
        title="Actief afgelopen week"
        description="Ingelogd in de afgelopen 7 dagen"
        value={stats?.activeUsersLastWeek}
        loading={loading}
        colorClass="text-green-600"
      />
      
      <StatsCard
        title="Nieuwe gebruikers"
        description="Geregistreerd in de afgelopen 30 dagen"
        value={stats?.newestUsers}
        loading={loading}
        colorClass="text-blue-600"
      />
    </div>
  );
};

export default AdminStatsDashboard;
