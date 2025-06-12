
import { replacePlaceholders } from './contract-placeholder-replacer';
import { getPdfStyles } from './pdf-styles';

export const processContractForPdf = (content: string, filledData: Record<string, any>): string => {
  // Replace placeholders first
  let processedContent = replacePlaceholders(content, filledData);
  
  // Clean up HTML for better PDF rendering
  processedContent = cleanHtmlForPdf(processedContent);
  
  // Wrap in PDF-optimized structure
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${getPdfStyles()}
    </head>
    <body>
      <div class="pdf-content">
        ${processedContent}
      </div>
    </body>
    </html>
  `;
};

const cleanHtmlForPdf = (content: string): string => {
  let cleaned = content;
  
  // Remove problematic CSS classes and inline styles
  cleaned = cleaned.replace(/class="[^"]*"/g, '');
  cleaned = cleaned.replace(/style="[^"]*"/g, '');
  
  // Convert div elements to appropriate semantic elements
  cleaned = cleaned.replace(/<div([^>]*)>/g, '<p$1>');
  cleaned = cleaned.replace(/<\/div>/g, '</p>');
  
  // Ensure proper paragraph spacing
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, '');
  cleaned = cleaned.replace(/<p>(\s*<br\s*\/?>\s*)+<\/p>/g, '<p></p>');
  
  // Handle line breaks properly
  cleaned = cleaned.replace(/<br\s*\/?>/g, '</p><p>');
  
  // Clean up empty paragraphs
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, '');
  
  // Add signature section if not present
  if (!cleaned.includes('signature') && !cleaned.includes('ondertekening')) {
    cleaned += `
      <div class="signature-section">
        <h3>Ondertekening</h3>
        <p>Door ondertekening van dit contract gaan beide partijen akkoord met de bovenstaande voorwaarden.</p>
        <br><br>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <div class="signature-line"></div>
            <div class="signature-label">Handtekening opdrachtgever</div>
            <br>
            <div class="signature-line"></div>
            <div class="signature-label">Datum</div>
          </div>
          <div>
            <div class="signature-line"></div>
            <div class="signature-label">Handtekening opdrachtnemer</div>
            <br>
            <div class="signature-line"></div>
            <div class="signature-label">Datum</div>
          </div>
        </div>
      </div>
    `;
  }
  
  return cleaned;
};

// Generate a clean filename for the PDF
export const generatePdfFilename = (templateTitle: string, clientName: string, clientEmail: string): string => {
  const cleanTitle = templateTitle.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanClient = (clientName || clientEmail).replace(/[^a-zA-Z0-9]/g, '_');
  const date = new Date().toISOString().split('T')[0];
  
  return `${cleanTitle}_${cleanClient}_${date}.pdf`;
};
