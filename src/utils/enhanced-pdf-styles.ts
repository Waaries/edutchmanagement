
export const getEnhancedPdfStyles = () => `
  <style>
    /* Professional PDF styles */
    @page {
      size: A4;
      margin: 25mm 20mm 25mm 20mm;
    }
    
    .pdf-content {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      background: white;
      padding: 0;
      max-width: none;
      width: 100%;
      min-height: 100%;
      box-sizing: border-box;
      margin: 0;
    }
    
    .pdf-content * {
      font-family: inherit !important;
      color: #1a1a1a !important;
      background: transparent !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    /* Header Section */
    .contract-header {
      text-align: center;
      margin-bottom: 30pt;
      padding-bottom: 15pt;
      border-bottom: 2pt solid #2563eb;
    }
    
    .contract-title {
      font-size: 20pt;
      font-weight: bold;
      color: #1e40af !important;
      margin: 0 0 10pt 0;
      text-transform: uppercase;
      letter-spacing: 1pt;
    }
    
    .contract-subtitle {
      font-size: 12pt;
      color: #6b7280 !important;
      margin: 0;
      font-style: italic;
    }
    
    /* Section Headers */
    .section-header {
      font-size: 14pt;
      font-weight: bold;
      color: #1e40af !important;
      margin: 25pt 0 15pt 0;
      padding: 8pt 12pt;
      background: #f8fafc !important;
      border-left: 4pt solid #2563eb;
      page-break-after: avoid;
    }
    
    .subsection-header {
      font-size: 12pt;
      font-weight: bold;
      color: #374151 !important;
      margin: 20pt 0 10pt 0;
      page-break-after: avoid;
    }
    
    /* Paragraphs and Text */
    .pdf-content p {
      margin: 0 0 12pt 0;
      text-align: justify;
      orphans: 2;
      widows: 2;
    }
    
    .pdf-content .intro-text {
      font-size: 12pt;
      margin-bottom: 20pt;
      padding: 15pt;
      background: #f1f5f9 !important;
      border-radius: 4pt;
      border: 1pt solid #cbd5e1;
    }
    
    /* Lists */
    .pdf-content ul, .pdf-content ol {
      margin: 12pt 0 12pt 20pt;
      padding-left: 0;
    }
    
    .pdf-content li {
      margin: 8pt 0;
      line-height: 1.6;
    }
    
    /* Tables */
    .pdf-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 15pt 0;
      page-break-inside: avoid;
    }
    
    .pdf-content th {
      background: #1e40af !important;
      color: white !important;
      font-weight: bold;
      padding: 10pt;
      text-align: left;
      border: 1pt solid #1e40af;
    }
    
    .pdf-content td {
      padding: 8pt 10pt;
      border: 1pt solid #cbd5e1;
      vertical-align: top;
    }
    
    .pdf-content tr:nth-child(even) td {
      background: #f8fafc !important;
    }
    
    /* Party Information */
    .party-info {
      display: flex;
      justify-content: space-between;
      margin: 20pt 0;
      page-break-inside: avoid;
    }
    
    .party-box {
      width: 48%;
      padding: 15pt;
      border: 1pt solid #cbd5e1;
      border-radius: 4pt;
      background: #f8fafc !important;
    }
    
    .party-title {
      font-weight: bold;
      font-size: 12pt;
      color: #1e40af !important;
      margin-bottom: 10pt;
      text-transform: uppercase;
    }
    
    .party-details {
      font-size: 10pt;
      line-height: 1.4;
    }
    
    /* Field Placeholders */
    .field-placeholder {
      background: #fef3c7 !important;
      border: 1pt dashed #f59e0b;
      padding: 4pt 8pt;
      font-weight: bold;
      color: #92400e !important;
      border-radius: 2pt;
    }
    
    /* Signature Section */
    .signature-section {
      margin-top: 40pt;
      page-break-inside: avoid;
      border-top: 1pt solid #e5e7eb;
      padding-top: 20pt;
    }
    
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30pt;
      margin-top: 20pt;
    }
    
    .signature-box {
      text-align: center;
    }
    
    .signature-line {
      border-bottom: 1pt solid #374151;
      width: 100%;
      height: 40pt;
      margin: 15pt 0 8pt 0;
      position: relative;
    }
    
    .signature-label {
      font-size: 10pt;
      color: #6b7280 !important;
      margin-top: 5pt;
      font-weight: bold;
    }
    
    .date-line {
      border-bottom: 1pt solid #374151;
      width: 120pt;
      height: 25pt;
      margin: 10pt auto 5pt auto;
    }
    
    /* Footer */
    .contract-footer {
      margin-top: 30pt;
      padding-top: 15pt;
      border-top: 1pt solid #e5e7eb;
      font-size: 9pt;
      color: #6b7280 !important;
      text-align: center;
    }
    
    /* Page Break Controls */
    .page-break {
      page-break-before: always;
    }
    
    .no-break {
      page-break-inside: avoid;
    }
    
    .keep-together {
      page-break-inside: avoid;
    }
    
    /* Print Optimizations */
    .pdf-content {
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }
    
    /* Remove web elements */
    .pdf-content button,
    .pdf-content .btn,
    .pdf-content .button,
    .pdf-content input[type="button"],
    .pdf-content input[type="submit"],
    .pdf-content .no-print {
      display: none !important;
    }
  </style>
`;
