import { CheckCircle2, Circle } from "lucide-react";
import type { Notification } from "@/lib/types/notification";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const timeAgo = formatTimeAgo(notification.created_at);

  return (
    <div
      className={cn(
        "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
        !notification.is_read && "bg-muted/30"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {notification.is_read ? (
            <Circle className="h-4 w-4 text-muted-foreground" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-sm font-medium",
                !notification.is_read && "font-semibold"
              )}
            >
              {notification.title}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            {notification.type_display && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {notification.type_display}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

