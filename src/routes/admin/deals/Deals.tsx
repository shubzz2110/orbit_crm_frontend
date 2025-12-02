import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Search, Loader2, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { dealService } from "@/services/dealService";
import { organizationService } from "@/services/organizationService";
import { userService } from "@/services/userService";
import { leadService } from "@/services/leadService";
import { contactService } from "@/services/contactService";
import type {
  Deal,
  DealFormData,
  DealFilters,
  DealListResponse,
} from "@/lib/types/deal";
import type { Organization } from "@/lib/types/organization";
import type { User } from "@/lib/types/user";
import type { Lead } from "@/lib/types/lead";
import type { Contact } from "@/lib/types/contact";
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
  DealCard,
  DealListView,
  DealFilters as DealFiltersComponent,
  DealForm,
  DealViewDialog,
  DealDeleteDialog,
  DealEmptyState,
  DealPagination,
} from "@/components/deals";

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
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
  const [filters, setFilters] = useState<DealFilters>({
    search: "",
    ordering: "-expected_close_date",
    page: 1,
    page_size: 15,
  });

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const params: DealFilters = {
        ...filters,
        page: pagination.currentPage,
        page_size: pagination.pageSize,
      };
      const response: DealListResponse = await dealService.getAll(params);
      setDeals(response.results || []);
      setPagination((prev) => ({
        ...prev,
        count: response.count || 0,
        next: response.next,
        previous: response.previous,
      }));
    } catch (error: unknown) {
      console.error("Error fetching deals:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load deals"
          : "Failed to load deals";
      toast.error("Failed to load deals", {
        description: errorMessage,
      });
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    fetchOrganizations();
    fetchUsers();
    fetchLeads();
    fetchContacts();
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

  const fetchLeads = async () => {
    try {
      const response = await leadService.getAll({ page_size: 1000 });
      const leadsList = Array.isArray(response) ? response : response.results || [];
      setLeads(leadsList);
    } catch (error) {
      console.error("Failed to load leads:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await contactService.getAll({ page_size: 1000 });
      const contactsList = Array.isArray(response) ? response : response.results || [];
      setContacts(contactsList);
    } catch (error) {
      console.error("Failed to load contacts:", error);
    }
  };

  const handleCreate = () => {
    setSelectedDeal(null);
    setIsDialogOpen(true);
  };

  const handleView = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDialogOpen(true);
  };

  const handleDelete = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeal) return;
    try {
      setSubmitting(true);
      await dealService.delete(selectedDeal.id);
      toast.success("Deal deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedDeal(null);
      fetchDeals();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete deal"
          : "Failed to delete deal";
      toast.error("Failed to delete deal", {
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (values: DealFormData) => {
    setSubmitting(true);
    try {
      if (selectedDeal) {
        await dealService.update(selectedDeal.id, values);
        toast.success("Deal updated successfully");
      } else {
        await dealService.create(values);
        toast.success("Deal created successfully");
      }
      setIsDialogOpen(false);
      setSelectedDeal(null);
      fetchDeals();
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
            "Failed to save deal"
          : "Failed to save deal";
      toast.error("Error", { description: errorMessage });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterChange = (key: keyof DealFilters, value: string | number | boolean | undefined) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value, page: 1 };
      return newFilters;
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      ordering: "-expected_close_date",
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
    { value: "-expected_close_date", label: "Expected Close (Soonest)" },
    { value: "expected_close_date", label: "Expected Close (Latest)" },
    { value: "-amount", label: "Amount (High to Low)" },
    { value: "amount", label: "Amount (Low to High)" },
    { value: "-created_at", label: "Newest First" },
    { value: "created_at", label: "Oldest First" },
    { value: "title", label: "Title (A-Z)" },
    { value: "-title", label: "Title (Z-A)" },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === filters.ordering)?.label ||
    "Expected Close (Soonest)";

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
            <p className="text-muted-foreground mt-1">
              Manage your sales pipeline and opportunities
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Deal
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
                placeholder="Search deals by title, description..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
            <DealFiltersComponent
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
      {!loading && deals.length > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {deals.length} of {pagination.count} deals
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

      {/* Deals Display */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : deals.length === 0 ? (
        <DealEmptyState
          searchQuery={filters.search}
          onCreate={handleCreate}
          onClearSearch={() => handleFilterChange("search", "")}
        />
      ) : (
        <>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {deals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <DealListView
                deals={deals}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {/* Pagination */}
          <DealPagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* View Deal Dialog */}
      <DealViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        deal={selectedDeal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Deal Dialog */}
      <DealForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        deal={selectedDeal}
        organizations={organizations}
        users={users}
        leads={leads}
        contacts={contacts}
        submitting={submitting}
      />

      {/* Delete Confirmation Dialog */}
      <DealDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        deal={selectedDeal}
        onConfirm={handleDeleteConfirm}
        submitting={submitting}
      />
    </div>
  );
}

