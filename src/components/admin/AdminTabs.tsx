
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart3, Settings, Database, FileText, Building2 } from "lucide-react";
import OverviewTab from "./tabs/OverviewTab";
import UsersTab from "./tabs/UsersTab";
import DataTab from "./tabs/DataTab";
import LogsTab from "./tabs/LogsTab";
import SettingsTab from "./tabs/SettingsTab";
import AddressRequestsTab from "./tabs/AddressRequestsTab";

const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Overzicht</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Gebruikers</span>
        </TabsTrigger>
        <TabsTrigger value="requests" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">Aanvragen</span>
        </TabsTrigger>
        <TabsTrigger value="data" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span className="hidden sm:inline">Data</span>
        </TabsTrigger>
        <TabsTrigger value="logs" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Logs</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Instellingen</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <OverviewTab />
      </TabsContent>

      <TabsContent value="users" className="mt-6">
        <UsersTab />
      </TabsContent>

      <TabsContent value="requests" className="mt-6">
        <AddressRequestsTab />
      </TabsContent>

      <TabsContent value="data" className="mt-6">
        <DataTab />
      </TabsContent>

      <TabsContent value="logs" className="mt-6">
        <LogsTab />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
