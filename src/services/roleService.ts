import api from "./axios";
import type { Role, RoleListResponse, RoleFormData } from "@/lib/types/role";

export const roleService = {
  // Get all roles
  getAll: async (params?: {
    search?: string;
    ordering?: string;
  }): Promise<RoleListResponse> => {
    const response = await api.get<RoleListResponse>("/crm/roles/", { params });
    return response.data;
  },

  // Get a single role by ID
  getById: async (id: number): Promise<Role> => {
    const response = await api.get<Role>(`/crm/roles/${id}/`);
    return response.data;
  },

  // Create a new role
  create: async (data: RoleFormData): Promise<Role> => {
    const response = await api.post<Role>("/crm/roles/", data);
    return response.data;
  },

  // Update an existing role
  update: async (id: number, data: Partial<RoleFormData>): Promise<Role> => {
    const response = await api.patch<Role>(`/crm/roles/${id}/`, data);
    return response.data;
  },

  // Delete a role
  delete: async (id: number): Promise<void> => {
    await api.delete(`/crm/roles/${id}/`);
  },

  // Assign permissions to a role
  assignPermissions: async (id: number, permissionIds: number[]): Promise<Role> => {
    const response = await api.post<Role>(`/crm/roles/${id}/permissions/`, {
      permissions: permissionIds,
    });
    return response.data;
  },
};

