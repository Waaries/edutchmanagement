
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Zap } from "lucide-react";
import DutchAddressTemplateCreator from "./DutchAddressTemplateCreator";

interface ContractTemplateQuickStartProps {
  onCreateNew: () => void;
  onTemplateCreated: () => void;
}

const ContractTemplateQuickStart: React.FC<ContractTemplateQuickStartProps> = ({
  onCreateNew,
  onTemplateCreated
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Snelle Start
          </CardTitle>
          <CardDescription>
            Begin snel met voorgedefinieerde sjablonen of maak uw eigen sjabloon vanaf nul
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={onCreateNew}
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-2"
            >
              <Plus className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Nieuw Sjabloon</div>
                <div className="text-sm text-muted-foreground">
                  Maak een sjabloon vanaf nul
                </div>
              </div>
            </Button>

            <div className="border rounded-lg p-6 bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <div className="font-medium">Aanbevolen Sjabloon</div>
              </div>
              <div className="text-sm text-slate-400 mb-4">
                Professioneel Nederlands contract voor bedrijfsadres dienstverlening
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DutchAddressTemplateCreator onTemplateCreated={onTemplateCreated} />
    </div>
  );
};

export default ContractTemplateQuickStart;
