import api from "./axios";
import type {
  Lead,
  LeadListResponse,
  LeadFormData,
  LeadFilters,
  LeadActivity,
  LeadActivityFormData,
} from "@/lib/types/lead";

export const leadService = {
  // Get all leads with optional filters
  getAll: async (params?: LeadFilters): Promise<LeadListResponse> => {
    const response = await api.get<LeadListResponse>("/crm/leads/", {
      params,
    });
    return response.data;
  },

  // Get a single lead by ID
  getById: async (id: number): Promise<Lead> => {
    const response = await api.get<Lead>(`/crm/leads/${id}/`);
    return response.data;
  },

  // Create a new lead
  create: async (data: LeadFormData): Promise<Lead> => {
    const response = await api.post<Lead>("/crm/leads/", data);
    return response.data;
  },

  // Update an existing lead
  update: async (id: number, data: Partial<LeadFormData>): Promise<Lead> => {
    const response = await api.patch<Lead>(`/crm/leads/${id}/`, data);
    return response.data;
  },

  // Delete a lead
  delete: async (id: number): Promise<void> => {
    await api.delete(`/crm/leads/${id}/`);
  },

  // Get activities for a lead
  getActivities: async (id: number): Promise<LeadActivity[]> => {
    const response = await api.get<LeadActivity[]>(
      `/crm/leads/${id}/activities/`
    );
    return response.data;
  },

  // Add activity to a lead
  addActivity: async (
    id: number,
    data: Omit<LeadActivityFormData, "lead">
  ): Promise<LeadActivity> => {
    const response = await api.post<LeadActivity>(
      `/crm/leads/${id}/add_activity/`,
      data
    );
    return response.data;
  },

  // Add tags to a lead
  addTags: async (id: number, tags: string[]): Promise<Lead> => {
    const response = await api.post<Lead>(`/crm/leads/${id}/add_tags/`, {
      tags,
    });
    return response.data;
  },

  // Remove tags from a lead
  removeTags: async (id: number, tags: string[]): Promise<Lead> => {
    const response = await api.post<Lead>(`/crm/leads/${id}/remove_tags/`, {
      tags,
    });
    return response.data;
  },

  // Get lead statistics
  getStats: async (params?: LeadFilters): Promise<{
    total: number;
    by_source: Record<string, number>;
    upcoming_followups: number;
  }> => {
    const response = await api.get("/crm/leads/stats/", { params });
    return response.data;
  },
};

export const leadActivityService = {
  // Get all activities with optional filters
  getAll: async (params?: {
    lead?: number;
    activity_type?: string;
    organization?: number;
    ordering?: string;
  }): Promise<LeadActivity[]> => {
    const response = await api.get<LeadActivity[]>("/crm/lead-activities/", {
      params,
    });
    return response.data;
  },

  // Get a single activity by ID
  getById: async (id: number): Promise<LeadActivity> => {
    const response = await api.get<LeadActivity>(
      `/crm/lead-activities/${id}/`
    );
    return response.data;
  },

  // Create a new activity
  create: async (data: LeadActivityFormData): Promise<LeadActivity> => {
    const response = await api.post<LeadActivity>(
      "/crm/lead-activities/",
      data
    );
    return response.data;
  },

  // Update an existing activity
  update: async (
    id: number,
    data: Partial<LeadActivityFormData>
  ): Promise<LeadActivity> => {
    const response = await api.patch<LeadActivity>(
      `/crm/lead-activities/${id}/`,
      data
    );
    return response.data;
  },

  // Delete an activity
  delete: async (id: number): Promise<void> => {
    await api.delete(`/crm/lead-activities/${id}/`);
  },
};

