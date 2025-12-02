import api from "./axios";
import type {
  Notification,
  NotificationListResponse,
  NotificationFilters,
  UnreadCountResponse,
} from "@/lib/types/notification";

export const notificationService = {
  // Get all notifications with optional filters
  getAll: async (params?: NotificationFilters): Promise<NotificationListResponse> => {
    const response = await api.get<NotificationListResponse>("/crm/notifications/", {
      params,
    });
    return response.data;
  },

  // Get a single notification by ID
  getById: async (id: number): Promise<Notification> => {
    const response = await api.get<Notification>(`/crm/notifications/${id}/`);
    return response.data;
  },

  // Mark a notification as read
  markRead: async (id: number): Promise<Notification> => {
    const response = await api.post<Notification>(`/crm/notifications/${id}/mark_read/`);
    return response.data;
  },

  // Mark all notifications as read
  markAllRead: async (): Promise<{ message: string; updated_count: number }> => {
    const response = await api.post<{ message: string; updated_count: number }>(
      "/crm/notifications/mark_all_read/"
    );
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await api.get<UnreadCountResponse>("/crm/notifications/unread_count/");
    return response.data;
  },
};

