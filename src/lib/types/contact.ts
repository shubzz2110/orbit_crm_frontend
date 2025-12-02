export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string | null;
  job_title?: string | null;
  company_name?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  source?: string | null;
  lead_status?: string | null;
  lifecycle_stage?: string | null;
  tags?: string[];
  owner?: number | null;
  owner_email?: string;
  owner_full_name?: string;
  last_contacted_at?: string | null;
  last_activity_type?: string | null;
  last_activity_at?: string | null;
  is_active: boolean;
  description?: string | null;
  custom_fields?: Record<string, any>;
  organization: number;
  organization_name?: string;
  created_by?: number | null;
  created_by_email?: string;
  updated_by?: number | null;
  updated_by_email?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Contact[];
}

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  company_name?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  source?: string;
  lead_status?: string;
  lifecycle_stage?: string;
  tags?: string[];
  owner?: number | null;
  last_contacted_at?: string;
  last_activity_type?: string;
  last_activity_at?: string;
  is_active?: boolean;
  description?: string;
  custom_fields?: Record<string, any>;
  organization: number;
}

export interface ContactFilters {
  search?: string;
  organization?: number;
  owner?: number;
  lead_status?: string;
  lifecycle_stage?: string;
  source?: string;
  is_active?: boolean;
  tags?: string[];
  ordering?: string;
  page?: number;
  page_size?: number;
}

export const LEAD_STATUS_OPTIONS = [
  { value: "New", label: "New" },
  { value: "Working", label: "Working" },
  { value: "Converted", label: "Converted" },
  { value: "Lost", label: "Lost" },
];

export const LIFECYCLE_STAGE_OPTIONS = [
  { value: "Subscriber", label: "Subscriber" },
  { value: "Lead", label: "Lead" },
  { value: "MQL", label: "MQL" },
  { value: "SQL", label: "SQL" },
  { value: "Opportunity", label: "Opportunity" },
  { value: "Customer", label: "Customer" },
];

export const CONTACT_SOURCE_OPTIONS = [
  { value: "Website", label: "Website" },
  { value: "Referral", label: "Referral" },
  { value: "Ad Campaign", label: "Ad Campaign" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Facebook", label: "Facebook" },
  { value: "Twitter", label: "Twitter" },
  { value: "Trade Show", label: "Trade Show" },
  { value: "Partner", label: "Partner" },
  { value: "Other", label: "Other" },
];

export const ACTIVITY_TYPE_OPTIONS = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
];

