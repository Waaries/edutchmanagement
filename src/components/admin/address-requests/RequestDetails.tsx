
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Clock } from "lucide-react";

interface RequestDetailsProps {
  contactPerson: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  expectedMailVolume: string;
  additionalServices: string[];
  specialRequirements: string;
}

const RequestDetails = ({
  contactPerson,
  email,
  phone,
  createdAt,
  updatedAt,
  expectedMailVolume,
  additionalServices,
  specialRequirements
}: RequestDetailsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <User className="h-4 w-4" />
          <span>{contactPerson}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Mail className="h-4 w-4" />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Phone className="h-4 w-4" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="h-4 w-4" />
          <span>{new Date(createdAt).toLocaleDateString('nl-NL')}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm">
          <span className="font-medium">Verwacht postvolume:</span> {expectedMailVolume}
        </div>
        
        {additionalServices?.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">Extra diensten:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {additionalServices.map((service, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {specialRequirements && (
          <div className="text-sm">
            <span className="font-medium">Bijzondere wensen:</span>
            <p className="text-slate-400 mt-1 bg-white/5 p-2 rounded">{specialRequirements}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 mt-4 pt-4 border-t">
        <Clock className="h-3 w-3" />
        <span>
          Laatst bijgewerkt: {new Date(updatedAt).toLocaleDateString('nl-NL')} om {new Date(updatedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </>
  );
};

export default RequestDetails;
