
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download, Maximize2, FileText, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { processEnhancedContractForPdf, generateEnhancedPdfFilename } from "@/utils/enhanced-pdf-processor";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ContractTemplate {
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
}

interface TemplateField {
  id?: string;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'phone' | 'select' | 'checkbox';
  field_options?: string[];
  is_required: boolean;
  placeholder?: string;
  sort_order: number;
}

interface EnhancedContractPreviewProps {
  template: ContractTemplate;
  fields: TemplateField[];
  sampleData?: Record<string, any>;
}

const EnhancedContractPreview: React.FC<EnhancedContractPreviewProps> = ({ 
  template, 
  fields, 
  sampleData = {} 
}) => {
  const { toast } = useToast();
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const generatePreviewContent = () => {
    let content = template.content;
    
    // Replace field placeholders with sample data or highlighted placeholders
    fields.forEach(field => {
      const placeholder = `{{${field.field_name}}}`;
      const replacement = sampleData[field.field_name] || `[${field.field_label}]`;
      content = content.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), replacement);
    });
    
    return content;
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      
      toast({
        title: "PDF wordt gegenereerd",
        description: "Even geduld...",
      });

      // Create enhanced PDF content
      const pdfHtml = processEnhancedContractForPdf(
        template.content,
        sampleData,
        template.title
      );

      // Create temporary iframe for rendering
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
          setTimeout(resolve, 1500);
        }
      });

      const contentElement = iframeDoc.body;

      // Generate canvas with high quality
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
        logging: false
      });

      // Clean up iframe
      document.body.removeChild(iframe);

      // Create PDF
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.98),
        'JPEG',
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

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

      const filename = generateEnhancedPdfFilename(
        template.title,
        sampleData.bedrijfsnaam || sampleData.client_name || '',
        sampleData.email || sampleData.client_email || ''
      );

      pdf.save(filename);

      toast({
        title: "PDF gedownload",
        description: "Het contract voorbeeld is succesvol gedownload.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Fout bij PDF generatie",
        description: "Er is een fout opgetreden bij het genereren van de PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const previewContent = generatePreviewContent();
  const processedHtml = processEnhancedContractForPdf(previewContent, sampleData, template.title);

  return (
    <>
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Contract Voorbeeld
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Professionele preview van hoe het contract eruit zal zien
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFullScreenOpen(true)}
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Volledig scherm
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
              >
                <Download className="h-3 w-3 mr-1" />
                {isGeneratingPdf ? 'Genereren...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Preview Container */}
          <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
            <div 
              className="p-6 min-h-[500px] max-h-[600px] overflow-y-auto"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: '11pt',
                lineHeight: '1.5'
              }}
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
          </div>
          
          {/* Field Summary */}
          {fields.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium mb-3 text-blue-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Te invullen velden ({fields.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700">{field.field_label}</span>
                    {field.is_required && (
                      <span className="text-red-500 text-xs font-medium">*Verplicht</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Data Info */}
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Tip:</strong> Dit voorbeeld gebruikt voorbeeldgegevens. 
              De echte contracten worden gevuld met de werkelijke gegevens van uw klanten.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Full Screen Dialog */}
      <Dialog open={isFullScreenOpen} onOpenChange={setIsFullScreenOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Contract Preview - {template.title}</span>
              <Button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPdf ? 'Genereren...' : 'Download PDF'}
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div
              className="bg-white p-8 mx-auto border border-gray-200 shadow-lg"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: '11pt',
                lineHeight: '1.5',
                maxWidth: '210mm',
                minHeight: '297mm'
              }}
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedContractPreview;
