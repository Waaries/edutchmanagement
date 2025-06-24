
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OverviewTab from "./tabs/OverviewTab";
import UsersTab from "./tabs/UsersTab";
import AddressRequestsTab from "./tabs/AddressRequestsTab";
import ContactMessagesTab from "./tabs/ContactMessagesTab";
import ContractsTab from "./tabs/ContractsTab";
import DataTab from "./tabs/DataTab";
import LogsTab from "./tabs/LogsTab";
import SettingsTab from "./tabs/SettingsTab";
import MonitoringTab from "./tabs/MonitoringTab";
import { useState } from "react";

const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administratie Dashboard</CardTitle>
        <CardDescription>Beheer uw systeem en bekijk statistieken</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="users">Gebruikers</TabsTrigger>
            <TabsTrigger value="requests">Aanvragen</TabsTrigger>
            <TabsTrigger value="messages">Berichten</TabsTrigger>
            <TabsTrigger value="contracts">Contracten</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="settings">Instellingen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab onTabChange={handleTabChange} />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          
          <TabsContent value="requests">
            <AddressRequestsTab />
          </TabsContent>
          
          <TabsContent value="messages">
            <ContactMessagesTab />
          </TabsContent>
          
          <TabsContent value="contracts">
            <ContractsTab />
          </TabsContent>
          
          <TabsContent value="data">
            <DataTab />
          </TabsContent>
          
          <TabsContent value="logs">
            <LogsTab />
          </TabsContent>
          
          <TabsContent value="monitoring">
            <MonitoringTab />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminTabs;
