
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, CalendarCheck, CalendarX } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
}

interface ActivityData {
  month: string;
  posts: number;
}

const MOCK_ACTIVITY_DATA: ActivityData[] = [
  { month: 'Jan', posts: 5 },
  { month: 'Feb', posts: 7 },
  { month: 'Mar', posts: 4 },
  { month: 'Apr', posts: 8 },
  { month: 'Mei', posts: 12 },
  { month: 'Jun', posts: 8 },
  { month: 'Jul', posts: 6 },
  { month: 'Aug', posts: 9 },
];

const MOCK_UPCOMING_POSTS = [];

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
            <CardDescription>Overzicht van uw ontvangen post door de tijd</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[200px] flex items-center justify-center">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : (
              <AspectRatio ratio={21/9} className="bg-white/5 border border-white/10 rounded-md">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_ACTIVITY_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="month" stroke="hsl(215 20% 65%)" />
                    <YAxis stroke="hsl(215 20% 65%)" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(217 33% 10%)",
                        border: "1px solid hsl(215 28% 20%)",
                        borderRadius: "0.5rem",
                        color: "hsl(210 40% 98%)",
                      }}
                    />
                    <Bar dataKey="posts" fill="hsl(217 91% 60%)" radius={[6, 6, 0, 0]} />
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
              <Button variant="outline" onClick={() => setActiveTab("settings")}>Instellingen bekijken</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right column with upcoming posts */}
      <div className="space-y-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Ontvangen post
            </CardTitle>
            <CardDescription>Uw geregistreerde post</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : MOCK_UPCOMING_POSTS.length > 0 ? (
              <div className="space-y-4">
                {MOCK_UPCOMING_POSTS.map(post => (
                  <div key={post.id} className="p-3 border rounded-lg bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-slate-500">{formatDate(post.date)}</p>
                      </div>
                      {post.status === "confirmed" ? (
                        <CalendarCheck className="h-5 w-5 text-green-600" />
                      ) : (
                        <CalendarX className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-slate-500">Geen ontvangen post</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => setActiveTab("appointments")} className="w-full">
              Alle ontvangen post bekijken
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
