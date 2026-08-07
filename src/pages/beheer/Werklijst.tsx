import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, FileText, MessageSquare, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "./PageHeader";
import LoadingSpinner from "@/components/ui/loading-spinner";

type Item = { id: string; primary: string; secondary?: string | null; date: string | null; userId?: string | null };

type Block = {
  key: string;
  title: string;
  icon: typeof Mail;
  to: string;
  count: number;
  items: Item[];
};

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("nl-NL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

const Werklijst = () => {
  const [blocks, setBlocks] = useState<Block[] | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [requests, mail, contracts, messages] = await Promise.all([
        supabase
          .from("address_requests")
          .select("id, company_name, contact_person, created_at, status, user_id", { count: "exact" })
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("mail_items")
          .select("id, subject, sender, received_at, user_id", { count: "exact" })
          .eq("status", "received")
          .order("received_at", { ascending: false })
          .limit(5),
        supabase
          .from("filled_contracts")
          .select("id, client_name, client_email, created_at, user_id", { count: "exact" })
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("contact_messages")
          .select("id, name, email, created_at", { count: "exact" })
          .eq("status", "unread")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (!active) return;

      setBlocks([
        {
          key: "requests",
          title: "Nieuwe adresaanvragen",
          icon: Building2,
          to: "/beheer/aanvragen",
          count: requests.count ?? 0,
          items: (requests.data ?? []).map((r) => ({
            id: r.id,
            primary: r.company_name,
            secondary: r.contact_person,
            date: r.created_at,
            userId: r.user_id,
          })),
        },
        {
          key: "mail",
          title: "Post nog te verwerken",
          icon: Mail,
          to: "/beheer/post",
          count: mail.count ?? 0,
          items: (mail.data ?? []).map((m) => ({
            id: m.id,
            primary: m.subject,
            secondary: m.sender,
            date: m.received_at,
            userId: m.user_id,
          })),
        },
        {
          key: "contracts",
          title: "Contracten wachtend op ondertekening",
          icon: FileText,
          to: "/beheer/contracten",
          count: contracts.count ?? 0,
          items: (contracts.data ?? []).map((c) => ({
            id: c.id,
            primary: c.client_name || c.client_email,
            secondary: c.client_name ? c.client_email : null,
            date: c.created_at,
            userId: c.user_id,
          })),
        },
        {
          key: "messages",
          title: "Ongelezen contactberichten",
          icon: MessageSquare,
          to: "/beheer/systeem/berichten",
          count: messages.count ?? 0,
          items: (messages.data ?? []).map((m) => ({
            id: m.id,
            primary: m.name,
            secondary: m.email,
            date: m.created_at,
          })),
        },
      ]);
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <PageHeader title="Werklijst" description="Wat ligt er nu op je bord?" />

      {!blocks ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {blocks.map((block) => (
            <Card key={block.key} className="app-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <block.icon className="h-4 w-4 text-blue-400" />
                  {block.title}
                </CardTitle>
                <span className="text-sm font-semibold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-200 border border-blue-500/30">
                  {block.count}
                </span>
              </CardHeader>
              <CardContent className="space-y-1">
                {block.items.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">Niets te doen</p>
                ) : (
                  <>
                    {block.items.map((item) => (
                      <Link
                        key={item.id}
                        to={item.userId ? `/beheer/klanten/${item.userId}` : block.to}
                        className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm text-slate-200 truncate">{item.primary}</span>
                          {item.secondary && (
                            <span className="block text-xs text-slate-500 truncate">{item.secondary}</span>
                          )}
                        </span>
                        <span className="flex items-center gap-2 shrink-0 text-xs text-slate-500">
                          {formatDate(item.date)}
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      </Link>
                    ))}
                    <Link
                      to={block.to}
                      className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 px-3 pt-2"
                    >
                      Alles bekijken <ChevronRight className="h-3 w-3" />
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Werklijst;
