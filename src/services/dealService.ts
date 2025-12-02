import api from "./axios";
import type {
  Deal,
  DealListResponse,
  DealFormData,
  DealFilters,
  DealStats,
  PipelineData,
} from "@/lib/types/deal";

export const dealService = {
  // Get all deals with optional filters
  getAll: async (params?: DealFilters): Promise<DealListResponse> => {
    const response = await api.get<DealListResponse>("/crm/deals/", {
      params,
    });
    return response.data;
  },

  // Get a single deal by ID
  getById: async (id: number): Promise<Deal> => {
    const response = await api.get<Deal>(`/crm/deals/${id}/`);
    return response.data;
  },

  // Create a new deal
  create: async (data: DealFormData): Promise<Deal> => {
    const formData = new FormData();
    
    // Append all fields to FormData
    formData.append("title", data.title);
    formData.append("amount", data.amount);
    formData.append("currency", data.currency);
    formData.append("probability", data.probability.toString());
    formData.append("stage", data.stage);
    formData.append("status", data.status);
    formData.append("expected_close_date", data.expected_close_date);
    formData.append("organization", data.organization.toString());
    
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.actual_close_date) {
      formData.append("actual_close_date", data.actual_close_date);
    }
    if (data.source) {
      formData.append("source", data.source);
    }
    if (data.deal_owner) {
      formData.append("deal_owner", data.deal_owner.toString());
    }
    if (data.contact) {
      formData.append("contact", data.contact.toString());
    }
    if (data.lead) {
      formData.append("lead", data.lead.toString());
    }
    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }
    
    const response = await api.post<Deal>("/crm/deals/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update an existing deal
  update: async (id: number, data: Partial<DealFormData>): Promise<Deal> => {
    const formData = new FormData();
    
    // Append only provided fields to FormData
    if (data.title !== undefined) {
      formData.append("title", data.title);
    }
    if (data.description !== undefined) {
      formData.append("description", data.description || "");
    }
    if (data.amount !== undefined) {
      formData.append("amount", data.amount);
    }
    if (data.currency !== undefined) {
      formData.append("currency", data.currency);
    }
    if (data.probability !== undefined) {
      formData.append("probability", data.probability.toString());
    }
    if (data.stage !== undefined) {
      formData.append("stage", data.stage);
    }
    if (data.status !== undefined) {
      formData.append("status", data.status);
    }
    if (data.expected_close_date !== undefined) {
      formData.append("expected_close_date", data.expected_close_date);
    }
    if (data.actual_close_date !== undefined) {
      formData.append("actual_close_date", data.actual_close_date || "");
    }
    if (data.source !== undefined) {
      formData.append("source", data.source || "");
    }
    if (data.deal_owner !== undefined) {
      formData.append("deal_owner", data.deal_owner?.toString() || "");
    }
    if (data.organization !== undefined) {
      formData.append("organization", data.organization.toString());
    }
    if (data.contact !== undefined) {
      formData.append("contact", data.contact?.toString() || "");
    }
    if (data.lead !== undefined) {
      formData.append("lead", data.lead?.toString() || "");
    }
    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }
    
    const response = await api.patch<Deal>(`/crm/deals/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete a deal
  delete: async (id: number): Promise<void> => {
    await api.delete(`/crm/deals/${id}/`);
  },

  // Get deal statistics
  getStats: async (params?: DealFilters): Promise<DealStats> => {
    const response = await api.get<DealStats>("/crm/deals/stats/", {
      params,
    });
    return response.data;
  },

  // Get pipeline data (deals grouped by stage)
  getPipeline: async (params?: DealFilters): Promise<PipelineData> => {
    const response = await api.get<PipelineData>("/crm/deals/pipeline/", {
      params,
    });
    return response.data;
  },
};

