import api from "./axios";
import type {
  Contact,
  ContactListResponse,
  ContactFormData,
  ContactFilters,
} from "@/lib/types/contact";

export const contactService = {
  // Get all contacts with optional filters
  getAll: async (params?: ContactFilters): Promise<ContactListResponse> => {
    const response = await api.get<ContactListResponse>("/crm/contacts/", {
      params,
    });
    return response.data;
  },

  // Get a single contact by ID
  getById: async (id: number): Promise<Contact> => {
    const response = await api.get<Contact>(`/crm/contacts/${id}/`);
    return response.data;
  },

  // Create a new contact
  create: async (data: ContactFormData): Promise<Contact> => {
    const response = await api.post<Contact>("/crm/contacts/", data);
    return response.data;
  },

  // Update an existing contact
  update: async (id: number, data: Partial<ContactFormData>): Promise<Contact> => {
    const response = await api.patch<Contact>(`/crm/contacts/${id}/`, data);
    return response.data;
  },

  // Delete a contact
  delete: async (id: number): Promise<void> => {
    await api.delete(`/crm/contacts/${id}/`);
  },

  // Update contact activity
  updateActivity: async (
    id: number,
    data: { activity_type: string; activity_at?: string }
  ): Promise<Contact> => {
    const response = await api.post<Contact>(
      `/crm/contacts/${id}/update_activity/`,
      data
    );
    return response.data;
  },

  // Add tags to a contact
  addTags: async (id: number, tags: string[]): Promise<Contact> => {
    const response = await api.post<Contact>(`/crm/contacts/${id}/add_tags/`, {
      tags,
    });
    return response.data;
  },

  // Remove tags from a contact
  removeTags: async (id: number, tags: string[]): Promise<Contact> => {
    const response = await api.post<Contact>(
      `/crm/contacts/${id}/remove_tags/`,
      { tags }
    );
    return response.data;
  },

  // Get contact statistics
  getStats: async (params?: ContactFilters): Promise<{
    total: number;
    active: number;
    archived: number;
    by_lead_status?: Record<string, number>;
    by_lifecycle_stage?: Record<string, number>;
    by_source?: Record<string, number>;
  }> => {
    const response = await api.get("/crm/contacts/stats/", { params });
    return response.data;
  },
};

