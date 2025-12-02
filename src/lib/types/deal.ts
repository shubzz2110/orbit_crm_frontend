export type DealStage = 
  | "Qualification"
  | "Contacted"
  | "Needs Analysis"
  | "Proposal Sent"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export type DealStatus = "Open" | "Won" | "Lost" | "On Hold";

export type DealSource = 
  | "Referral"
  | "Website"
  | "Campaign"
  | "Cold Call"
  | "Social Media"
  | "Email"
  | "Trade Show"
  | "Partner"
  | "Other";

export interface Deal {
  id: number;
  title: string;
  description?: string | null;
  amount: string; // Decimal as string from API
  currency: string;
  probability: number;
  weighted_amount?: string;
  stage: DealStage;
  stage_display?: string;
  status: DealStatus;
  status_display?: string;
  expected_close_date: string;
  actual_close_date?: string | null;
  source?: DealSource | null;
  source_display?: string;
  deal_owner?: number | null;
  deal_owner_email?: string;
  deal_owner_full_name?: string;
  contact?: number | null;
  contact_full_name?: string;
  lead?: number | null;
  lead_name?: string;
  organization: number;
  organization_name?: string;
  created_by?: number | null;
  created_by_email?: string;
  created_by_full_name?: string;
  attachment?: string | null;
  attachment_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DealListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Deal[];
}

export interface DealFormData {
  title: string;
  description?: string | null;
  amount: string;
  currency: string;
  probability: number;
  stage: DealStage;
  status: DealStatus;
  expected_close_date: string;
  actual_close_date?: string | null;
  source?: DealSource | null;
  deal_owner?: number | null;
  organization: number;
  contact?: number | null;
  lead?: number | null;
  attachment?: File | null;
}

export interface DealFilters {
  search?: string;
  stage?: DealStage;
  status?: DealStatus;
  source?: DealSource;
  deal_owner?: number;
  contact?: number;
  lead?: number;
  expected_close_date_from?: string;
  expected_close_date_to?: string;
  amount_min?: string;
  amount_max?: string;
  organization?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface DealStats {
  total: number;
  total_amount: number;
  total_weighted_amount: number;
  avg_amount: number;
  avg_probability: number;
  by_stage: Record<DealStage, { count: number; amount: number }>;
  by_status: Record<DealStatus, number>;
  by_source: Record<string, number>;
  won_count: number;
  lost_count: number;
  open_count: number;
  won_amount: number;
  lost_amount: number;
}

export interface PipelineData {
  [stage: string]: {
    stage: string;
    stage_display: string;
    deals: Deal[];
    count: number;
    total_amount: number;
  };
}

export const DEAL_STAGE_OPTIONS: { value: DealStage; label: string; order: number }[] = [
  { value: "Qualification", label: "Qualification", order: 1 },
  { value: "Contacted", label: "Contacted", order: 2 },
  { value: "Needs Analysis", label: "Needs Analysis", order: 3 },
  { value: "Proposal Sent", label: "Proposal Sent", order: 4 },
  { value: "Negotiation", label: "Negotiation", order: 5 },
  { value: "Closed Won", label: "Closed Won", order: 6 },
  { value: "Closed Lost", label: "Closed Lost", order: 7 },
];

export const DEAL_STATUS_OPTIONS = [
  { value: "Open", label: "Open" },
  { value: "Won", label: "Won" },
  { value: "Lost", label: "Lost" },
  { value: "On Hold", label: "On Hold" },
];

export const DEAL_SOURCE_OPTIONS = [
  { value: "Referral", label: "Referral" },
  { value: "Website", label: "Website" },
  { value: "Campaign", label: "Campaign" },
  { value: "Cold Call", label: "Cold Call" },
  { value: "Social Media", label: "Social Media" },
  { value: "Email", label: "Email" },
  { value: "Trade Show", label: "Trade Show" },
  { value: "Partner", label: "Partner" },
  { value: "Other", label: "Other" },
];

export const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
];

