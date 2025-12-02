import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Search, Loader2, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { taskService } from "@/services/taskService";
import { organizationService } from "@/services/organizationService";
import { userService } from "@/services/userService";
import { leadService } from "@/services/leadService";
import { contactService } from "@/services/contactService";
import type {
  Task,
  TaskFormData,
  TaskFilters,
  TaskListResponse,
} from "@/lib/types/task";
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
  TaskCard,
  TaskListView,
  TaskFilters as TaskFiltersComponent,
  TaskForm,
  TaskViewDialog,
  TaskDeleteDialog,
  TaskEmptyState,
  TaskPagination,
} from "@/components/tasks";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    ordering: "-due_date",
    page: 1,
    page_size: 15,
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params: TaskFilters = {
        ...filters,
        page: pagination.currentPage,
        page_size: pagination.pageSize,
      };
      const response: TaskListResponse = await taskService.getAll(params);
      setTasks(response.results || []);
      setPagination((prev) => ({
        ...prev,
        count: response.count || 0,
        next: response.next,
        previous: response.previous,
      }));
    } catch (error: unknown) {
      console.error("Error fetching tasks:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load tasks"
          : "Failed to load tasks";
      toast.error("Failed to load tasks", {
        description: errorMessage,
      });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTask) return;
    try {
      setSubmitting(true);
      await taskService.delete(selectedTask.id);
      toast.success("Task deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete task"
          : "Failed to delete task";
      toast.error("Failed to delete task", {
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (values: TaskFormData) => {
    setSubmitting(true);
    try {
      if (selectedTask) {
        await taskService.update(selectedTask.id, values);
        toast.success("Task updated successfully");
      } else {
        await taskService.create(values);
        toast.success("Task created successfully");
      }
      setIsDialogOpen(false);
      setSelectedTask(null);
      fetchTasks();
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
            "Failed to save task"
          : "Failed to save task";
      toast.error("Error", { description: errorMessage });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterChange = (key: keyof TaskFilters, value: string | number | boolean | undefined) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value, page: 1 };
      return newFilters;
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      ordering: "-due_date",
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
    { value: "-due_date", label: "Due Date (Soonest)" },
    { value: "due_date", label: "Due Date (Latest)" },
    { value: "-created_at", label: "Newest First" },
    { value: "created_at", label: "Oldest First" },
    { value: "priority", label: "Priority (Low to High)" },
    { value: "-priority", label: "Priority (High to Low)" },
    { value: "title", label: "Title (A-Z)" },
    { value: "-title", label: "Title (Z-A)" },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === filters.ordering)?.label ||
    "Due Date (Soonest)";

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Manage your tasks and track progress
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
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
                placeholder="Search tasks by title, description..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
            <TaskFiltersComponent
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
      {!loading && tasks.length > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {tasks.length} of {pagination.count} tasks
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

      {/* Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : tasks.length === 0 ? (
        <TaskEmptyState
          searchQuery={filters.search}
          onCreate={handleCreate}
          onClearSearch={() => handleFilterChange("search", "")}
        />
      ) : (
        <>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <TaskListView
                tasks={tasks}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}

          {/* Pagination */}
          <TaskPagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* View Task Dialog */}
      <TaskViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        task={selectedTask}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Task Dialog */}
      <TaskForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        task={selectedTask}
        organizations={organizations}
        users={users}
        leads={leads}
        contacts={contacts}
        submitting={submitting}
      />

      {/* Delete Confirmation Dialog */}
      <TaskDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        task={selectedTask}
        onConfirm={handleDeleteConfirm}
        submitting={submitting}
      />
    </>
  );
}

