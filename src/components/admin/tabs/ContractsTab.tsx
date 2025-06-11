
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Users, Settings } from "lucide-react";
import ContractTemplatesView from "../contracts/ContractTemplatesView";
import ContractTemplateEditor from "../contracts/ContractTemplateEditor";
import FilledContractsView from "../contracts/FilledContractsView";

const ContractsTab = () => {
  const [activeView, setActiveView] = useState<'templates' | 'editor' | 'filled'>('templates');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setActiveView('editor');
  };

  const handleEditTemplate = (templateId: string) => {
    setEditingTemplate(templateId);
    setActiveView('editor');
  };

  const handleBackToTemplates = () => {
    setActiveView('templates');
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contract Management</h2>
          <p className="text-muted-foreground">
            Beheer contractsjablonen en bekijk ingevulde contracten
          </p>
        </div>
        {activeView === 'templates' && (
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nieuw sjabloon
          </Button>
        )}
      </div>

      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Sjablonen
          </TabsTrigger>
          <TabsTrigger value="filled" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Ingevulde contracten
          </TabsTrigger>
          <TabsTrigger value="editor" disabled={activeView !== 'editor'} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <ContractTemplatesView 
            onEditTemplate={handleEditTemplate}
            onCreateNew={handleCreateNew}
          />
        </TabsContent>

        <TabsContent value="filled" className="mt-6">
          <FilledContractsView />
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          <ContractTemplateEditor 
            templateId={editingTemplate}
            onBack={handleBackToTemplates}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractsTab;
