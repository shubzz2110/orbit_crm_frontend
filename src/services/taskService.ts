import api from "./axios";
import type {
  Task,
  TaskListResponse,
  TaskFormData,
  TaskFilters,
  TaskStats,
} from "@/lib/types/task";

export const taskService = {
  // Get all tasks with optional filters
  getAll: async (params?: TaskFilters): Promise<TaskListResponse> => {
    const response = await api.get<TaskListResponse>("/crm/tasks/", {
      params,
    });
    return response.data;
  },

  // Get a single task by ID
  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/crm/tasks/${id}/`);
    return response.data;
  },

  // Create a new task
  create: async (data: TaskFormData): Promise<Task> => {
    const formData = new FormData();
    
    // Append all fields to FormData
    formData.append("title", data.title);
    formData.append("priority", data.priority);
    formData.append("status", data.status);
    formData.append("due_date", data.due_date);
    formData.append("organization", data.organization.toString());
    formData.append("repeat_frequency", data.repeat_frequency);
    
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.task_type) {
      formData.append("task_type", data.task_type);
    }
    if (data.reminder_at) {
      formData.append("reminder_at", data.reminder_at);
    }
    if (data.assigned_to) {
      formData.append("assigned_to", data.assigned_to.toString());
    }
    if (data.lead) {
      formData.append("lead", data.lead.toString());
    }
    if (data.contact) {
      formData.append("contact", data.contact.toString());
    }
    if (data.repeat_until) {
      formData.append("repeat_until", data.repeat_until);
    }
    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }
    
    const response = await api.post<Task>("/crm/tasks/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update an existing task
  update: async (id: number, data: Partial<TaskFormData>): Promise<Task> => {
    const formData = new FormData();
    
    // Append only provided fields to FormData
    if (data.title !== undefined) {
      formData.append("title", data.title);
    }
    if (data.description !== undefined) {
      formData.append("description", data.description || "");
    }
    if (data.task_type !== undefined) {
      formData.append("task_type", data.task_type || "");
    }
    if (data.priority !== undefined) {
      formData.append("priority", data.priority);
    }
    if (data.status !== undefined) {
      formData.append("status", data.status);
    }
    if (data.due_date !== undefined) {
      formData.append("due_date", data.due_date);
    }
    if (data.reminder_at !== undefined) {
      formData.append("reminder_at", data.reminder_at || "");
    }
    if (data.assigned_to !== undefined) {
      formData.append("assigned_to", data.assigned_to?.toString() || "");
    }
    if (data.organization !== undefined) {
      formData.append("organization", data.organization.toString());
    }
    if (data.lead !== undefined) {
      formData.append("lead", data.lead?.toString() || "");
    }
    if (data.contact !== undefined) {
      formData.append("contact", data.contact?.toString() || "");
    }
    if (data.repeat_frequency !== undefined) {
      formData.append("repeat_frequency", data.repeat_frequency);
    }
    if (data.repeat_until !== undefined) {
      formData.append("repeat_until", data.repeat_until || "");
    }
    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }
    
    const response = await api.patch<Task>(`/crm/tasks/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete a task
  delete: async (id: number): Promise<void> => {
    await api.delete(`/crm/tasks/${id}/`);
  },

  // Get task statistics
  getStats: async (params?: TaskFilters): Promise<TaskStats> => {
    const response = await api.get<TaskStats>("/crm/tasks/stats/", {
      params,
    });
    return response.data;
  },
};

