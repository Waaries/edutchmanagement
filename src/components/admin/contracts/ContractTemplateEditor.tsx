
import React, { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useContractTemplateEditor } from "@/hooks/use-contract-template-editor";
import ContractTemplateEditorHeader from "./ContractTemplateEditorHeader";
import ContractTemplateEditorTabs from "./ContractTemplateEditorTabs";
import ContractTemplateEditorContent from "./ContractTemplateEditorContent";
import { useQueryClient } from "@tanstack/react-query";

interface ContractTemplateEditorProps {
  templateId: string | null;
  onBack: () => void;
}

const ContractTemplateEditor: React.FC<ContractTemplateEditorProps> = ({ 
  templateId, 
  onBack 
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const handleTemplateUpdated = () => {
    // Refresh the template data after Dutch template is applied
    queryClient.invalidateQueries({ queryKey: ['contract-template', templateId] });
    queryClient.invalidateQueries({ queryKey: ['contract-template-fields', templateId] });
    queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
    
    // Switch to the basic tab to see the updated content
    setActiveTab("basic");
    
    toast({
      title: "Sjabloon bijgewerkt",
      description: "Het sjabloon is succesvol bijgewerkt. De pagina wordt ververst om de wijzigingen te tonen.",
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
          onTemplateUpdated={handleTemplateUpdated}
        />
      </Tabs>
    </div>
  );
};

export default ContractTemplateEditor;
