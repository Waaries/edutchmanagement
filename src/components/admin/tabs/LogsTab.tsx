import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDutchDate } from "@/lib/date-utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  success: boolean;
  error_message: string | null;
  user_id: string | null;
  created_at: string;
}

const LogsTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const logsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("security_audit_logs")
          .select("id, action, resource_type, resource_id, success, error_message, user_id, created_at")
          .order("created_at", { ascending: false })
          .limit(200);

        if (error) throw error;
        setLogs((data ?? []) as AuditLog[]);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activiteitenlog</CardTitle>
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
        <CardTitle>Activiteitenlog</CardTitle>
        <CardDescription>Systeem- en beveiligingsacties uit de audit logs</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Audit informatie</AlertTitle>
          <AlertDescription>
            Dit logboek toont de laatste 200 vastgelegde acties in het systeem.
          </AlertDescription>
        </Alert>

        <div className="rounded-md border border-white/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Actie</TableHead>
                <TableHead className="hidden md:table-cell">Resource</TableHead>
                <TableHead>Resultaat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {formatDutchDate(log.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-500/15 text-blue-300 border-blue-500/30">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {log.resource_type}
                    {log.resource_id ? ` · ${log.resource_id.slice(0, 12)}` : ""}
                  </TableCell>
                  <TableCell>
                    {log.success ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      >
                        Gelukt
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-500/15 text-red-300 border-red-500/30"
                        title={log.error_message ?? undefined}
                      >
                        Mislukt
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-slate-400">
                    Geen activiteiten gevonden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {logs.length > logsPerPage && (
          <Pagination className="mt-4">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages })
                .map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
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
                })
                .filter(Boolean)}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
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
