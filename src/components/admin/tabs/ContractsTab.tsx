
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, Edit, Zap } from "lucide-react";
import FilledContractsView from "../contracts/FilledContractsView";
import ContractGenerator from "../contracts/ContractGenerator";
import SingleContractEditor from "../contracts/SingleContractEditor";

const ContractsTab = () => {
  const [activeView, setActiveView] = useState<'contract' | 'filled' | 'generator'>('contract');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contract Beheer</h2>
          <p className="text-muted-foreground">
            Beheer uw contract en bekijk ingevulde contracten
          </p>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contract" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contract Editor
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Contract Genereren
          </TabsTrigger>
          <TabsTrigger value="filled" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Ingevulde Contracten
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contract" className="mt-6">
          <SingleContractEditor />
        </TabsContent>

        <TabsContent value="generator" className="mt-6">
          <ContractGenerator />
        </TabsContent>

        <TabsContent value="filled" className="mt-6">
          <FilledContractsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractsTab;
