import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { UserPlus, Search, Loader2, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { leadService } from "@/services/leadService";
import { organizationService } from "@/services/organizationService";
import { userService } from "@/services/userService";
import type {
  Lead,
  LeadFormData,
  LeadFilters,
  LeadListResponse,
} from "@/lib/types/lead";
import type { Organization } from "@/lib/types/organization";
import type { User } from "@/lib/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LeadCard,
  LeadListView,
  LeadFilters as LeadFiltersComponent,
  LeadForm,
  LeadViewDialog,
  LeadDeleteDialog,
  LeadEmptyState,
  LeadPagination,
} from "@/components/leads";

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  // Pagination state
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1,
    pageSize: 15,
  });

  // Filter state
  const [filters, setFilters] = useState<LeadFilters>({
    search: "",
    ordering: "-created_at",
    page: 1,
    page_size: 15,
  });

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params: LeadFilters = {
        ...filters,
        page: pagination.currentPage,
        page_size: pagination.pageSize,
      };
      const response: LeadListResponse = await leadService.getAll(params);
      setLeads(response.results || []);
      setPagination((prev) => ({
        ...prev,
        count: response.count || 0,
        next: response.next,
        previous: response.previous,
      }));
    } catch (error: unknown) {
      console.error("Error fetching leads:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load leads"
          : "Failed to load leads";
      toast.error("Failed to load leads", {
        description: errorMessage,
      });
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchOrganizations();
    fetchUsers();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await organizationService.getAll();
      const orgs = Array.isArray(response) ? response : response.results || [];
      setOrganizations(orgs);
    } catch (error) {
      console.error("Failed to load organizations:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      const usersList = Array.isArray(response) ? response : response.results || [];
      setUsers(usersList);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleCreate = () => {
    setSelectedLead(null);
    setIsDialogOpen(true);
  };

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLead) return;
    try {
      setSubmitting(true);
      await leadService.delete(selectedLead.id);
      toast.success("Lead deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete lead"
          : "Failed to delete lead";
      toast.error("Failed to delete lead", {
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (values: LeadFormData) => {
    setSubmitting(true);
    try {
      if (selectedLead) {
        await leadService.update(selectedLead.id, values);
        toast.success("Lead updated successfully");
      } else {
        await leadService.create(values);
        toast.success("Lead created successfully");
      }
      setIsDialogOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as {
              response?: {
                data?: {
                  message?: string;
                  error?: string;
                  detail?: string;
                };
              };
            }).response?.data?.message ||
            (error as {
              response?: {
                data?: {
                  message?: string;
                  error?: string;
                  detail?: string;
                };
              };
            }).response?.data?.error ||
            (error as {
              response?: {
                data?: {
                  message?: string;
                  error?: string;
                  detail?: string;
                };
              };
            }).response?.data?.detail ||
            "Failed to save lead"
          : "Failed to save lead";
      toast.error("Error", { description: errorMessage });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterChange = (key: keyof LeadFilters, value: string | number | boolean | undefined) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value, page: 1 };
      return newFilters;
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      ordering: "-created_at",
      page: 1,
      page_size: 15,
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const totalPages = Math.ceil(pagination.count / pagination.pageSize);

  // Sort options
  const sortOptions = [
    { value: "-created_at", label: "Newest First" },
    { value: "created_at", label: "Oldest First" },
    { value: "lead_name", label: "Name (A-Z)" },
    { value: "-lead_name", label: "Name (Z-A)" },
    { value: "-next_followup_at", label: "Follow-up Date" },
    { value: "-updated_at", label: "Recently Updated" },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === filters.ordering)?.label ||
    "Newest First";

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground mt-1">
              Manage your leads and track their progress
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Lead
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, email, phone, company..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
            <LeadFiltersComponent
              filters={filters}
              users={users}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              filtersOpen={filtersOpen}
              onFiltersOpenChange={setFiltersOpen}
            />
          </div>
        </CardContent>
      </Card>

      {/* View Controls */}
      {!loading && leads.length > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {leads.length} of {pagination.count} leads
          </p>
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort: {currentSortLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleFilterChange("ordering", option.value)}
                    className={filters.ordering === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Toggle */}
            <div className="flex items-center gap-1 border rounded-md p-1 bg-background">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("card")}
                className="h-8 px-3 transition-all"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 px-3 transition-all"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leads List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : leads.length === 0 ? (
        <LeadEmptyState
          searchQuery={filters.search}
          onCreate={handleCreate}
          onClearSearch={() => handleFilterChange("search", "")}
        />
      ) : (
        <>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <LeadListView
                leads={leads}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {/* Pagination */}
          <LeadPagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* View Lead Dialog */}
      <LeadViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        lead={selectedLead}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Lead Dialog */}
      <LeadForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        lead={selectedLead}
        organizations={organizations}
        users={users}
        submitting={submitting}
      />

      {/* Delete Confirmation Dialog */}
      <LeadDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        lead={selectedLead}
        onConfirm={handleDeleteConfirm}
        submitting={submitting}
      />
    </>
  );
}

