
import React from "react";
import AdminStatsDashboard from "@/components/admin/dashboard/AdminStatsDashboard";
import UsageChart from "@/components/admin/dashboard/UsageChart";
import AdminNavigationCards from "@/components/admin/dashboard/AdminNavigationCards";
import ProductionAnalyticsDebugger from "@/components/ProductionAnalyticsDebugger";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, X, Building2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewTabProps {
  onTabChange: (tabValue: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onTabChange }) => {
  const { loading, chartData } = useAdminStats();
  const { isAdmin } = useAuth();
  const {
    notifications,
    addressRequestNotifications,
    contactNotifications,
    clearNotification,
    clearContactNotification,
    clearAllNotifications
  } = useRealtimeNotifications(isAdmin || false);
  
  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <AdminStatsDashboard />
      
      {/* Notifications Section - Always visible */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaties ({notifications.length})
            </CardTitle>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs"
              >
                Wis alles
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {notifications.length > 0 ? (
            <>
              {/* Address Request Notifications */}
              {addressRequestNotifications.map((requestId) => (
                <div
                  key={`address-${requestId}`}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      Nieuwe bedrijfsadres aanvraag ontvangen
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearNotification(requestId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {/* Contact Message Notifications */}
              {contactNotifications.map((messageId) => (
                <div
                  key={`contact-${messageId}`}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Nieuw contact bericht ontvangen
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearContactNotification(messageId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-4 text-slate-400">
              <p className="text-sm">Geen nieuwe notificaties</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Chart visualization */}
      <UsageChart data={chartData} loading={loading} />
      
      {/* Navigation cards */}
      <AdminNavigationCards onTabChange={onTabChange} />
      
      {/* Analytics Debugger - Only visible in admin dashboard */}
      <ProductionAnalyticsDebugger />
    </div>
  );
};

export default OverviewTab;
