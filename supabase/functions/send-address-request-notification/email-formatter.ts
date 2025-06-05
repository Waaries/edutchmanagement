
import { AddressRequestData } from "./types.ts";

export function formatAdditionalServices(services: string[]): string {
  return services.length > 0 
    ? services.join(", ")
    : "Geen extra diensten geselecteerd";
}

export function formatAddressType(addressType: string): string {
  const addressTypeLabels = {
    basic: "Basis Pakket",
    premium: "Premium Pakket",
    complete: "Complete Pakket"
  };
  return addressTypeLabels[addressType as keyof typeof addressTypeLabels] || addressType;
}

export function createAdminTextContent(requestData: AddressRequestData): string {
  const servicesText = formatAdditionalServices(requestData.additional_services);
  const addressTypeLabel = formatAddressType(requestData.preferred_address_type);

  return `
Nieuwe Bedrijfsadres Aanvraag

Bedrijfsinformatie:
Bedrijfsnaam: ${requestData.company_name}
Contactpersoon: ${requestData.contact_person}
Type bedrijf: ${requestData.business_type}

Contactgegevens:
E-mail: ${requestData.email}
Telefoon: ${requestData.phone || "Niet opgegeven"}

Aanvraag Details:
Gewenst adrespakket: ${addressTypeLabel}
Verwacht postvolume: ${requestData.expected_mail_volume}
Extra diensten: ${servicesText}

${requestData.special_requirements ? `Bijzondere wensen:\n${requestData.special_requirements}\n` : ''}
Account Status:
Gebruiker ID: ${requestData.user_id || "Anonieme aanvraag"}

Deze aanvraag is automatisch gegenereerd via het online aanvraagformulier.
  `.trim();
}

export function createAdminHtmlContent(requestData: AddressRequestData): string {
  const servicesText = formatAdditionalServices(requestData.additional_services);
  const addressTypeLabel = formatAddressType(requestData.preferred_address_type);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Nieuwe Bedrijfsadres Aanvraag</title>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
h2 { color: #2c5aa0; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px; }
h3 { color: #444; margin-top: 25px; margin-bottom: 10px; }
.info-block { background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #2c5aa0; }
.label { font-weight: bold; }
.footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-style: italic; color: #666; }
</style>
</head>
<body>
<h2>Nieuwe Bedrijfsadres Aanvraag</h2>

<h3>Bedrijfsinformatie</h3>
<div class="info-block">
<p><span class="label">Bedrijfsnaam:</span> ${requestData.company_name}</p>
<p><span class="label">Contactpersoon:</span> ${requestData.contact_person}</p>
<p><span class="label">Type bedrijf:</span> ${requestData.business_type}</p>
</div>

<h3>Contactgegevens</h3>
<div class="info-block">
<p><span class="label">E-mail:</span> ${requestData.email}</p>
<p><span class="label">Telefoon:</span> ${requestData.phone || "Niet opgegeven"}</p>
</div>

<h3>Aanvraag Details</h3>
<div class="info-block">
<p><span class="label">Gewenst adrespakket:</span> ${addressTypeLabel}</p>
<p><span class="label">Verwacht postvolume:</span> ${requestData.expected_mail_volume}</p>
<p><span class="label">Extra diensten:</span> ${servicesText}</p>
</div>

${requestData.special_requirements ? `<h3>Bijzondere wensen</h3>
<div class="info-block">
<p>${requestData.special_requirements}</p>
</div>` : ''}

<h3>Account Status</h3>
<div class="info-block">
<p><span class="label">Gebruiker ID:</span> ${requestData.user_id || "Anonieme aanvraag"}</p>
</div>

<div class="footer">
<p>Deze aanvraag is automatisch gegenereerd via het online aanvraagformulier.</p>
</div>
</body>
</html>`;
}

export function createConfirmationHtmlContent(requestData: AddressRequestData, smtpUsername: string, senderName: string): string {
  const servicesText = formatAdditionalServices(requestData.additional_services);
  const addressTypeLabel = formatAddressType(requestData.preferred_address_type);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Bevestiging van uw bedrijfsadres aanvraag</title>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
h2 { color: #2c5aa0; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px; }
h3 { color: #444; margin-top: 25px; margin-bottom: 10px; }
.info-block { background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #2c5aa0; }
.label { font-weight: bold; }
.footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-style: italic; color: #666; }
hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
</style>
</head>
<body>
<h2>Bedankt voor uw aanvraag!</h2>
<p>Beste ${requestData.contact_person},</p>
<p>Wij hebben uw aanvraag voor een bedrijfsadres in goede orde ontvangen en zullen deze zo spoedig mogelijk behandelen.</p>
<p>Hieronder vindt u een overzicht van uw aanvraag:</p>
<hr>

<h3>Bedrijfsinformatie</h3>
<div class="info-block">
<p><span class="label">Bedrijfsnaam:</span> ${requestData.company_name}</p>
<p><span class="label">Contactpersoon:</span> ${requestData.contact_person}</p>
<p><span class="label">Type bedrijf:</span> ${requestData.business_type}</p>
</div>

<h3>Contactgegevens</h3>
<div class="info-block">
<p><span class="label">E-mail:</span> ${requestData.email}</p>
<p><span class="label">Telefoon:</span> ${requestData.phone || "Niet opgegeven"}</p>
</div>

<h3>Aanvraag Details</h3>
<div class="info-block">
<p><span class="label">Gewenst adrespakket:</span> ${addressTypeLabel}</p>
<p><span class="label">Verwacht postvolume:</span> ${requestData.expected_mail_volume}</p>
<p><span class="label">Extra diensten:</span> ${servicesText}</p>
</div>

${requestData.special_requirements ? `<h3>Bijzondere wensen</h3>
<div class="info-block">
<p>${requestData.special_requirements}</p>
</div>` : ''}

<hr>
<p>Wij nemen binnen 24 uur contact met u op om de volgende stappen te bespreken.</p>
<p>Heeft u nog vragen? Neem dan gerust contact met ons op via ${smtpUsername} of bezoek onze website.</p>

<div class="footer">
<p>Met vriendelijke groet,</p>
<p>${senderName}</p>
</div>
</body>
</html>`;
}
