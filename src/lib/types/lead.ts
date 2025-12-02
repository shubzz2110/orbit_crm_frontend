export interface Lead {
  id: number;
  lead_name: string;
  display_name?: string;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  source?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  website_url?: string | null;
  tags?: string[];
  last_contacted_at?: string | null;
  next_followup_at?: string | null;
  notes?: string | null;
  assigned_to?: number | null;
  assigned_to_email?: string;
  assigned_to_full_name?: string;
  organization: number;
  organization_name?: string;
  created_by?: number | null;
  created_by_email?: string;
  created_by_full_name?: string;
  updated_by?: number | null;
  updated_by_email?: string;
  updated_by_full_name?: string;
  activities_count?: number;
  recent_activities?: LeadActivity[];
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: number;
  lead: number;
  activity_type: string;
  activity_type_display?: string;
  subject?: string | null;
  description?: string | null;
  activity_date: string;
  duration_minutes?: number | null;
  email_direction?: "inbound" | "outbound" | null;
  call_direction?: "inbound" | "outbound" | null;
  meeting_location?: string | null;
  meeting_url?: string | null;
  created_by?: number | null;
  created_by_email?: string;
  created_by_full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lead[];
}

export interface LeadFormData {
  lead_name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  source?: string;
  utm_source?: string;
  utm_campaign?: string;
  website_url?: string;
  tags?: string[];
  last_contacted_at?: string;
  next_followup_at?: string;
  notes?: string;
  assigned_to?: number | null;
  organization: number;
}

export interface LeadActivityFormData {
  lead: number;
  activity_type: string;
  subject?: string;
  description?: string;
  activity_date: string;
  duration_minutes?: number;
  email_direction?: "inbound" | "outbound";
  call_direction?: "inbound" | "outbound";
  meeting_location?: string;
  meeting_url?: string;
}

export interface LeadFilters {
  search?: string;
  organization?: number;
  assigned_to?: number;
  source?: string;
  tags?: string[];
  upcoming_followups?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export const LEAD_SOURCE_OPTIONS = [
  { value: "Website", label: "Website" },
  { value: "Referral", label: "Referral" },
  { value: "Cold Call", label: "Cold Call" },
  { value: "Social Media", label: "Social Media" },
  { value: "Campaign", label: "Campaign" },
  { value: "Other", label: "Other" },
];

export const ACTIVITY_TYPE_OPTIONS = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
];

export const EMAIL_DIRECTION_OPTIONS = [
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
];

export const CALL_DIRECTION_OPTIONS = [
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
];

