
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Database, Settings } from "lucide-react";
import OverviewTab from "@/components/admin/tabs/OverviewTab";
import UsersTab from "@/components/admin/tabs/UsersTab";
import DataTab from "@/components/admin/tabs/DataTab";
import SettingsTab from "@/components/admin/tabs/SettingsTab";

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Overzicht</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Gebruikers</span>
        </TabsTrigger>
        <TabsTrigger value="data" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span>Gegevens</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Instellingen</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTab onTabChange={setActiveTab} />
      </TabsContent>
      
      <TabsContent value="users">
        <UsersTab />
      </TabsContent>
      
      <TabsContent value="data">
        <DataTab />
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
