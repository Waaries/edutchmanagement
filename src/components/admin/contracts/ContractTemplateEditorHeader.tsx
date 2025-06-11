
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

interface ContractTemplateEditorHeaderProps {
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const ContractTemplateEditorHeader: React.FC<ContractTemplateEditorHeaderProps> = ({
  onBack,
  onSave,
  isSaving
}) => {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Terug naar sjablonen
      </Button>
      
      <div className="flex items-center gap-2">
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Bezig met opslaan...' : 'Opslaan'}
        </Button>
      </div>
    </div>
  );
};

export default ContractTemplateEditorHeader;
