
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMonitoring } from '@/hooks/use-monitoring';
import { useNotificationDebugger } from '@/hooks/use-notification-debugger';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Activity, Clock, Users, RefreshCw, Download, Wifi, HardDrive, CheckCircle } from 'lucide-react';

interface StorageInfo {
  totalSize: number;
  usedSize: number;
  availableSize: number;
  usage: number; // percentage
}

interface HealthStatus {
  timestamp: string;
  status: 'healthy' | 'degraded' | 'error';
  services: {
    database: { status: string; responseTime: number; error?: string };
    auth: { status: string; responseTime: number; error?: string };
    storage: { status: string; responseTime: number; error?: string };
  };
  system: {
    uptime: number;
    memory?: any;
  };
}

const MonitoringDashboard: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { getLocalData, clearLocalData } = useMonitoring();
  const {
    channelStatus,
    checkRealtimeStatus,
    testContactNotification,
    resetRealtime
  } = useNotificationDebugger();

  const fetchStorageInfo = async () => {
    try {
      // For now, we'll use mock storage data since we don't have a database function yet
      // In the future, this could query actual database size
      setStorageInfo({
        totalSize: 1024 * 1024 * 1024, // 1GB
        usedSize: 156 * 1024 * 1024,   // 156MB
        availableSize: 868 * 1024 * 1024, // 868MB
        usage: 15.2
      });
    } catch (error) {
      console.error('Failed to fetch storage info:', error);
      // Fallback mock data
      setStorageInfo({
        totalSize: 1024 * 1024 * 1024, // 1GB
        usedSize: 156 * 1024 * 1024,   // 156MB
        availableSize: 868 * 1024 * 1024, // 868MB
        usage: 15.2
      });
    }
  };

  // Calculate overall system health based on various metrics
  const calculateSystemHealth = () => {
    const errors = getLocalData('errors');
    const recentErrors = errors.filter((error: any) => {
      const errorTime = new Date(error.timestamp).getTime();
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      return errorTime > oneHourAgo;
    });

    // Check for critical issues
    if (recentErrors.length > 5) {
      setSystemHealth('error');
      return;
    }

    // Check database health
    if (healthStatus?.services?.database?.status === 'error') {
      setSystemHealth('error');
      return;
    }

    // Check auth health
    if (healthStatus?.services?.auth?.status === 'error') {
      setSystemHealth('error');
      return;
    }

    // Check for warnings
    if (recentErrors.length > 0 || 
        healthStatus?.services?.database?.status === 'degraded' ||
        healthStatus?.services?.auth?.status === 'degraded' ||
        (storageInfo?.usage && storageInfo.usage > 80)) {
      setSystemHealth('warning');
      return;
    }

    // All good
    setSystemHealth('healthy');
  };

  const getSystemHealthIcon = () => {
    switch (systemHealth) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSystemHealthText = () => {
    switch (systemHealth) {
      case 'healthy': return 'Alle systemen operationeel';
      case 'warning': return 'Waarschuwingen gedetecteerd';
      case 'error': return 'Kritieke problemen';
      default: return 'Status onbekend';
    }
  };

  const getSystemHealthBadge = () => {
    switch (systemHealth) {
      case 'healthy': return 'Gezond';
      case 'warning': return 'Waarschuwing';
      case 'error': return 'Kritiek';
      default: return 'Onbekend';
    }
  };

  // Update system health when dependencies change
  useEffect(() => {
    calculateSystemHealth();
  }, [healthStatus, storageInfo, getLocalData]);

  const fetchHealthStatus = async () => {
    setIsLoading(true);
    try {
      // Fetch both health status and storage info
      await Promise.all([
        (async () => {
          const { data, error } = await supabase.functions.invoke('health-check');
          if (error) throw error;
          setHealthStatus(data);
        })(),
        fetchStorageInfo()
      ]);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch health status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRealtimeStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'subscribed': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'closed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Gezond';
      case 'degraded': return 'Verslechterd';
      case 'error': return 'Fout';
      default: return 'Onbekend';
    }
  };

  const exportMonitoringData = () => {
    const errors = getLocalData('errors');
    const performance = getLocalData('performance');
    const ux = getLocalData('ux');
    
    const data = {
      exportDate: new Date().toISOString(),
      errors,
      performance,
      ux,
      healthStatus
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (uptime: number) => {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}u ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Monitoring Dashboard</h2>
          <p className="text-muted-foreground">
            Laatste update: {lastRefresh.toLocaleTimeString('nl-NL')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportMonitoringData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" onClick={fetchHealthStatus} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Ververs
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Systeemstatus</CardTitle>
            <Activity className={`h-4 w-4 ${healthStatus?.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(healthStatus?.status || 'unknown')} text-white`}>
                {getStatusText(healthStatus?.status || 'unknown')}
              </Badge>
            </div>
            {healthStatus?.system?.uptime && (
              <p className="text-xs text-muted-foreground mt-1">
                Uptime: {formatUptime(healthStatus.system.uptime)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Activity className={`h-4 w-4 ${healthStatus?.services.database.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(healthStatus?.services.database.status || 'unknown')} text-white`}>
                {getStatusText(healthStatus?.services.database.status || 'unknown')}
              </Badge>
            </div>
            {healthStatus?.services.database.responseTime && (
              <p className="text-xs text-muted-foreground mt-1">
                {healthStatus.services.database.responseTime}ms
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authenticatie</CardTitle>
            <Users className={`h-4 w-4 ${healthStatus?.services.auth.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(healthStatus?.services.auth.status || 'unknown')} text-white`}>
                {getStatusText(healthStatus?.services.auth.status || 'unknown')}
              </Badge>
            </div>
            {healthStatus?.services.auth.responseTime && (
              <p className="text-xs text-muted-foreground mt-1">
                {healthStatus.services.auth.responseTime}ms
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Systeem Gezondheid</CardTitle>
            <Wifi className={`h-4 w-4 ${getSystemHealthIcon()}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getStatusColor(systemHealth)} text-white`}>
                {getSystemHealthBadge()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {getSystemHealthText()}
            </p>
            {systemHealth !== 'healthy' && (
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => {
                    fetchHealthStatus();
                    calculateSystemHealth();
                  }}
                >
                  Hercontroleer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Opslag</CardTitle>
            <HardDrive className={`h-4 w-4 ${storageInfo?.usage && storageInfo.usage > 80 ? 'text-red-500' : 'text-green-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-xl font-bold">
                {storageInfo ? `${storageInfo.usage.toFixed(1)}%` : '0%'}
              </div>
              <p className="text-sm text-muted-foreground">
                {storageInfo ? `${formatBytes(storageInfo.usedSize)} van ${formatBytes(storageInfo.totalSize)}` : 'Onbekend'}
              </p>
              {storageInfo && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      storageInfo.usage > 80 ? 'bg-red-500' : 
                      storageInfo.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${storageInfo.usage}%` }}
                  ></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fouten</CardTitle>
            {getLocalData('errors').length > 0 ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {getLocalData('errors').length}
            </div>
            <p className="text-sm text-muted-foreground">
              {getLocalData('errors').length === 0 ? 'Geen fouten' : 'Lokaal opgeslagen'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring Data */}
      <Tabs defaultValue="errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="errors">Fouten</TabsTrigger>
          <TabsTrigger value="performance">Prestaties</TabsTrigger>
          <TabsTrigger value="ux">Gebruikerservaring</TabsTrigger>
          <TabsTrigger value="health">Systeemgezondheid</TabsTrigger>
        </TabsList>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Recente Fouten</CardTitle>
              <CardDescription>
                Lokaal opgeslagen foutmeldingen van gebruikers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getLocalData('errors').slice(-10).reverse().map((error: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{error.message}</h4>
                      <Badge variant={error.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {error.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(error.timestamp).toLocaleString('nl-NL')} - {error.url}
                    </p>
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer">Stack Trace</summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
                {getLocalData('errors').length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Geen fouten gevonden
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Prestatiemetingen</CardTitle>
              <CardDescription>
                Core Web Vitals en andere prestatie-indicatoren
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getLocalData('performance').slice(-10).reverse().map((metric: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">{metric.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(metric.timestamp).toLocaleString('nl-NL')}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {metric.value}ms
                    </Badge>
                  </div>
                ))}
                {getLocalData('performance').length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Geen prestatiemetingen gevonden
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ux">
          <Card>
            <CardHeader>
              <CardTitle>Gebruikerservaring</CardTitle>
              <CardDescription>
                Gebruikersinteracties en gedragspatronen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getLocalData('ux').slice(-10).reverse().map((metric: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">{metric.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(metric.timestamp).toLocaleString('nl-NL')}
                      </p>
                    </div>
                    {metric.duration && (
                      <Badge variant="outline">
                        {metric.duration}ms
                      </Badge>
                    )}
                  </div>
                ))}
                {getLocalData('ux').length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Geen gebruikerservaringsdata gevonden
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Systeemgezondheid Details</CardTitle>
              <CardDescription>
                Uitgebreide informatie over systeemstatus
              </CardDescription>
            </CardHeader>
            <CardContent>
              {healthStatus ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Services Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(healthStatus.services).map(([service, status]) => (
                        <div key={service} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize">{service}</span>
                            <Badge className={`${getStatusColor(status.status)} text-white`}>
                              {getStatusText(status.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Responstijd: {status.responseTime}ms
                          </p>
                          {status.error && (
                            <p className="text-sm text-red-600 mt-1">
                              {status.error}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Systeeminformatie</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <pre className="text-sm">
                        {JSON.stringify(healthStatus.system, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Geen gezondheidsdata beschikbaar
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" onClick={clearLocalData}>
          Wis Lokale Data
        </Button>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
