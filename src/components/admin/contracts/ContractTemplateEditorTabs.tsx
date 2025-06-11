
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Send } from "lucide-react";

interface ContractTemplateEditorTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  templateId: string | null;
}

const ContractTemplateEditorTabs: React.FC<ContractTemplateEditorTabsProps> = ({
  activeTab,
  onTabChange,
  templateId
}) => {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="basic">Basis Info</TabsTrigger>
      <TabsTrigger value="fields">Velden</TabsTrigger>
      <TabsTrigger value="preview">
        <Eye className="h-4 w-4 mr-1" />
        Preview
      </TabsTrigger>
      <TabsTrigger value="generate" disabled={!templateId}>
        <Send className="h-4 w-4 mr-1" />
        Genereren
      </TabsTrigger>
    </TabsList>
  );
};

export default ContractTemplateEditorTabs;
