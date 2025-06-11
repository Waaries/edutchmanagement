
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Eye, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ContractTemplate {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

interface ContractTemplatesViewProps {
  onEditTemplate: (templateId: string) => void;
  onCreateNew: () => void;
}

const ContractTemplatesView: React.FC<ContractTemplatesViewProps> = ({ 
  onEditTemplate, 
  onCreateNew 
}) => {
  const { toast } = useToast();

  const { data: templates, loading, refetch } = useQuery({
    queryKey: ['contract-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contract_templates')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as ContractTemplate[];
    }
  });

  const handleDelete = async (templateId: string, title: string) => {
    if (!confirm(`Weet je zeker dat je het sjabloon "${title}" wilt verwijderen?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contract_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: "Sjabloon verwijderd",
        description: `Het sjabloon "${title}" is succesvol verwijderd.`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Fout bij verwijderen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      case 'archived': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actief';
      case 'draft': return 'Concept';
      case 'inactive': return 'Inactief';
      case 'archived': return 'Gearchiveerd';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Geen contractsjablonen</h3>
            <p className="text-muted-foreground mb-4">
              Je hebt nog geen contractsjablonen aangemaakt.
            </p>
            <Button onClick={onCreateNew}>
              Eerste sjabloon aanmaken
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <CardDescription className="mt-1">
                  {template.description || 'Geen beschrijving'}
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(template.status)} text-white`}>
                {getStatusLabel(template.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Gemaakt: {new Date(template.created_at).toLocaleDateString('nl-NL')}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditTemplate(template.id)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Bewerken
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(template.id, template.title)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContractTemplatesView;
