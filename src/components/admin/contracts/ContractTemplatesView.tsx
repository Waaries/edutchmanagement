
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Eye, Trash2, Search, Filter, FileText, Users, Calendar, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

interface ContractTemplate {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
  _count?: {
    filled_contracts: number;
  };
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
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: templates, isLoading, refetch } = useQuery({
    queryKey: ['contract-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contract_templates')
        .select(`
          *,
          filled_contracts(count)
        `)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to include contract counts
      return data.map(template => ({
        ...template,
        _count: {
          filled_contracts: template.filled_contracts?.length || 0
        }
      })) as ContractTemplate[];
    }
  });

  const duplicateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      // Get the template to duplicate
      const { data: template, error: templateError } = await supabase
        .from('contract_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      // Create new template
      const { data: newTemplate, error: newTemplateError } = await supabase
        .from('contract_templates')
        .insert({
          title: `${template.title} (Kopie)`,
          description: template.description,
          content: template.content,
          status: 'draft',
          created_by: template.created_by
        })
        .select()
        .single();

      if (newTemplateError) throw newTemplateError;

      // Get fields to duplicate
      const { data: fields, error: fieldsError } = await supabase
        .from('contract_template_fields')
        .select('*')
        .eq('template_id', templateId);

      if (fieldsError) throw fieldsError;

      // Create new fields
      if (fields && fields.length > 0) {
        const newFields = fields.map(field => ({
          ...field,
          id: undefined,
          template_id: newTemplate.id
        }));

        const { error: newFieldsError } = await supabase
          .from('contract_template_fields')
          .insert(newFields);

        if (newFieldsError) throw newFieldsError;
      }

      return newTemplate;
    },
    onSuccess: () => {
      toast({
        title: "Sjabloon gedupliceerd",
        description: "Het sjabloon is succesvol gekopieerd.",
      });
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
    },
    onError: (error: any) => {
      toast({
        title: "Fout bij dupliceren",
        description: error.message,
        variant: "destructive",
      });
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

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = !searchTerm || 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  if (isLoading) {
    return (
      <div className="space-y-6">
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
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Zoeken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op titel of beschrijving..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter op status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statussen</SelectItem>
                <SelectItem value="active">Actief</SelectItem>
                <SelectItem value="draft">Concept</SelectItem>
                <SelectItem value="inactive">Inactief</SelectItem>
                <SelectItem value="archived">Gearchiveerd</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates?.map((template) => (
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
              <div className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{template._count?.filled_contracts || 0} contracten</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(template.created_at)}</span>
                  </div>
                </div>
                
                {/* Actions */}
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
                    onClick={() => duplicateMutation.mutate(template.id)}
                    disabled={duplicateMutation.isPending}
                  >
                    <Copy className="h-3 w-3" />
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

      {filteredTemplates?.length === 0 && templates?.length > 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Geen resultaten gevonden</h3>
              <p className="text-muted-foreground">
                Probeer een andere zoekterm of filter.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractTemplatesView;
