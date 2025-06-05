
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

export interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export function validateSMTPConfig(): SMTPConfig {
  const smtpHost = Deno.env.get("SMTP_HOST");
  const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "465");
  const smtpUsername = Deno.env.get("SMTP_USERNAME");
  const smtpPassword = Deno.env.get("SMTP_PASSWORD");
  
  if (!smtpHost || !smtpPort || !smtpUsername || !smtpPassword) {
    throw new Error("SMTP configuration is incomplete");
  }
  
  return {
    host: smtpHost,
    port: smtpPort,
    username: smtpUsername,
    password: smtpPassword
  };
}

export function createSMTPClient(config: SMTPConfig): SMTPClient {
  console.log("Configuring SMTP client for address request notification");
  
  const client = new SMTPClient({
    connection: {
      hostname: config.host,
      port: config.port,
      tls: true,
      auth: {
        username: config.username,
        password: config.password,
      }
    }
  });
  
  console.log("SMTP client configured successfully");
  return client;
}
