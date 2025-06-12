import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { processEnhancedContractForPdf, generateEnhancedPdfFilename } from "@/utils/enhanced-pdf-processor";

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

  if (!contract) return null;

  const processedContent = processEnhancedContractForPdf(
    contract.contract_templates.content,
    contract.filled_data,
    contract.contract_templates.title
  );

  const handleDownloadPDF = async () => {
    try {
      toast({
        title: "PDF wordt gegenereerd",
        description: "Even geduld...",
      });

      // Create enhanced PDF content
      const pdfHtml = processEnhancedContractForPdf(
        contract.contract_templates.content,
        contract.filled_data,
        contract.contract_templates.title
      );

      // Create temporary iframe for better rendering
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '794px';
      iframe.style.height = '1123px';
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
          setTimeout(resolve, 2000);
        }
      });

      const contentElement = iframeDoc.body;

      // Enhanced html2canvas configuration for better quality
      const canvas = await html2canvas(contentElement, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123,
        removeContainer: false,
        logging: false,
        onclone: (clonedDoc) => {
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

      // Create high-quality PDF
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add first page with high quality
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.98),
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
          canvas.toDataURL('image/jpeg', 0.98),
          'JPEG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      // Generate enhanced filename
      const filename = generateEnhancedPdfFilename(
        contract.contract_templates.title,
        contract.client_name || '',
        contract.client_email
      );

      pdf.save(filename);

      toast({
        title: "PDF gedownload",
        description: "Het contract is succesvol gedownload als professionele PDF.",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {contract.contract_templates.title}
            </div>
            <Button
              onClick={handleDownloadPDF}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </DialogTitle>
          <DialogDescription>
            Professioneel geformateerd contract klaar voor ondertekening.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div
            ref={contentRef}
            className="bg-white mx-auto border border-gray-200 shadow-lg"
            style={{ 
              fontFamily: 'Arial, sans-serif',
              fontSize: '11pt',
              lineHeight: '1.5',
              maxWidth: '210mm',
              minHeight: '297mm',
              padding: '20mm'
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
              <strong>Status:</strong> 
              <span className={`ml-1 px-2 py-1 rounded text-xs ${
                contract.status === 'completed' ? 'bg-green-100 text-green-800' :
                contract.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {contract.status}
              </span>
            </div>
            <div>
              <strong>Datum:</strong> {new Date(contract.created_at).toLocaleDateString('nl-NL')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilledContractViewer;
