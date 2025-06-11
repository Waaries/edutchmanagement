
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./tabs/OverviewTab";
import EnhancedAddressRequestsTab from "./tabs/EnhancedAddressRequestsTab";
import ContactMessagesTab from "./tabs/ContactMessagesTab";
import UsersTab from "./tabs/UsersTab";
import DataTab from "./tabs/DataTab";
import ContractsTab from "./tabs/ContractsTab";
import SettingsTab from "./tabs/SettingsTab";
import LogsTab from "./tabs/LogsTab";
import { useState } from "react";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isAdmin } = useAuth();
  const { isSubscribed, notifications } = useRealtimeNotifications(isAdmin || false);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col space-y-2">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Aanvragen
            {notifications.length > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages">Berichten</TabsTrigger>
          <TabsTrigger value="contracts">Contracten</TabsTrigger>
          <TabsTrigger value="users">Gebruikers</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="settings">Instellingen</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        {/* Realtime status indicator */}
        <div className="flex items-center justify-end text-xs">
          <span className="mr-2">Realtime status:</span>
          <Badge variant={isSubscribed ? "default" : "outline"} className={isSubscribed ? "bg-green-500" : "bg-yellow-500"}>
            {isSubscribed ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>
      
      <TabsContent value="overview" className="mt-6">
        <OverviewTab onTabChange={handleTabChange} />
      </TabsContent>
      
      <TabsContent value="requests" className="mt-6">
        <EnhancedAddressRequestsTab />
      </TabsContent>
      
      <TabsContent value="messages" className="mt-6">
        <ContactMessagesTab />
      </TabsContent>
      
      <TabsContent value="contracts" className="mt-6">
        <ContractsTab />
      </TabsContent>
      
      <TabsContent value="users" className="mt-6">
        <UsersTab />
      </TabsContent>
      
      <TabsContent value="data" className="mt-6">
        <DataTab />
      </TabsContent>
      
      <TabsContent value="settings" className="mt-6">
        <SettingsTab />
      </TabsContent>
      
      <TabsContent value="logs" className="mt-6">
        <LogsTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
