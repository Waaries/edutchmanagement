import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listMailTool from "./tools/list-mail";
import markMailReadTool from "./tools/mark-mail-read";
import getProfileTool from "./tools/get-profile";
import listAddressRequestsTool from "./tools/list-address-requests";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "edutchmanagement",
  title: "edutchmanagement",
  version: "0.1.0",
  instructions:
    "Tools for eDutch Management. Read the signed-in customer's registered mail, mark mail as read, read their company profile, and list business address requests.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listMailTool, markMailReadTool, getProfileTool, listAddressRequestsTool],
});
