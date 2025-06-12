
import React, { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useContractTemplateEditor } from "@/hooks/use-contract-template-editor";
import ContractTemplateEditorHeader from "./ContractTemplateEditorHeader";
import ContractTemplateEditorTabs from "./ContractTemplateEditorTabs";
import ContractTemplateEditorContent from "./ContractTemplateEditorContent";

interface ContractTemplateEditorProps {
  templateId: string | null;
  onBack: () => void;
}

const ContractTemplateEditor: React.FC<ContractTemplateEditorProps> = ({ 
  templateId, 
  onBack 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  
  const {
    template,
    setTemplate,
    fields,
    addField,
    updateField,
    removeField,
    saveMutation,
    syncFieldsManually
  } = useContractTemplateEditor(templateId);

  const handleGenerationComplete = () => {
    setActiveTab("basic");
    toast({
      title: "Contract verzonden",
      description: "Het contract is succesvol naar de klant verzonden.",
    });
  };

  return (
    <div className="space-y-6">
      <ContractTemplateEditorHeader
        onBack={onBack}
        onSave={() => saveMutation.mutate()}
        isSaving={saveMutation.isPending}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ContractTemplateEditorTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          templateId={templateId}
        />

        <ContractTemplateEditorContent
          template={template}
          fields={fields}
          templateId={templateId}
          onTemplateChange={setTemplate}
          onAddField={addField}
          onUpdateField={updateField}
          onRemoveField={removeField}
          onGenerationComplete={handleGenerationComplete}
          onSyncFields={syncFieldsManually}
        />
      </Tabs>
    </div>
  );
};

export default ContractTemplateEditor;
