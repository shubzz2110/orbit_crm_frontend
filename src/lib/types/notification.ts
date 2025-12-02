export interface Notification {
  id: number;
  type: string;
  type_display: string;
  title: string;
  message: string;
  entity_type: string | null;
  entity_id: number | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  organization: number;
}

export interface NotificationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

export interface NotificationFilters {
  is_read?: boolean;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface UnreadCountResponse {
  count: number;
}

export const NOTIFICATION_TYPES = {
  TASK_CREATED: 'task_created',
  TASK_ASSIGNED: 'task_assigned',
  TASK_DUE: 'task_due',
  TASK_OVERDUE: 'task_overdue',
  TASK_COMPLETED: 'task_completed',
  DEAL_CREATED: 'deal_created',
  DEAL_ASSIGNED: 'deal_assigned',
  DEAL_STAGE_CHANGED: 'deal_stage_changed',
  DEAL_WON: 'deal_won',
  DEAL_LOST: 'deal_lost',
  CONTACT_CREATED: 'contact_created',
  CONTACT_UPDATED: 'contact_updated',
  LEAD_CREATED: 'lead_created',
  LEAD_CONVERTED: 'lead_converted',
  SYSTEM: 'system',
} as const;

export const getNotificationRoute = (notification: Notification): string | null => {
  if (!notification.entity_type || !notification.entity_id) {
    return null;
  }

  const routes: Record<string, () => string> = {
    task: () => `/admin/tasks`,
    deal: () => `/admin/deals`,
    contact: () => `/admin/contacts`,
    lead: () => `/admin/leads`,
  };

  const routeFn = routes[notification.entity_type];
  return routeFn ? routeFn() : null;
};

