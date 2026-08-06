import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Mail } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/integrations/supabase/client";
import { MailItem, MAIL_TYPE_LABELS, mailTypeClass } from "@/lib/mail-utils";

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
}

interface ActivityData {
  month: string;
  posts: number;
}

const MONTHS_NL = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

const buildActivityData = (items: MailItem[]): ActivityData[] => {
  const now = new Date();
  const buckets: ActivityData[] = [];
  const keyToIndex = new Map<string, number>();

  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    keyToIndex.set(key, buckets.length);
    buckets.push({ month: MONTHS_NL[d.getMonth()], posts: 0 });
  }

  items.forEach((item) => {
    const d = new Date(item.received_at);
    const idx = keyToIndex.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (idx !== undefined) buckets[idx].posts += 1;
  });

  return buckets;
};

const OverviewTab = ({ setActiveTab }: OverviewTabProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mailItems, setMailItems] = useState<MailItem[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchMail = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("mail_items")
          .select("*")
          .eq("user_id", user.id)
          .order("received_at", { ascending: false });
        if (error) throw error;
        setMailItems((data ?? []) as MailItem[]);
      } catch (error) {
        console.error("Error fetching mail items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMail();
  }, [user]);

  const activityData = buildActivityData(mailItems);
  const recentMail = mailItems.slice(0, 5);
  const unreadCount = mailItems.filter((m) => !m.is_read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) +
      " " +
      date.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Activity Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>Uw activiteit</CardTitle>
            <CardDescription>Ontvangen post per maand (laatste 8 maanden)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[200px] flex items-center justify-center">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : mailItems.length === 0 ? (
              <div className="rounded-md border border-white/10 bg-white/5 py-12 text-center">
                <Mail className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                <h3 className="font-medium mb-1">Nog geen post ontvangen</h3>
                <p className="text-sm text-slate-400">
                  Zodra wij post voor u registreren, ziet u hier uw activiteit.
                </p>
              </div>
            ) : (
              <AspectRatio ratio={21 / 9} className="bg-white/5 border border-white/10 rounded-md">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="month" stroke="hsl(215 20% 65%)" />
                    <YAxis stroke="hsl(215 20% 65%)" allowDecimals={false} />
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
              <Button variant="outline" onClick={() => setActiveTab("settings")}>
                Instellingen bekijken
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right column with recent mail */}
      <div className="space-y-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Ontvangen post
            </CardTitle>
            <CardDescription>
              {unreadCount > 0
                ? `${unreadCount} ongelezen van ${mailItems.length} poststukken`
                : "Uw meest recente post"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : recentMail.length > 0 ? (
              <div className="space-y-4">
                {recentMail.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 border rounded-lg bg-white/5 ${
                      item.is_read ? "border-white/10" : "border-blue-500/30"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className={`truncate ${item.is_read ? "font-medium" : "font-bold"}`}>
                          {item.subject}
                        </h4>
                        <p className="text-sm text-slate-400 truncate">
                          {item.sender || "Onbekende afzender"} · {formatDate(item.received_at)}
                        </p>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${mailTypeClass(item.mail_type)}`}
                        >
                          {MAIL_TYPE_LABELS[item.mail_type]}
                        </Badge>
                      </div>
                      <Mail
                        className={`h-5 w-5 shrink-0 ${
                          item.is_read ? "text-slate-500" : "text-blue-400"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-slate-400">Nog geen post ontvangen</p>
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
