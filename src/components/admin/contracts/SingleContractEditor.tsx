import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Edit, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ContractData {
  id?: string;
  title: string;
  description: string;
  content: string;
}

const SingleContractEditor: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [contract, setContract] = useState<ContractData>({
    title: "Bedrijfsadres Service Contract",
    description: "Standaard contract voor bedrijfsadres diensten",
    content: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch the existing contract (we'll use the first one available)
  const { data: existingContract, isLoading } = useQuery({
    queryKey: ['single-contract'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contract_templates')
        .select('*')
        .eq('status', 'active')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Not found is ok
        throw error;
      }
      
      return data;
    }
  });

  // Update local state when contract is loaded
  useEffect(() => {
    if (existingContract) {
      setContract({
        id: existingContract.id,
        title: existingContract.title,
        description: existingContract.description || "",
        content: existingContract.content
      });
    }
  }, [existingContract]);

  // Save contract mutation
  const saveMutation = useMutation({
    mutationFn: async (contractData: ContractData) => {
      if (contractData.id) {
        // Update existing contract
        const { error } = await supabase
          .from('contract_templates')
          .update({
            title: contractData.title,
            description: contractData.description,
            content: contractData.content,
            status: 'active'
          })
          .eq('id', contractData.id);
        
        if (error) throw error;
      } else {
        // Create new contract
        const { data, error } = await supabase
          .from('contract_templates')
          .insert({
            title: contractData.title,
            description: contractData.description,
            content: contractData.content,
            status: 'active',
            created_by: (await supabase.auth.getUser()).data.user?.id
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setContract(prev => ({ ...prev, id: data.id }));
      }
    },
    onSuccess: () => {
      toast({
        title: "Contract opgeslagen",
        description: "Het contract is succesvol bijgewerkt.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['single-contract'] });
    },
    onError: (error) => {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van het contract.",
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  });

  const handleSave = () => {
    if (!contract.title.trim() || !contract.content.trim()) {
      toast({
        title: "Validatiefout",
        description: "Titel en inhoud zijn verplicht.",
        variant: "destructive",
      });
      return;
    }
    
    saveMutation.mutate(contract);
  };

  const handleCancel = () => {
    // Reset to original values
    if (existingContract) {
      setContract({
        id: existingContract.id,
        title: existingContract.title,
        description: existingContract.description || "",
        content: existingContract.content
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Contract Editor
              </CardTitle>
              <CardDescription>
                Bewerk uw standaard contract voor bedrijfsadres diensten
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saveMutation.isPending}
                  >
                    Annuleren
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saveMutation.isPending ? 'Bezig met opslaan...' : 'Opslaan'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Bewerken
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Contract Titel</Label>
            <Input
              id="title"
              value={contract.title}
              onChange={(e) => setContract(prev => ({ ...prev, title: e.target.value }))}
              disabled={!isEditing}
              placeholder="Bijv. Bedrijfsadres Service Contract"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschrijving</Label>
            <Input
              id="description"
              value={contract.description}
              onChange={(e) => setContract(prev => ({ ...prev, description: e.target.value }))}
              disabled={!isEditing}
              placeholder="Korte beschrijving van het contract"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contract Inhoud</Label>
            <Textarea
              id="content"
              value={contract.content}
              onChange={(e) => setContract(prev => ({ ...prev, content: e.target.value }))}
              disabled={!isEditing}
              placeholder="Voer hier de volledige contracttekst in..."
              className="min-h-[400px] font-mono text-sm"
            />
            {isEditing && (
              <p className="text-xs text-muted-foreground">
                Tip: Gebruik placeholders zoals {"{{bedrijfsnaam}}"} voor variabele velden
              </p>
            )}
          </div>

          {!isEditing && contract.content && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Preview</span>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm">{contract.content}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleContractEditor;