import PageHeader from "./PageHeader";
import AdminMailTab from "@/components/admin/tabs/MailTab";
import AdminAddressRequestsTab from "@/components/admin/tabs/AddressRequestsTab";
import ContractsTab from "@/components/admin/tabs/ContractsTab";
import SecurityTab from "@/components/admin/tabs/SecurityTab";
import SecurityAuditTab from "@/components/admin/tabs/SecurityAuditTab";
import LogsTab from "@/components/admin/tabs/LogsTab";
import MonitoringTab from "@/components/admin/tabs/MonitoringTab";
import ContactMessagesTab from "@/components/admin/tabs/ContactMessagesTab";

const page = (title: string, description: string, Component: React.ComponentType) => {
  const Page = () => (
    <div>
      <PageHeader title={title} description={description} />
      <Component />
    </div>
  );
  Page.displayName = `BeheerPage(${title})`;
  return Page;
};

export const PostPage = page("Post", "Registreer en beheer binnengekomen post", AdminMailTab);
export const AanvragenPage = page("Aanvragen", "Adresaanvragen behandelen", AdminAddressRequestsTab);
export const ContractenPage = page("Contracten", "Contracten opstellen en opvolgen", ContractsTab);

export const BeveiligingPage = page("Beveiliging", "Systeembeveiliging en instellingen", SecurityTab);
export const AuditPage = page("Audit", "Auditlogboek van gevoelige acties", SecurityAuditTab);
export const LogsPage = page("Logs", "Systeem- en beveiligingslogboeken", LogsTab);
export const MonitoringPage = page("Monitoring", "Prestaties en beschikbaarheid", MonitoringTab);
export const BerichtenPage = page("Berichten", "Contactberichten van de website", ContactMessagesTab);
