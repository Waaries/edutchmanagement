
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings, Eye, Send } from "lucide-react";

interface ContractTemplateEditorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  templateId: string | null;
}

const ContractTemplateEditorTabs: React.FC<ContractTemplateEditorTabsProps> = ({
  activeTab,
  onTabChange,
  templateId
}) => {
  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="basic" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Basis
      </TabsTrigger>
      <TabsTrigger value="fields" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Velden
      </TabsTrigger>
      <TabsTrigger value="preview" className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        Voorbeeld
      </TabsTrigger>
      <TabsTrigger value="apply-dutch" className="flex items-center gap-2" disabled={!templateId}>
        <FileText className="h-4 w-4" />
        NL Contract
      </TabsTrigger>
      <TabsTrigger value="generate" className="flex items-center gap-2" disabled={!templateId}>
        <Send className="h-4 w-4" />
        Genereren
      </TabsTrigger>
    </TabsList>
  );
};

export default ContractTemplateEditorTabs;
