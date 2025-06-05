
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./tabs/OverviewTab";
import EnhancedAddressRequestsTab from "./tabs/EnhancedAddressRequestsTab";
import UsersTab from "./tabs/UsersTab";
import DataTab from "./tabs/DataTab";
import SettingsTab from "./tabs/SettingsTab";
import LogsTab from "./tabs/LogsTab";

const AdminTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overzicht</TabsTrigger>
        <TabsTrigger value="requests">Aanvragen</TabsTrigger>
        <TabsTrigger value="users">Gebruikers</TabsTrigger>
        <TabsTrigger value="data">Data</TabsTrigger>
        <TabsTrigger value="settings">Instellingen</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6">
        <OverviewTab />
      </TabsContent>
      
      <TabsContent value="requests" className="mt-6">
        <EnhancedAddressRequestsTab />
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
