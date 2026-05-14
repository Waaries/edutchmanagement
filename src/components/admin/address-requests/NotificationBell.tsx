
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, X } from "lucide-react";

interface NotificationBellProps {
  notifications: string[];
  onClearNotification: (requestId: string) => void;
  onClearAll: () => void;
}

const NotificationBell = ({ notifications, onClearNotification, onClearAll }: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (notifications.length === 0) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {notifications.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notificaties</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-xs"
              >
                Wis alles
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                Geen nieuwe notificaties
              </p>
            ) : (
              notifications.map((requestId) => (
                <div
                  key={requestId}
                  className="flex items-center justify-between p-2 bg-blue-50 rounded-md"
                >
                  <span className="text-sm">
                    Nieuwe aanvraag ontvangen
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onClearNotification(requestId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
