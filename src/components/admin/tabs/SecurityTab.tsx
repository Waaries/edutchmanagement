import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Shield, Users, Activity, Search, RefreshCw, Download, Eye, EyeOff, UserX, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoginLog {
  id: string;
  user_id: string;
  email: string;
  event_type: string;
  ip_address: string;
  user_agent: string;
  country?: string;
  city?: string;
  success: boolean;
  error_message?: string;
  created_at: string;
}

interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address: string;
  user_agent: string;
  country?: string;
  city?: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
}

const SecurityTab: React.FC = () => {
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [successFilter, setSuccessFilter] = useState("all");
  const { toast } = useToast();

  const fetchLoginLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('login_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLoginLogs((data || []).map(log => ({
        ...log,
        ip_address: log.ip_address as string || ''
      })));
    } catch (error) {
      console.error('Error fetching login logs:', error);
      toast({
        title: "Fout bij laden",
        description: "Kon login logs niet laden.",
        variant: "destructive",
      });
    }
  };

  const fetchUserSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .order('last_activity', { ascending: false })
        .limit(50);

      if (error) throw error;
      setUserSessions((data || []).map(session => ({
        ...session,
        ip_address: session.ip_address as string || ''
      })));
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      toast({
        title: "Fout bij laden",
        description: "Kon gebruikerssessies niet laden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string, sessionToken: string) => {
    try {
      // Call the function to terminate the session
      const { error } = await supabase.rpc('manage_user_session', {
        p_user_id: null,
        p_session_token: sessionToken,
        p_action: 'end'
      });

      if (error) throw error;

      toast({
        title: "Sessie beëindigd",
        description: "De gebruikerssessie is succesvol beëindigd.",
      });

      fetchUserSessions(); // Refresh the list
    } catch (error) {
      console.error('Error terminating session:', error);
      toast({
        title: "Fout",
        description: "Kon sessie niet beëindigen.",
        variant: "destructive",
      });
    }
  };

  const exportLogs = async (type: 'logs' | 'sessions') => {
    try {
      const data = type === 'logs' ? loginLogs : userSessions;
      const headers = type === 'logs' 
        ? ['Email', 'Event Type', 'Success', 'IP Address', 'User Agent', 'Created At', 'Error']
        : ['User ID', 'IP Address', 'User Agent', 'Created At', 'Last Activity', 'Active'];
      
      const rows = data.map(item => {
        if (type === 'logs') {
          const log = item as LoginLog;
          return [
            log.email || '',
            log.event_type,
            log.success ? 'Ja' : 'Nee',
            log.ip_address || '',
            log.user_agent || '',
            new Date(log.created_at).toLocaleString('nl-NL'),
            log.error_message || ''
          ];
        } else {
          const session = item as UserSession;
          return [
            session.user_id,
            session.ip_address || '',
            session.user_agent || '',
            new Date(session.created_at).toLocaleString('nl-NL'),
            new Date(session.last_activity).toLocaleString('nl-NL'),
            session.is_active ? 'Ja' : 'Nee'
          ];
        }
      });

      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `${type}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Export voltooid",
        description: `${type === 'logs' ? 'Login logs' : 'Sessies'} zijn geëxporteerd naar CSV.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export mislukt",
        description: "Er is een fout opgetreden bij het exporteren.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLoginLogs();
    fetchUserSessions();
  }, []);

  // Filter login logs
  const filteredLogs = loginLogs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = eventFilter === 'all' || log.event_type === eventFilter;
    const matchesSuccess = successFilter === 'all' || 
      (successFilter === 'success' && log.success) ||
      (successFilter === 'failed' && !log.success);
    
    return matchesSearch && matchesEvent && matchesSuccess;
  });

  const getEventBadgeColor = (eventType: string, success: boolean) => {
    if (!success) return 'destructive';
    switch (eventType) {
      case 'login_success': return 'default';
      case 'logout': return 'secondary';
      case 'signup': return 'default';
      default: return 'outline';
    }
  };

  const getEventDisplayName = (eventType: string) => {
    switch (eventType) {
      case 'login_success': return 'Inloggen';
      case 'login_failed': return 'Inloggen mislukt';
      case 'logout': return 'Uitloggen';
      case 'signup': return 'Registreren';
      default: return eventType;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Beveiliging & Sessie Management</CardTitle>
          </div>
          <CardDescription>
            Monitor gebruikersactiviteit, login pogingen en beheer actieve sessies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Beveiligingsoverzicht</AlertTitle>
            <AlertDescription>
              Houd alle login activiteit in de gaten en beheer gebruikerssessies. 
              Deze data helpt bij het detecteren van verdachte activiteit.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="login-logs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="login-logs">Login Geschiedenis</TabsTrigger>
              <TabsTrigger value="active-sessions">Actieve Sessies</TabsTrigger>
            </TabsList>

            <TabsContent value="login-logs" className="space-y-4">
              {/* Filters and Search */}
              <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Zoek op email, IP of event..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter op event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle events</SelectItem>
                    <SelectItem value="login_success">Inloggen</SelectItem>
                    <SelectItem value="login_failed">Mislukt inloggen</SelectItem>
                    <SelectItem value="logout">Uitloggen</SelectItem>
                    <SelectItem value="signup">Registreren</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={successFilter} onValueChange={setSuccessFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter op status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle statussen</SelectItem>
                    <SelectItem value="success">Succesvol</SelectItem>
                    <SelectItem value="failed">Mislukt</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={fetchLoginLogs}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Ververs
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportLogs('logs')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporteer
                </Button>
              </div>

              {/* Login Logs Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Login Geschiedenis ({filteredLogs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredLogs.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">Geen login logs gevonden</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>IP Adres</TableHead>
                            <TableHead>Locatie</TableHead>
                            <TableHead>Datum/Tijd</TableHead>
                            <TableHead>User Agent</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="font-medium">
                                {log.email || 'Onbekend'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getEventBadgeColor(log.event_type, log.success)}>
                                  {getEventDisplayName(log.event_type)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {log.success ? (
                                  <Badge variant="default" className="bg-green-600 text-white">Succesvol</Badge>
                                ) : (
                                  <Badge variant="destructive">Mislukt</Badge>
                                )}
                              </TableCell>
                              <TableCell>{log.ip_address || 'Onbekend'}</TableCell>
                              <TableCell>
                                {log.city && log.country ? `${log.city}, ${log.country}` : 'Onbekend'}
                              </TableCell>
                              <TableCell>
                                {new Date(log.created_at).toLocaleString('nl-NL')}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate" title={log.user_agent}>
                                {log.user_agent || 'Onbekend'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active-sessions" className="space-y-4">
              {/* Session Management Actions */}
              <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
                <Button variant="outline" size="sm" onClick={fetchUserSessions}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Ververs Sessies
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportLogs('sessions')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporteer Sessies
                </Button>
              </div>

              {/* Active Sessions Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actieve Gebruikerssessies ({userSessions.filter(s => s.is_active).length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : userSessions.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">Geen actieve sessies gevonden</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Gebruiker ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>IP Adres</TableHead>
                            <TableHead>Locatie</TableHead>
                            <TableHead>Aangemaakt</TableHead>
                            <TableHead>Laatste Activiteit</TableHead>
                            <TableHead>Verloopt</TableHead>
                            <TableHead>Acties</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userSessions.map((session) => (
                            <TableRow key={session.id}>
                              <TableCell className="font-mono text-xs">
                                {session.user_id.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                {session.is_active ? (
                                  <Badge variant="default" className="bg-green-600 text-white">
                                    <Activity className="h-3 w-3 mr-1" />
                                    Actief
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Inactief
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{session.ip_address || 'Onbekend'}</TableCell>
                              <TableCell>
                                {session.city && session.country ? `${session.city}, ${session.country}` : 'Onbekend'}
                              </TableCell>
                              <TableCell>
                                {new Date(session.created_at).toLocaleString('nl-NL')}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(session.last_activity).toLocaleString('nl-NL')}
                                </div>
                              </TableCell>
                              <TableCell>
                                {session.expires_at ? new Date(session.expires_at).toLocaleString('nl-NL') : 'Geen limiet'}
                              </TableCell>
                              <TableCell>
                                {session.is_active && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => terminateSession(session.id, session.session_token)}
                                  >
                                    <UserX className="h-3 w-3 mr-1" />
                                    Beëindig
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTab;