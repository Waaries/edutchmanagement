import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "mark_mail_read",
  title: "Mark mail as read",
  description: "Mark one of the signed-in customer's mail items as read or unread.",
  inputSchema: {
    mail_item_id: z.string().uuid().describe("The id of the mail item."),
    is_read: z.boolean().optional().describe("Read state to set (default true)."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ mail_item_id, is_read }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("mail_items")
      .update({ is_read: is_read ?? true })
      .eq("id", mail_item_id)
      .select("id, subject, is_read");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data || data.length === 0) {
      return { content: [{ type: "text", text: "No mail item found with that id." }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data[0]) }],
      structuredContent: { item: data[0] },
    };
  },
});
