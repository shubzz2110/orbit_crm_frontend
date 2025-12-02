import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { UserPlus, Search, Loader2, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { contactService } from "@/services/contactService";
import { organizationService } from "@/services/organizationService";
import { userService } from "@/services/userService";
import type {
  Contact,
  ContactFormData,
  ContactFilters,
  ContactListResponse,
} from "@/lib/types/contact";
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
  ContactCard,
  ContactListView,
  ContactFilters as ContactFiltersComponent,
  ContactForm,
  ContactViewDialog,
  ContactDeleteDialog,
  ContactEmptyState,
  ContactPagination,
} from "@/components/contacts";

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
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
  const [filters, setFilters] = useState<ContactFilters>({
    search: "",
    ordering: "-created_at",
    page: 1,
    page_size: 15,
  });

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params: ContactFilters = {
        ...filters,
        page: pagination.currentPage,
        page_size: pagination.pageSize,
      };
      const response: ContactListResponse = await contactService.getAll(params);
      setContacts(response.results || []);
      setPagination((prev) => ({
        ...prev,
        count: response.count || 0,
        next: response.next,
        previous: response.previous,
      }));
    } catch (error: unknown) {
      console.error("Error fetching contacts:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load contacts"
          : "Failed to load contacts";
      toast.error("Failed to load contacts", {
        description: errorMessage,
      });
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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
    setSelectedContact(null);
    setIsDialogOpen(true);
  };

  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedContact) return;
    try {
      setSubmitting(true);
      await contactService.delete(selectedContact.id);
      toast.success("Contact deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
      fetchContacts();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete contact"
          : "Failed to delete contact";
      toast.error("Failed to delete contact", {
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (values: ContactFormData) => {
    setSubmitting(true);
    try {
      if (selectedContact) {
        await contactService.update(selectedContact.id, values);
        toast.success("Contact updated successfully");
      } else {
        await contactService.create(values);
        toast.success("Contact created successfully");
      }
      setIsDialogOpen(false);
      setSelectedContact(null);
      fetchContacts();
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
            "Failed to save contact"
          : "Failed to save contact";
      toast.error("Error", { description: errorMessage });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterChange = (key: keyof ContactFilters, value: string | number | boolean | undefined) => {
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
    { value: "first_name", label: "First Name (A-Z)" },
    { value: "-first_name", label: "First Name (Z-A)" },
    { value: "last_name", label: "Last Name (A-Z)" },
    { value: "-last_name", label: "Last Name (Z-A)" },
    { value: "email", label: "Email (A-Z)" },
    { value: "-email", label: "Email (Z-A)" },
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
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your contacts and leads
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Contact
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
                placeholder="Search contacts by name, email, phone, company..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
            <ContactFiltersComponent
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
      {!loading && contacts.length > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {contacts.length} of {pagination.count} contacts
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

      {/* Contacts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : contacts.length === 0 ? (
        <ContactEmptyState
          searchQuery={filters.search}
          onCreate={handleCreate}
          onClearSearch={() => handleFilterChange("search", "")}
        />
      ) : (
        <>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <ContactListView
                contacts={contacts}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {/* Pagination */}
          <ContactPagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* View Contact Dialog */}
      <ContactViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        contact={selectedContact}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Contact Dialog */}
      <ContactForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        contact={selectedContact}
        organizations={organizations}
        users={users}
        submitting={submitting}
      />

      {/* Delete Confirmation Dialog */}
      <ContactDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        contact={selectedContact}
        onConfirm={handleDeleteConfirm}
        submitting={submitting}
      />
    </>
  );
}
