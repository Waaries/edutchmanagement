import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw, Eye, Clock, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  error_message: string | null;
  metadata: any;
  created_at: string;
}

interface SecurityTest {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  description: string;
  error?: string;
  details?: string;
}

interface TestResults {
  timestamp: string;
  tests: SecurityTest[];
  overall_status: 'SECURE' | 'MOSTLY_SECURE' | 'VULNERABLE';
}

const SecurityAuditTab: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('24h');
  const [resourceFilter, setResourceFilter] = useState('all');
  const { toast } = useToast();

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('security-audit', {
        body: {
          action: 'list',
          timeframe,
          resource_type: resourceFilter !== 'all' ? resourceFilter : null,
          limit: 100
        }
      });

      if (error) {
        console.error('Error fetching audit logs:', error);
        toast({
          title: "Fout bij ophalen audit logs",
          description: "Kon de beveiligingslogs niet ophalen.",
          variant: "destructive",
        });
        return;
      }

      setAuditLogs(data?.data?.logs || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Verbindingsfout",
        description: "Kon geen verbinding maken met de audit service.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runSecurityTests = async () => {
    setTestLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('security-audit', {
        body: { action: 'test' }
      });

      if (error) {
        console.error('Error running security tests:', error);
        toast({
          title: "Fout bij beveiligingstest",
          description: "Kon de beveiligingstests niet uitvoeren.",
          variant: "destructive",
        });
        return;
      }

      setTestResults(data?.data || null);
      
      // Show overall status
      const status = data?.data?.overall_status;
      if (status === 'SECURE') {
        toast({
          title: "Beveiliging Veilig ✅",
          description: "Alle beveiligingstests zijn geslaagd.",
        });
      } else if (status === 'MOSTLY_SECURE') {
        toast({
          title: "Beveiliging Grotendeels Veilig ⚠️",
          description: "De meeste tests zijn geslaagd, maar er zijn enkele waarschuwingen.",
          variant: "default",
        });
      } else {
        toast({
          title: "Beveiligingsproblemen Gedetecteerd 🚨",
          description: "Er zijn kritieke beveiligingsproblemen gevonden die aandacht vereisen.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Test Fout",
        description: "Kon de beveiligingstests niet uitvoeren.",
        variant: "destructive",
      });
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [timeframe, resourceFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': case 'SECURE': return 'bg-green-100 text-green-800';
      case 'WARNING': case 'MOSTLY_SECURE': return 'bg-yellow-100 text-yellow-800';
      case 'FAIL': case 'VULNERABLE': return 'bg-red-100 text-red-800';
      default: return 'bg-white/10 text-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS': case 'SECURE': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'WARNING': case 'MOSTLY_SECURE': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'FAIL': case 'VULNERABLE': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Beveiligingsaudit</h2>
        <Button onClick={runSecurityTests} disabled={testLoading}>
          {testLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Shield className="mr-2 h-4 w-4" />
          )}
          Beveiligingstest Uitvoeren
        </Button>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Beveiligingstests</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Beveiligingsstatus
              </CardTitle>
              <CardDescription>
                Automatische tests om de beveiliging van uw systeem te verifiëren
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.overall_status)}
                      <Badge className={getStatusColor(testResults.overall_status)}>
                        {testResults.overall_status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Laatste test: {format(new Date(testResults.timestamp), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {testResults.tests.map((test, index) => (
                      <Alert key={index} className="border">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            {getStatusIcon(test.status)}
                            <div className="flex-1">
                              <h4 className="font-medium">{test.description}</h4>
                              {test.details && (
                                <p className="text-sm text-muted-foreground mt-1">{test.details}</p>
                              )}
                              {test.error && (
                                <p className="text-sm text-red-600 mt-1">Fout: {test.error}</p>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Voer een beveiligingstest uit om de status van uw systeem te controleren
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Audit Logs
              </CardTitle>
              <CardDescription>
                Gedetailleerde logs van alle beveiligingsgerelateerde gebeurtenissen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Laatste uur</SelectItem>
                      <SelectItem value="24h">Laatste 24u</SelectItem>
                      <SelectItem value="7d">Laatste 7 dagen</SelectItem>
                      <SelectItem value="30d">Laatste 30 dagen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Select value={resourceFilter} onValueChange={setResourceFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle bronnen</SelectItem>
                      <SelectItem value="filled_contracts">Contracten</SelectItem>
                      <SelectItem value="user_sessions">Gebruikerssessies</SelectItem>
                      <SelectItem value="contact_messages">Berichten</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" onClick={fetchAuditLogs} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Laden van audit logs...</p>
                </div>
              ) : auditLogs.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {log.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">{log.action}</span>
                          <Badge variant="outline">{log.resource_type}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(log.created_at), 'dd/MM HH:mm')}
                        </span>
                      </div>
                      {log.error_message && (
                        <p className="text-sm text-red-600 mt-1">{log.error_message}</p>
                      )}
                      {log.ip_address && (
                        <p className="text-xs text-muted-foreground mt-1">
                          IP: {log.ip_address}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Geen audit logs gevonden voor het geselecteerde tijdsbestek
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityAuditTab;