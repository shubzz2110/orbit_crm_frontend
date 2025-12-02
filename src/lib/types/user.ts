export interface User {
  id: number;
  email: string;
  full_name: string;
  profile_picture?: string | null;
  organization_name?: string;
  is_active: boolean;
  created_at: string;
  role?: string | string[] | Array<{ id: number; name: string }> | null;
}

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface UserFormData {
  email: string;
  full_name: string;
  timezone?: string;
  language?: string;
  is_active?: boolean;
  role?: string | number; // Role ID or name
}

