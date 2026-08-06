import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import OverviewTab from "./tabs/OverviewTab";
import UsersTab from "./tabs/UsersTab";
import AddressRequestsTab from "./tabs/AddressRequestsTab";
import ContactMessagesTab from "./tabs/ContactMessagesTab";
import ContractsTab from "./tabs/ContractsTab";
import MailTab from "./tabs/MailTab";
import LogsTab from "./tabs/LogsTab";
import MonitoringTab from "./tabs/MonitoringTab";
import SecurityTab from "./tabs/SecurityTab";
import SecurityAuditTab from "./tabs/SecurityAuditTab";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Shield,
  ClipboardList,
  Building2,
  MessageSquare,
  FileText,
  Mail,
  ScrollText,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { value: "overview", label: "Overzicht", icon: LayoutDashboard },
  { value: "users", label: "Gebruikers", icon: Users },
  { value: "mail", label: "Post", icon: Mail },
  { value: "security", label: "Beveiliging", icon: Shield },
  { value: "audit", label: "Audit", icon: ClipboardList },
  { value: "requests", label: "Aanvragen", icon: Building2 },
  { value: "messages", label: "Berichten", icon: MessageSquare },
  { value: "contracts", label: "Contracten", icon: FileText },
  { value: "logs", label: "Logs", icon: ScrollText },
  { value: "monitoring", label: "Monitoring", icon: Activity },
];


const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tabValue: string) => setActiveTab(tabValue);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      orientation="vertical"
      className="flex flex-col lg:flex-row gap-6"
    >
      {/* Vertical sidebar nav */}
      <aside className="lg:w-64 lg:shrink-0">
        <div className="lg:sticky lg:top-20 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-3">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Admin secties
          </p>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-left w-full",
                    active
                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/10 text-blue-200 border border-blue-500/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Card className="bg-slate-900/60 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab onTabChange={handleTabChange} />
            </TabsContent>
            <TabsContent value="users" className="mt-0"><UsersTab /></TabsContent>
            <TabsContent value="security" className="mt-0"><SecurityTab /></TabsContent>
            <TabsContent value="audit" className="mt-0"><SecurityAuditTab /></TabsContent>
            <TabsContent value="requests" className="mt-0"><AddressRequestsTab /></TabsContent>
            <TabsContent value="messages" className="mt-0"><ContactMessagesTab /></TabsContent>
            <TabsContent value="contracts" className="mt-0"><ContractsTab /></TabsContent>
            <TabsContent value="data" className="mt-0"><DataTab /></TabsContent>
            <TabsContent value="logs" className="mt-0"><LogsTab /></TabsContent>
            <TabsContent value="monitoring" className="mt-0"><MonitoringTab /></TabsContent>
            <TabsContent value="settings" className="mt-0"><SettingsTab /></TabsContent>
          </CardContent>
        </Card>
      </div>
    </Tabs>
  );
};

export default AdminTabs;
