import { Card, CardContent } from "@/components/ui/card";

const MapSection = () => {
  return (
    <Card className="overflow-hidden bg-white border-slate-200 shadow-sm">
      <CardContent className="p-0">
        <div className="h-80 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2438.4499798694825!2d4.979604376940437!3d52.30021574461772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c60be2375814c1%3A0x4e2e41c3de0fc814!2sReigersbos%20100%2C%201107%20ES%20Amsterdam!5e0!3m2!1sen!2snl!4v1697029838428!5m2!1sen!2snl" 
            width="100%" 
            height="100%" 
            className="border-0"
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location Map"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapSection;