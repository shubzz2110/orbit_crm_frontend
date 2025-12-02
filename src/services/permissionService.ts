import api from "./axios";
import type {
  Permission,
  PermissionListResponse,
  PermissionFormData,
} from "@/lib/types/role";

export const permissionService = {
  // Get all permissions
  getAll: async (params?: {
    search?: string;
    ordering?: string;
    content_type?: string;
  }): Promise<PermissionListResponse> => {
    const response = await api.get<PermissionListResponse>("/crm/permissions/", {
      params,
    });
    return response.data;
  },

  // Get a single permission by ID
  getById: async (id: number): Promise<Permission> => {
    const response = await api.get<Permission>(`/crm/permissions/${id}/`);
    return response.data;
  },

  // Create a new permission
  create: async (data: PermissionFormData): Promise<Permission> => {
    const response = await api.post<Permission>("/crm/permissions/", data);
    return response.data;
  },

  // Update an existing permission
  update: async (
    id: number,
    data: Partial<PermissionFormData>
  ): Promise<Permission> => {
    const response = await api.patch<Permission>(
      `/crm/permissions/${id}/`,
      data
    );
    return response.data;
  },

  // Delete a permission
  delete: async (id: number): Promise<void> => {
    await api.delete(`/crm/permissions/${id}/`);
  },
};

