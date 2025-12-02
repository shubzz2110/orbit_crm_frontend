export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Permission[];
  user_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RoleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Role[];
}

export interface RoleFormData {
  name: string;
  description?: string;
  permissions?: number[]; // Permission IDs
}

export interface Permission {
  id: number;
  name: string;
  codename: string;
  description?: string;
  content_type?: string;
  created_at?: string;
}

export interface PermissionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Permission[];
}

export interface PermissionFormData {
  name: string;
  codename: string;
  description?: string;
  content_type?: string;
}

