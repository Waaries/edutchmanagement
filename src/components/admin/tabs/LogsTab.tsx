
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
  
  // No test data - will be populated from database in future implementation
  const mockLogs: AdminLog[] = [];

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
