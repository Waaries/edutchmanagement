
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Download, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FilledContract {
  id: string;
  template_id: string;
  client_email: string;
  client_name: string | null;
  status: string;
  filled_data: any;
  created_at: string;
  completed_at: string | null;
  contract_templates: {
    title: string;
  };
}

const FilledContractsView = () => {
  const { data: filledContracts, loading } = useQuery({
    queryKey: ['filled-contracts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('filled_contracts')
        .select(`
          *,
          contract_templates!inner(title)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FilledContract[];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'signed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Voltooid';
      case 'pending': return 'In behandeling';
      case 'signed': return 'Ondertekend';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!filledContracts || filledContracts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Geen ingevulde contracten</h3>
            <p className="text-muted-foreground">
              Er zijn nog geen contracten ingevuld door klanten.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filledContracts.map((contract) => (
        <Card key={contract.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {contract.contract_templates.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  Klant: {contract.client_name || contract.client_email}
                </CardDescription>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Aangemaakt: {new Date(contract.created_at).toLocaleDateString('nl-NL')}</span>
                  {contract.completed_at && (
                    <span>Voltooid: {new Date(contract.completed_at).toLocaleDateString('nl-NL')}</span>
                  )}
                </div>
              </div>
              <Badge className={`${getStatusColor(contract.status)} text-white`}>
                {getStatusLabel(contract.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Bekijken
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                Downloaden
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                E-mail versturen
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FilledContractsView;
