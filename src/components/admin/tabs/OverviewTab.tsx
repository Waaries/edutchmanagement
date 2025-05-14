
import React from "react";
import AdminStatsDashboard from "@/components/admin/dashboard/AdminStatsDashboard";
import UsageChart from "@/components/admin/dashboard/UsageChart";
import AdminNavigationCards from "@/components/admin/dashboard/AdminNavigationCards";
import { useAdminStats } from "@/hooks/use-admin-stats";

interface OverviewTabProps {
  onTabChange: (tabValue: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onTabChange }) => {
  const { loading, chartData } = useAdminStats();
  
  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <AdminStatsDashboard />
      
      {/* Chart visualization */}
      <UsageChart data={chartData} loading={loading} />
      
      {/* Navigation cards */}
      <AdminNavigationCards onTabChange={onTabChange} />
    </div>
  );
};

export default OverviewTab;
