export type TaskType = "Call" | "Email" | "Meeting" | "Follow-up" | "Demo" | "Other";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "To Do" | "In Progress" | "Completed" | "Cancelled";
export type RepeatFrequency = "None" | "Daily" | "Weekly" | "Monthly";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  task_type?: TaskType | null;
  task_type_display?: string;
  priority: TaskPriority;
  priority_display?: string;
  status: TaskStatus;
  status_display?: string;
  due_date: string;
  reminder_at?: string | null;
  assigned_to?: number | null;
  assigned_to_email?: string;
  assigned_to_full_name?: string;
  created_by?: number | null;
  created_by_email?: string;
  created_by_full_name?: string;
  organization: number;
  organization_name?: string;
  attachment?: string | null;
  attachment_url?: string | null;
  lead?: number | null;
  lead_name?: string;
  contact?: number | null;
  contact_full_name?: string;
  repeat_frequency: RepeatFrequency;
  repeat_frequency_display?: string;
  repeat_until?: string | null;
  is_overdue?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export interface TaskFormData {
  title: string;
  description?: string | null;
  task_type?: TaskType | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  reminder_at?: string | null;
  assigned_to?: number | null;
  organization: number;
  attachment?: File | null;
  lead?: number | null;
  contact?: number | null;
  repeat_frequency: RepeatFrequency;
  repeat_until?: string | null;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  task_type?: TaskType;
  assigned_to?: number;
  lead?: number;
  contact?: number;
  overdue?: boolean;
  upcoming?: boolean;
  organization?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface TaskStats {
  total: number;
  by_status: Record<TaskStatus, number>;
  by_priority: Record<TaskPriority, number>;
  by_task_type: Record<string, number>;
  overdue: number;
  upcoming: number;
}

