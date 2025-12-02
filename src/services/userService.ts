import api from "./axios";
import type { User, UserListResponse, UserFormData } from "@/lib/types/user";

export type UserProfileUpdateData = {
  full_name?: string;
  profile_picture?: string;
  timezone?: string;
  language?: string;
  password?: string;
  password_confirm?: string;
};

export interface RoleUser {
  id: number;
  role: number | { id: number; name: string };
  role_name?: string;
  user: number;
  user_email?: string;
  created_at?: string;
  updated_at?: string;
}

export const userService = {
  // Get all users (filtered by admin's organization)
  getAll: async (params?: {
    search?: string;
    ordering?: string;
  }): Promise<UserListResponse | User[]> => {
    const response = await api.get<UserListResponse | User[]>("/accounts/users/", { params });
    return response.data;
  },

  // Get a single user by ID
  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/accounts/users/${id}/`);
    return response.data;
  },

  // Create a new user (admin only)
  create: async (data: UserFormData): Promise<User> => {
    const response = await api.post<User>("/accounts/users/", data);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/accounts/profile/");
    return response.data;
  },

  // Update current user profile
  updateProfile: async (data: UserProfileUpdateData): Promise<User> => {
    const response = await api.patch<User>("/accounts/profile/update/", data);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    const response = await api.patch<User>("/accounts/profile/update/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Assign role to user
  assignRole: async (roleId: number, userId: number): Promise<void> => {
    await api.post(`/crm/roles/${roleId}/assign_user/`, { user_id: userId });
  },

  // Remove role from user
  removeRole: async (roleUserId: number): Promise<void> => {
    await api.delete(`/crm/role-users/${roleUserId}/`);
  },

  // Get user roles
  getUserRoles: async (userId: number): Promise<RoleUser[]> => {
    const response = await api.get<{ results?: RoleUser[] } | RoleUser[]>(`/crm/role-users/?user=${userId}`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.results || [];
  },
};

