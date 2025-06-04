
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface AdminNotesSectionProps {
  requestId: string;
  adminNotes: string;
  onUpdateNotes: (requestId: string, notes: string) => Promise<void>;
}

const AdminNotesSection = ({ requestId, adminNotes, onUpdateNotes }: AdminNotesSectionProps) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState("");

  const handleEditClick = () => {
    setEditingNotes(true);
    setTempNotes(adminNotes || "");
  };

  const handleSave = async () => {
    await onUpdateNotes(requestId, tempNotes);
    setEditingNotes(false);
    setTempNotes("");
  };

  const handleCancel = () => {
    setEditingNotes(false);
    setTempNotes("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Admin notitie:
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditClick}
        >
          {adminNotes ? "Bewerken" : "Toevoegen"}
        </Button>
      </div>
      
      {editingNotes ? (
        <div className="space-y-2">
          <Textarea
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            placeholder="Voeg een notitie toe voor de klant..."
            rows={3}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Opslaan
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Annuleren
            </Button>
          </div>
        </div>
      ) : (
        adminNotes && (
          <p className="text-sm bg-blue-50 p-3 rounded-md text-blue-800">
            {adminNotes}
          </p>
        )
      )}
    </div>
  );
};

export default AdminNotesSection;
