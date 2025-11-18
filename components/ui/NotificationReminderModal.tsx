import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";

interface NotificationReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewNotifications: () => void;
  unreadCount: number;
}

export function NotificationReminderModal({
  isOpen,
  onClose,
  onViewNotifications,
  unreadCount
}: NotificationReminderModalProps) {
  const handleViewNotifications = () => {
    onViewNotifications();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            Unread Notifications
          </DialogTitle>
          <DialogDescription className="text-left">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''} that require your attention.
            <br /><br />
            Please check your notifications to stay updated with important updates and announcements.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
          <Button onClick={handleViewNotifications}>
            <Bell className="h-4 w-4 mr-2" />
            View Notifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}