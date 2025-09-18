import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AccessLog {
  id: string;
  access_token: string | null;
  ip_address: unknown | null;
  user_agent: string | null;
  success: boolean;
  attempted_at: string;
  error_reason: string | null;
}

export default function ContractAccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccessLogs();
  }, []);

  const fetchAccessLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_access_logs')
        .select('*')
        .order('attempted_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching access logs:', err);
      setError('Failed to load access logs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="default" className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Success
      </Badge>
    ) : (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        Failed
      </Badge>
    );
  };

  const failedAttempts = logs.filter(log => !log.success).length;
  const recentFailures = logs.filter(log => 
    !log.success && 
    new Date(log.attempted_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract Access Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading access logs...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract Access Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recentFailures > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {recentFailures} failed access attempts in the last 24 hours. Monitor for potential security threats.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Contract Access Logs
            <div className="flex gap-2">
              <Badge variant="outline">
                Total: {logs.length}
              </Badge>
              <Badge variant="destructive">
                Failed: {failedAttempts}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {logs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No access logs found
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(log.success)}
                        <span className="text-sm font-mono">
                          Token: {log.access_token || 'N/A'}
                        </span>
                      </div>
                      
                      {log.error_reason && (
                        <div className="text-sm text-destructive">
                          {log.error_reason}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {formatDate(log.attempted_at)}
                        {log.ip_address && ` • IP: ${log.ip_address}`}
                      </div>
                      
                      {log.user_agent && (
                        <div className="text-xs text-muted-foreground truncate max-w-md">
                          {log.user_agent}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}