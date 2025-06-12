
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { replacePlaceholders } from "@/utils/contract-placeholder-replacer";
import { processContractForPdf, generatePdfFilename } from "@/utils/pdf-content-processor";

interface FilledContract {
  id: string;
  template_id: string;
  client_email: string;
  client_name: string | null;
  status: string;
  filled_data: any;
  created_at: string;
  completed_at: string | null;
  access_token: string;
  contract_templates: {
    title: string;
    content: string;
  };
}

interface FilledContractViewerProps {
  contract: FilledContract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FilledContractViewer: React.FC<FilledContractViewerProps> = ({
  contract,
  open,
  onOpenChange
}) => {
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const hiddenContentRef = useRef<HTMLDivElement>(null);

  if (!contract) return null;

  const processedContent = replacePlaceholders(
    contract.contract_templates.content,
    contract.filled_data
  );

  const handleDownloadPDF = async () => {
    try {
      toast({
        title: "PDF wordt gegenereerd",
        description: "Even geduld...",
      });

      // Create a hidden container with PDF-optimized content
      const pdfHtml = processContractForPdf(
        contract.contract_templates.content,
        contract.filled_data
      );

      // Create a temporary iframe for better rendering
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '794px'; // A4 width at 96 DPI
      iframe.style.height = '1123px'; // A4 height at 96 DPI
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Cannot access iframe document');
      }

      iframeDoc.open();
      iframeDoc.write(pdfHtml);
      iframeDoc.close();

      // Wait for content to load
      await new Promise(resolve => {
        if (iframe.contentWindow) {
          iframe.contentWindow.onload = resolve;
        } else {
          setTimeout(resolve, 1000);
        }
      });

      const contentElement = iframeDoc.body;

      // Enhanced html2canvas configuration
      const canvas = await html2canvas(contentElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794, // A4 width at 96 DPI
        height: 1123, // A4 height at 96 DPI
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123,
        removeContainer: false,
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied
          const clonedBody = clonedDoc.body;
          if (clonedBody) {
            clonedBody.style.margin = '0';
            clonedBody.style.padding = '0';
            clonedBody.style.width = '794px';
            clonedBody.style.overflow = 'visible';
          }
        }
      });

      // Clean up iframe
      document.body.removeChild(iframe);

      // Create PDF with proper dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add first page
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95), // Use JPEG for smaller file size
        'JPEG',
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      // Generate filename and download
      const filename = generatePdfFilename(
        contract.contract_templates.title,
        contract.client_name || '',
        contract.client_email
      );

      pdf.save(filename);

      toast({
        title: "PDF gedownload",
        description: "Het contract is succesvol gedownload als PDF.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Fout bij PDF generatie",
        description: "Er is een fout opgetreden bij het genereren van de PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {contract.contract_templates.title}
              </div>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </DialogTitle>
            <DialogDescription>
              Bekijk het ingevulde contract en download het als PDF.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div
              ref={contentRef}
              className="bg-white p-8 min-h-[297mm] max-w-[210mm] mx-auto border border-gray-200"
              style={{ 
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: '12pt',
                lineHeight: '1.6',
                color: '#000000'
              }}
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <div>
                <strong>Klant:</strong> {contract.client_name || contract.client_email}
              </div>
              <div>
                <strong>Status:</strong> {contract.status}
              </div>
              <div>
                <strong>Datum:</strong> {new Date(contract.created_at).toLocaleDateString('nl-NL')}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden container for PDF generation */}
      <div 
        ref={hiddenContentRef}
        style={{ 
          position: 'absolute', 
          left: '-9999px',
          width: '794px',
          height: '1123px'
        }}
      />
    </>
  );
};

export default FilledContractViewer;
