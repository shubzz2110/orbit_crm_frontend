import api from "./axios";

export interface DashboardStats {
  contacts: {
    total: number;
    active: number;
    new_this_month: number;
    converted: number;
    growth_percentage: number;
    by_lead_status: Record<string, number>;
    by_lifecycle_stage: Record<string, number>;
    by_source: Record<string, number>;
    monthly_data: Array<{
      month: string;
      contacts: number;
      new: number;
    }>;
  };
  leads: {
    total: number;
    by_status: Record<string, number>;
  };
  tasks: {
    total: number;
    overdue: number;
    upcoming: number;
    by_status: Record<string, number>;
  };
  deals: {
    total: number;
    won: number;
    lost: number;
    open: number;
    total_amount: number;
    won_amount: number;
    by_stage: Record<string, number>;
    by_status: Record<string, number>;
  };
  activity: {
    weekly: Array<{
      day: string;
      calls: number;
      emails: number;
      meetings: number;
    }>;
  };
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>("/crm/dashboard/stats/");
    return response.data;
  },
};

