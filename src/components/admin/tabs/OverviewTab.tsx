
import React from "react";
import AdminStatsDashboard from "@/components/admin/dashboard/AdminStatsDashboard";
import UsageChart from "@/components/admin/dashboard/UsageChart";
import AdminNavigationCards from "@/components/admin/dashboard/AdminNavigationCards";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewTabProps {
  onTabChange: (tabValue: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onTabChange }) => {
  const { loading, chartData } = useAdminStats();
  const { isAdmin } = useAuth();
  const {
    notifications,
    clearNotification,
    clearAllNotifications
  } = useRealtimeNotifications(isAdmin || false);
  
  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <AdminStatsDashboard />
      
      {/* Notifications Section */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaties ({notifications.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs"
              >
                Wis alles
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.map((requestId) => (
              <div
                key={requestId}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-md"
              >
                <span className="text-sm">
                  Nieuwe aanvraag ontvangen
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearNotification(requestId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Chart visualization */}
      <UsageChart data={chartData} loading={loading} />
      
      {/* Navigation cards */}
      <AdminNavigationCards onTabChange={onTabChange} />
    </div>
  );
};

export default OverviewTab;
