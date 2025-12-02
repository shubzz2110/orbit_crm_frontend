import api from "./axios";
import type { Organization, OrganizationListResponse, OrganizationFormData } from "@/lib/types/organization";

export const organizationService = {
  // Get all organizations with optional filters
  getAll: async (params?: {
    search?: string;
    visible?: boolean;
    ordering?: string;
    page?: number;
  }): Promise<OrganizationListResponse> => {
    const response = await api.get<OrganizationListResponse>("/crm/organizations/", { params });
    return response.data;
  },

  // Get a single organization by ID
  getById: async (id: number): Promise<Organization> => {
    const response = await api.get<Organization>(`/crm/organizations/${id}/`);
    return response.data;
  },

  // Create a new organization
  create: async (data: OrganizationFormData): Promise<Organization> => {
    const response = await api.post<Organization>("/crm/organizations/", data);
    return response.data;
  },

  // Update an existing organization
  update: async (id: number, data: Partial<OrganizationFormData>): Promise<Organization> => {
    const response = await api.patch<Organization>(`/crm/organizations/${id}/`, data);
    return response.data;
  },

  // Delete an organization
  delete: async (id: number): Promise<void> => {
    await api.delete(`/crm/organizations/${id}/`);
  },

  // Get roles for an organization
  getRoles: async (id: number) => {
    const response = await api.get(`/crm/organizations/${id}/roles/`);
    return response.data;
  },

  // Get permissions for an organization
  getPermissions: async (id: number) => {
    const response = await api.get(`/crm/organizations/${id}/permissions/`);
    return response.data;
  },
};

