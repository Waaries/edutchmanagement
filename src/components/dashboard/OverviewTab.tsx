
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, CalendarCheck, CalendarX } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
}

interface ActivityData {
  month: string;
  appointments: number;
}

const MOCK_ACTIVITY_DATA: ActivityData[] = [
  { month: 'Jan', appointments: 5 },
  { month: 'Feb', appointments: 7 },
  { month: 'Mar', appointments: 4 },
  { month: 'Apr', appointments: 8 },
  { month: 'Mei', appointments: 12 },
  { month: 'Jun', appointments: 8 },
  { month: 'Jul', appointments: 6 },
  { month: 'Aug', appointments: 9 },
];

const MOCK_UPCOMING_APPOINTMENTS = [
  { id: 1, title: "Introductiegesprek", date: "2025-05-20T10:00:00", status: "confirmed" },
  { id: 2, title: "Voortgangsbeoordeling", date: "2025-05-27T14:30:00", status: "confirmed" },
  { id: 3, title: "Training evaluatie", date: "2025-06-05T11:00:00", status: "pending" },
];

const OverviewTab = ({ setActiveTab }: OverviewTabProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simuleer het laden van data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) + ' ' + 
           date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Activity Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>Uw activiteit</CardTitle>
            <CardDescription>Overzicht van uw afspraken door de tijd</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[200px] flex items-center justify-center">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : (
              <AspectRatio ratio={21/9} className="bg-slate-50 rounded-md">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_ACTIVITY_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </AspectRatio>
            )}
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Profiel</CardTitle>
              <CardDescription>Bekijk en bewerk uw profiel</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Beheer uw persoonlijke gegevens en voorkeuren.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("profile")}>Naar profiel</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Instellingen</CardTitle>
              <CardDescription>Pas uw voorkeuren aan</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configureer notificaties, privacy en andere systeeminstellingen.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => alert("Instellingen functionaliteit wordt binnenkort toegevoegd!")}>Instellingen bekijken</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right column with upcoming appointments */}
      <div className="space-y-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Aankomende afspraken
            </CardTitle>
            <CardDescription>Uw geplande afspraken</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : MOCK_UPCOMING_APPOINTMENTS.length > 0 ? (
              <div className="space-y-4">
                {MOCK_UPCOMING_APPOINTMENTS.map(appointment => (
                  <div key={appointment.id} className="p-3 border rounded-lg bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{appointment.title}</h4>
                        <p className="text-sm text-slate-500">{formatDate(appointment.date)}</p>
                      </div>
                      {appointment.status === "confirmed" ? (
                        <CalendarCheck className="h-5 w-5 text-green-600" />
                      ) : (
                        <CalendarX className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-slate-500">Geen aankomende afspraken</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => setActiveTab("appointments")} className="w-full">
              Alle afspraken bekijken
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
