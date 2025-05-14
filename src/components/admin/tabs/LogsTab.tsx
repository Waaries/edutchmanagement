
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDutchDate } from "@/lib/date-utils";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface AdminLog {
  id: string;
  action: string;
  description: string;
  performed_by: string;
  created_at: string;
  user_email?: string;
  action_type: 'create' | 'update' | 'delete' | 'login' | 'other';
}

const LogsTab: React.FC = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const logsPerPage = 10;
  
  // Mock log data (in a real application, this would come from the database)
  const mockLogs: AdminLog[] = [
    {
      id: "1",
      action: "Gebruiker beheerd",
      description: "Admin privileges toegekend aan gebruiker john@example.com",
      performed_by: "admin@example.com",
      created_at: new Date().toISOString(),
      user_email: "john@example.com",
      action_type: "update"
    },
    {
      id: "2",
      action: "Ingelogd",
      description: "Admin login",
      performed_by: "admin@example.com",
      created_at: new Date(Date.now() - 60000).toISOString(),
      action_type: "login"
    },
    {
      id: "3",
      action: "Gebruiker verwijderd",
      description: "Gebruiker mary@example.com verwijderd",
      performed_by: "admin@example.com",
      created_at: new Date(Date.now() - 120000).toISOString(),
      user_email: "mary@example.com",
      action_type: "delete"
    },
    {
      id: "4",
      action: "Systeem instellingen aangepast",
      description: "E-mail notificatie instellingen gewijzigd",
      performed_by: "admin@example.com",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      action_type: "update"
    },
    {
      id: "5",
      action: "Nieuwe gebruiker aangemaakt",
      description: "Nieuwe gebruiker peter@example.com aangemaakt",
      performed_by: "system",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      user_email: "peter@example.com",
      action_type: "create"
    },
    {
      id: "6",
      action: "Admin rechten ingetrokken",
      description: "Admin privileges ingetrokken van alice@example.com",
      performed_by: "admin@example.com",
      created_at: new Date(Date.now() - 172800000).toISOString(),
      user_email: "alice@example.com",
      action_type: "update"
    },
    {
      id: "7",
      action: "Database backup",
      description: "Automatische database backup uitgevoerd",
      performed_by: "system",
      created_at: new Date(Date.now() - 259200000).toISOString(),
      action_type: "other"
    },
    {
      id: "8",
      action: "Error gelogd",
      description: "Database connectie fout gedetecteerd",
      performed_by: "system",
      created_at: new Date(Date.now() - 345600000).toISOString(),
      action_type: "other"
    },
    {
      id: "9",
      action: "Ingelogd",
      description: "Admin login",
      performed_by: "admin@example.com",
      created_at: new Date(Date.now() - 432000000).toISOString(),
      action_type: "login"
    },
    {
      id: "10",
      action: "Configuratie aangepast",
      description: "API sleutels vernieuwd",
      performed_by: "admin@example.com",
      created_at: new Date(Date.now() - 518400000).toISOString(),
      action_type: "update"
    },
    {
      id: "11",
      action: "Ingelogd",
      description: "Admin login",
      performed_by: "admin@example.com",
      created_at: new Date(Date.now() - 604800000).toISOString(),
      action_type: "login"
    },
    {
      id: "12",
      action: "Nieuwe gebruiker aangemaakt",
      description: "Nieuwe gebruiker thomas@example.com aangemaakt",
      performed_by: "system",
      created_at: new Date(Date.now() - 691200000).toISOString(),
      user_email: "thomas@example.com",
      action_type: "create"
    }
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        
        // In a real application you would retrieve logs from Supabase
        // For now, we'll use our mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLogs(mockLogs);
      } catch (error) {
        console.error("Error fetching admin logs:", error);
        toast({
          title: "Fout bij ophalen logboek",
          description: "Er is een fout opgetreden bij het laden van de activiteiten.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);
  
  // Calculate pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);
  
  // Get badge color based on action type
  const getBadgeVariant = (actionType: string) => {
    switch (actionType) {
      case 'create': return "outline";
      case 'update': return "secondary";
      case 'delete': return "destructive";
      case 'login': return "default";
      default: return "";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Activiteitenlog</CardTitle>
          <CardDescription>Bezig met laden...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Activiteitenlog</CardTitle>
        <CardDescription>Overzicht van administratieve acties</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Audit informatie</AlertTitle>
          <AlertDescription>
            Dit logboek toont alle administratieve acties uitgevoerd in het systeem.
            Dit helpt bij het bijhouden en controleren van administratieve wijzigingen.
          </AlertDescription>
        </Alert>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Actie</TableHead>
                <TableHead className="hidden md:table-cell">Beschrijving</TableHead>
                <TableHead>Uitgevoerd door</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{formatDutchDate(log.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={getBadgeVariant(log.action_type) as any}>
                        {log.action}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {log.description}
                  </TableCell>
                  <TableCell>{log.performed_by}</TableCell>
                </TableRow>
              ))}
              
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Geen activiteiten gevonden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {logs.length > logsPerPage && (
          <Pagination className="mt-4">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                // Show first, last and pages around current page
                if (page === 1 || page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              }).filter(Boolean)}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};

export default LogsTab;
