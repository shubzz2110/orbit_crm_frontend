import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Bell, CheckCircle2, Circle, Loader2, CheckCheck } from "lucide-react";
import { notificationService } from "@/services/notificationService";
import type {
  Notification,
  NotificationFilters,
  NotificationListResponse,
} from "@/lib/types/notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationItem } from "@/components/notifications";
import { useNavigate } from "react-router";
import { getNotificationRoute } from "@/lib/types/notification";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1,
    pageSize: 20,
  });
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params: NotificationFilters = {
        page: pagination.currentPage,
        page_size: pagination.pageSize,
        ordering: "-created_at",
        ...(filter === "unread" && { is_read: false }),
        ...(filter === "read" && { is_read: true }),
      };
      const response: NotificationListResponse = await notificationService.getAll(params);
      setNotifications(response.results || []);
      setPagination((prev) => ({
        ...prev,
        count: response.count || 0,
        next: response.next,
        previous: response.previous,
      }));
    } catch (error: unknown) {
      console.error("Error fetching notifications:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load notifications"
          : "Failed to load notifications";
      toast.error("Failed to load notifications", {
        description: errorMessage,
      });
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      try {
        await notificationService.markRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    // Navigate to entity if available
    const route = getNotificationRoute(notification);
    if (route) {
      navigate(route);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setSubmitting(true);
      await notificationService.markAllRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark all as read");
    } finally {
      setSubmitting(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all your notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllRead}
            disabled={submitting}
            variant="outline"
            className="gap-2"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
          className="gap-2"
        >
          <Circle className="h-4 w-4" />
          Unread
        </Button>
        <Button
          variant={filter === "read" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("read")}
          className="gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Read
        </Button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No notifications</CardTitle>
            <CardDescription>
              {filter === "all"
                ? "You don't have any notifications yet."
                : filter === "unread"
                ? "You don't have any unread notifications."
                : "You don't have any read notifications."}
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-0">
                <NotificationItem
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.count > pagination.pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {notifications.length} of {pagination.count} notifications
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: Math.max(1, prev.currentPage - 1),
                }))
              }
              disabled={!pagination.previous || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
              disabled={!pagination.next || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

