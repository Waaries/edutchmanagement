export type MailType = "letter" | "parcel" | "registered" | "other";
export type MailStatus =
  | "received"
  | "notified"
  | "scanned"
  | "forwarded"
  | "collected"
  | "destroyed";
export type MailPriority = "low" | "normal" | "high";

export interface MailItem {
  id: string;
  user_id: string;
  subject: string;
  sender: string | null;
  mail_type: MailType;
  priority: MailPriority;
  status: MailStatus;
  received_at: string;
  is_read: boolean;
  scan_path: string | null;
  notes: string | null;
  registered_by: string | null;
  created_at: string;
  updated_at: string;
}

export const MAIL_TYPE_LABELS: Record<MailType, string> = {
  letter: "Brief",
  parcel: "Pakket",
  registered: "Aangetekend",
  other: "Overig",
};

export const MAIL_STATUS_LABELS: Record<MailStatus, string> = {
  received: "Ontvangen",
  notified: "Gemeld",
  scanned: "Gescand",
  forwarded: "Doorgestuurd",
  collected: "Opgehaald",
  destroyed: "Vernietigd",
};

export const MAIL_PRIORITY_LABELS: Record<MailPriority, string> = {
  low: "Laag",
  normal: "Normaal",
  high: "Hoog",
};

export const mailTypeClass = (type: MailType) =>
  ({
    letter: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    parcel: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    registered: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    other: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  })[type];

export const mailStatusClass = (status: MailStatus) =>
  ({
    received: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    notified: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    scanned: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    forwarded: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    collected: "bg-green-500/15 text-green-300 border-green-500/30",
    destroyed: "bg-red-500/15 text-red-300 border-red-500/30",
  })[status];

export const mailPriorityClass = (priority: MailPriority) =>
  ({
    low: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    normal: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    high: "bg-red-500/15 text-red-300 border-red-500/30",
  })[priority];
