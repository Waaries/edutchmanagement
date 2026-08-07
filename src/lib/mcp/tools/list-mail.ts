import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_mail",
  title: "List mail items",
  description: "List mail items registered for the signed-in customer, newest first.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Maximum number of mail items to return (default 20)."),
    only_unread: z.boolean().optional().describe("Return only unread mail items."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, only_unread }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("mail_items")
      .select("id, subject, sender, mail_type, priority, status, received_at, is_read, notes")
      .order("received_at", { ascending: false })
      .limit(limit ?? 20);
    if (only_unread) query = query.eq("is_read", false);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { items: data ?? [] },
    };
  },
});
