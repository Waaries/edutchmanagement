
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { AddressRequestData } from "./types.ts";
import { createAdminTextContent, createAdminHtmlContent, createConfirmationHtmlContent } from "./email-formatter.ts";

export async function sendAdminNotification(
  client: SMTPClient,
  requestData: AddressRequestData,
  smtpUsername: string,
  senderName: string,
  adminEmail: string
): Promise<void> {
  const adminTextContent = createAdminTextContent(requestData);
  const adminHtmlContent = createAdminHtmlContent(requestData);
  
  await client.send({
    from: `${senderName} <${smtpUsername}>`,
    to: adminEmail,
    subject: `Nieuwe bedrijfsadres aanvraag van ${requestData.company_name}`,
    html: adminHtmlContent,
    text: adminTextContent,
    replyTo: requestData.email
  });
  
  console.log("Address request notification email sent successfully");
}

export async function sendConfirmationEmail(
  client: SMTPClient,
  requestData: AddressRequestData,
  smtpUsername: string,
  senderName: string
): Promise<void> {
  const confirmationHtml = createConfirmationHtmlContent(requestData, smtpUsername, senderName);
  
  await client.send({
    from: `${senderName} <${smtpUsername}>`,
    to: requestData.email,
    subject: "Bevestiging van uw bedrijfsadres aanvraag",
    html: confirmationHtml
  });
  
  console.log("Confirmation email sent successfully");
}
