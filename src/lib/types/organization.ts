export interface Organization {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string | null;
  visible: boolean;
  user_count?: number;
  role_count?: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Organization[];
}

export interface OrganizationFormData {
  name: string;
  slug: string;
  description?: string;
  visible: boolean;
}

