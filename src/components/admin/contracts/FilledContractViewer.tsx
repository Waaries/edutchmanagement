
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { replacePlaceholders } from "@/utils/contract-placeholder-replacer";

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

  const processedContent = replacePlaceholders(
    contract.contract_templates.content,
    contract.filled_data
  );

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      toast({
        title: "PDF wordt gegenereerd",
        description: "Even geduld...",
      });

      // Create canvas from the content
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const filename = `${contract.contract_templates.title}_${contract.client_name || contract.client_email}_${new Date().toISOString().split('T')[0]}.pdf`;

      // Download the PDF
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
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div
            ref={contentRef}
            className="bg-white p-8"
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
  );
};

export default FilledContractViewer;
