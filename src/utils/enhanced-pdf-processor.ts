
import { replacePlaceholders } from './contract-placeholder-replacer';
import { getEnhancedPdfStyles } from './enhanced-pdf-styles';

export const processEnhancedContractForPdf = (
  content: string, 
  filledData: Record<string, any>,
  templateTitle: string
): string => {
  // Replace placeholders first
  let processedContent = replacePlaceholders(content, filledData);
  
  // Structure the content with professional formatting
  processedContent = structureContractContent(processedContent, templateTitle, filledData);
  
  // Clean and optimize for PDF
  processedContent = optimizeForPdf(processedContent);
  
  // Wrap in enhanced PDF structure
  return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${templateTitle}</title>
      ${getEnhancedPdfStyles()}
    </head>
    <body>
      <div class="pdf-content">
        ${processedContent}
      </div>
    </body>
    </html>
  `;
};

const structureContractContent = (
  content: string, 
  title: string, 
  filledData: Record<string, any>
): string => {
  // Add professional header
  const header = `
    <div class="contract-header">
      <h1 class="contract-title">${title}</h1>
      <p class="contract-subtitle">Bedrijfsadres Service Overeenkomst</p>
    </div>
  `;
  
  // Add party information section if data is available
  const partyInfo = createPartyInfoSection(filledData);
  
  // Structure the main content
  let structuredContent = content;
  
  // Add section headers where appropriate
  structuredContent = addSectionHeaders(structuredContent);
  
  // Add signature section if not present
  const signatureSection = createSignatureSection();
  
  // Add footer
  const footer = createFooter();
  
  return `
    ${header}
    ${partyInfo}
    <div class="contract-content">
      ${structuredContent}
    </div>
    ${signatureSection}
    ${footer}
  `;
};

const createPartyInfoSection = (filledData: Record<string, any>): string => {
  const clientName = filledData.bedrijfsnaam || filledData.client_name || '[Bedrijfsnaam]';
  const clientEmail = filledData.email || filledData.client_email || '[E-mail]';
  const clientAddress = filledData.bedrijfsadres || filledData.address || '[Adres]';
  const kvkNumber = filledData.kvk_nummer || '[KvK Nummer]';
  
  return `
    <div class="party-info keep-together">
      <div class="party-box">
        <div class="party-title">Opdrachtgever</div>
        <div class="party-details">
          <strong>${clientName}</strong><br>
          KvK: ${kvkNumber}<br>
          E-mail: ${clientEmail}<br>
          Adres: ${clientAddress.replace(/\n/g, '<br>')}
        </div>
      </div>
      <div class="party-box">
        <div class="party-title">Opdrachtnemer</div>
        <div class="party-details">
          <strong>Jouw Bedrijfsnaam</strong><br>
          KvK: [Jouw KvK Nummer]<br>
          E-mail: [Jouw E-mail]<br>
          Adres: [Jouw Adres]
        </div>
      </div>
    </div>
  `;
};

const addSectionHeaders = (content: string): string => {
  let processedContent = content;
  
  // Common contract sections
  const sectionMappings = [
    { pattern: /artikel\s+1[:\.]?\s*(voorwerp|onderwerp|object)/i, title: 'Artikel 1: Voorwerp van de Overeenkomst' },
    { pattern: /artikel\s+2[:\.]?\s*(diensten|services)/i, title: 'Artikel 2: Dienstverlening' },
    { pattern: /artikel\s+3[:\.]?\s*(vergoeding|betaling|kosten)/i, title: 'Artikel 3: Vergoeding en Betaling' },
    { pattern: /artikel\s+4[:\.]?\s*(looptijd|duur)/i, title: 'Artikel 4: Looptijd' },
    { pattern: /artikel\s+5[:\.]?\s*(opzegging|beëindiging)/i, title: 'Artikel 5: Opzegging' },
    { pattern: /artikel\s+6[:\.]?\s*(aansprakelijkheid)/i, title: 'Artikel 6: Aansprakelijkheid' },
    { pattern: /artikel\s+7[:\.]?\s*(toepasselijk\s+recht|rechtskeuze)/i, title: 'Artikel 7: Toepasselijk Recht' }
  ];
  
  sectionMappings.forEach(({ pattern, title }) => {
    processedContent = processedContent.replace(pattern, `<div class="section-header">${title}</div>`);
  });
  
  return processedContent;
};

const createSignatureSection = (): string => {
  const currentDate = new Date().toLocaleDateString('nl-NL');
  
  return `
    <div class="signature-section">
      <div class="section-header">Ondertekening</div>
      <p class="intro-text">
        Door ondertekening van deze overeenkomst verklaren beide partijen akkoord te gaan 
        met alle bovenstaande voorwaarden en bepalingen.
      </p>
      
      <div class="signature-grid">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Handtekening Opdrachtgever</div>
          <div class="date-line"></div>
          <div class="signature-label">Datum</div>
        </div>
        
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Handtekening Opdrachtnemer</div>
          <div class="date-line"></div>
          <div class="signature-label">Datum</div>
        </div>
      </div>
      
      <p style="margin-top: 20pt; font-size: 9pt; color: #6b7280; text-align: center;">
        Dit contract is opgesteld op ${currentDate}
      </p>
    </div>
  `;
};

const createFooter = (): string => {
  return `
    <div class="contract-footer">
      <p>
        Deze overeenkomst is onderworpen aan het Nederlandse recht. 
        Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
      </p>
    </div>
  `;
};

const optimizeForPdf = (content: string): string => {
  let optimized = content;
  
  // Clean up HTML for better PDF rendering
  optimized = optimized.replace(/class="[^"]*"/g, '');
  optimized = optimized.replace(/style="[^"]*"/g, '');
  
  // Ensure proper paragraph structure
  optimized = optimized.replace(/<div([^>]*)>/g, '<p$1>');
  optimized = optimized.replace(/<\/div>/g, '</p>');
  
  // Handle line breaks
  optimized = optimized.replace(/<br\s*\/?>/g, '</p><p>');
  
  // Clean up empty paragraphs
  optimized = optimized.replace(/<p>\s*<\/p>/g, '');
  
  // Highlight unfilled placeholders
  optimized = optimized.replace(/\[([^\]]+)\]/g, '<span class="field-placeholder">[$1]</span>');
  
  return optimized;
};

// Enhanced filename generator
export const generateEnhancedPdfFilename = (
  templateTitle: string, 
  clientName: string, 
  clientEmail: string
): string => {
  const cleanTitle = templateTitle.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanClient = (clientName || clientEmail).replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = new Date().toISOString().split('T')[0];
  
  return `Contract_${cleanTitle}_${cleanClient}_${timestamp}.pdf`;
};
