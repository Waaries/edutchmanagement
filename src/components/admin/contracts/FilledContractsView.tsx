import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Download, Mail, Search, Filter, CheckCircle, Clock, FileText, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatDateTime } from "@/lib/utils";
import FilledContractViewer from "./FilledContractViewer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FilledContract {
  id: string;
  template_id: string;
  user_id: string | null;
  client_email: string;
  client_name: string | null;
  status: string;
  filled_data: any;
  created_at: string;
  completed_at: string | null;
  access_token: string;
  contract_templates: {
    title: string;
    content: string;
  };
}

const FilledContractsView = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState<FilledContract | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const { data: filledContracts, isLoading } = useQuery({
    queryKey: ['filled-contracts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('filled_contracts')
        .select(`
          *,
          contract_templates!inner(title, content)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FilledContract[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ contractId, status }: { contractId: string; status: string }) => {
      const updateData: any = { status };
      
      if (status === 'completed' || status === 'signed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('filled_contracts')
        .update(updateData)
        .eq('id', contractId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Status bijgewerkt",
        description: "De contractstatus is succesvol bijgewerkt.",
      });
      queryClient.invalidateQueries({ queryKey: ['filled-contracts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Fout bij bijwerken",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteContractMutation = useMutation({
    mutationFn: async (contractId: string) => {
      const { error } = await supabase
        .from('filled_contracts')
        .delete()
        .eq('id', contractId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Contract verwijderd",
        description: "Het contract is succesvol verwijderd.",
      });
      queryClient.invalidateQueries({ queryKey: ['filled-contracts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Fout bij verwijderen",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const filteredContracts = filledContracts?.filter(contract => {
    const matchesSearch = !searchTerm || 
      contract.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contract_templates.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'signed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-white/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Voltooid';
      case 'pending': return 'In behandeling';
      case 'signed': return 'Ondertekend';
      case 'cancelled': return 'Geannuleerd';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'signed': return CheckCircle;
      case 'pending': return Clock;
      default: return FileText;
    }
  };

  const generateContractLink = (accessToken: string) => {
    return `${window.location.origin}/contract/${accessToken}`;
  };

  const handleViewContract = (contract: FilledContract) => {
    setSelectedContract(contract);
    setViewerOpen(true);
  };

  const handleDownloadContract = (contract: FilledContract) => {
    setSelectedContract(contract);
    setViewerOpen(true);
    // The download will be triggered from within the viewer
  };

  const handleDeleteContract = (contractId: string) => {
    deleteContractMutation.mutate(contractId);
  };

  if (isLoading) {
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
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
                  placeholder="Zoek op naam, email of sjabloon..."
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
                <SelectItem value="pending">In behandeling</SelectItem>
                <SelectItem value="completed">Voltooid</SelectItem>
                <SelectItem value="signed">Ondertekend</SelectItem>
                <SelectItem value="cancelled">Geannuleerd</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts?.map((contract) => {
          const StatusIcon = getStatusIcon(contract.status);
          
          return (
            <Card key={contract.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <StatusIcon className="h-5 w-5" />
                      {contract.contract_templates.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <div className="space-y-1">
                        <div>Klant: {contract.client_name || contract.client_email}</div>
                        {!contract.user_id && (
                          <div className="text-xs text-amber-600">Verwijderde klant — account bestaat niet meer</div>
                        )}

                          <span>Aangemaakt: {formatDate(contract.created_at)}</span>
                          {contract.completed_at && (
                            <span>Voltooid: {formatDate(contract.completed_at)}</span>
                          )}
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getStatusColor(contract.status)} text-white`}>
                      {getStatusLabel(contract.status)}
                    </Badge>
                    <Select
                      value={contract.status}
                      onValueChange={(status) => updateStatusMutation.mutate({ 
                        contractId: contract.id, 
                        status 
                      })}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">In behandeling</SelectItem>
                        <SelectItem value="completed">Voltooid</SelectItem>
                        <SelectItem value="signed">Ondertekend</SelectItem>
                        <SelectItem value="cancelled">Geannuleerd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Contract Data Preview */}
                {Object.keys(contract.filled_data).length > 0 && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Ingevulde gegevens:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(contract.filled_data).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">{String(value)}</span>
                        </div>
                      ))}
                      {Object.keys(contract.filled_data).length > 4 && (
                        <div className="text-muted-foreground text-xs col-span-2">
                          ... en {Object.keys(contract.filled_data).length - 4} meer
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleViewContract(contract)}
                  >
                    <Eye className="h-3 w-3" />
                    Bekijken
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleDownloadContract(contract)}
                  >
                    <Download className="h-3 w-3" />
                    PDF downloaden
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => {
                      navigator.clipboard.writeText(generateContractLink(contract.access_token));
                      toast({
                        title: "Link gekopieerd",
                        description: "De contractlink is naar het klembord gekopieerd.",
                      });
                    }}
                  >
                    <Mail className="h-3 w-3" />
                    Deel link
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Verwijderen
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Contract verwijderen</AlertDialogTitle>
                        <AlertDialogDescription>
                          Weet je zeker dat je dit contract wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                          <br />
                          <strong>Contract:</strong> {contract.contract_templates.title}
                          <br />
                          <strong>Klant:</strong> {contract.client_name || contract.client_email}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteContract(contract.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Verwijderen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No results found */}
      {filteredContracts?.length === 0 && filledContracts?.length > 0 && (
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

      {/* Contract Viewer Modal */}
      <FilledContractViewer
        contract={selectedContract}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </div>
  );
};

export default FilledContractsView;
