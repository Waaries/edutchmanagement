
export const getPdfStyles = () => `
  <style>
    /* PDF-specific styles */
    .pdf-content {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000000;
      background: white;
      padding: 40px;
      max-width: none;
      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      margin: 0;
    }
    
    .pdf-content * {
      font-family: inherit !important;
      color: #000000 !important;
      background: transparent !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    .pdf-content h1 {
      font-size: 18pt;
      font-weight: bold;
      margin: 0 0 20pt 0;
      text-align: center;
      page-break-after: avoid;
    }
    
    .pdf-content h2 {
      font-size: 16pt;
      font-weight: bold;
      margin: 16pt 0 12pt 0;
      page-break-after: avoid;
    }
    
    .pdf-content h3 {
      font-size: 14pt;
      font-weight: bold;
      margin: 14pt 0 10pt 0;
      page-break-after: avoid;
    }
    
    .pdf-content p {
      margin: 0 0 12pt 0;
      text-align: justify;
      orphans: 2;
      widows: 2;
    }
    
    .pdf-content ul, .pdf-content ol {
      margin: 12pt 0;
      padding-left: 20pt;
    }
    
    .pdf-content li {
      margin: 6pt 0;
    }
    
    .pdf-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0;
      page-break-inside: avoid;
    }
    
    .pdf-content th, .pdf-content td {
      border: 1pt solid #000000;
      padding: 8pt;
      text-align: left;
      vertical-align: top;
    }
    
    .pdf-content th {
      font-weight: bold;
      background: #f0f0f0 !important;
    }
    
    .pdf-content .page-break {
      page-break-before: always;
    }
    
    .pdf-content .no-break {
      page-break-inside: avoid;
    }
    
    /* Signature section */
    .pdf-content .signature-section {
      margin-top: 40pt;
      page-break-inside: avoid;
    }
    
    .pdf-content .signature-line {
      border-bottom: 1pt solid #000000;
      width: 200pt;
      height: 30pt;
      margin: 20pt 0 5pt 0;
      display: inline-block;
    }
    
    .pdf-content .signature-label {
      font-size: 10pt;
      margin-top: 5pt;
    }
    
    /* Remove any web-specific elements */
    .pdf-content button,
    .pdf-content .btn,
    .pdf-content .button,
    .pdf-content input[type="button"],
    .pdf-content input[type="submit"] {
      display: none !important;
    }
    
    /* Ensure proper text rendering */
    .pdf-content {
      -webkit-font-smoothing: auto;
      -moz-osx-font-smoothing: auto;
      text-rendering: optimizeLegibility;
    }
  </style>
`;
