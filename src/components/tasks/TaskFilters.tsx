import { Filter } from "lucide-react";
import type { TaskFilters as TaskFiltersType } from "@/lib/types/task";
import type { User } from "@/lib/types/user";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const TASK_TYPE_OPTIONS = [
  { value: "Call", label: "Call" },
  { value: "Email", label: "Email" },
  { value: "Meeting", label: "Meeting" },
  { value: "Follow-up", label: "Follow-up" },
  { value: "Demo", label: "Demo" },
  { value: "Other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Urgent", label: "Urgent" },
];

const STATUS_OPTIONS = [
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

interface TaskFiltersProps {
  filters: TaskFiltersType;
  users: User[];
  onFilterChange: (key: keyof TaskFiltersType, value: string | number | boolean | undefined) => void;
  onClearFilters: () => void;
  filtersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
}

export function TaskFilters({
  filters,
  users,
  onFilterChange,
  onClearFilters,
  filtersOpen,
  onFiltersOpenChange,
}: TaskFiltersProps) {
  const activeFiltersCount = [
    filters.status,
    filters.priority,
    filters.task_type,
    filters.assigned_to,
    filters.overdue,
    filters.upcoming,
  ].filter(Boolean).length;

  return (
    <Popover open={filtersOpen} onOpenChange={onFiltersOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-8 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Status</Label>
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  onFilterChange("status", e.target.value || undefined)
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
              >
                <option value="">All</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <select
                value={filters.priority || ""}
                onChange={(e) =>
                  onFilterChange("priority", e.target.value || undefined)
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
              >
                <option value="">All</option>
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Task Type</Label>
              <select
                value={filters.task_type || ""}
                onChange={(e) =>
                  onFilterChange("task_type", e.target.value || undefined)
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
              >
                <option value="">All</option>
                {TASK_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Assigned To</Label>
              <select
                value={filters.assigned_to || ""}
                onChange={(e) =>
                  onFilterChange(
                    "assigned_to",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
              >
                <option value="">All</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="overdue"
                checked={filters.overdue === true}
                onCheckedChange={(checked) =>
                  onFilterChange("overdue", checked ? true : undefined)
                }
              />
              <Label htmlFor="overdue" className="text-xs cursor-pointer">
                Overdue only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="upcoming"
                checked={filters.upcoming === true}
                onCheckedChange={(checked) =>
                  onFilterChange("upcoming", checked ? true : undefined)
                }
              />
              <Label htmlFor="upcoming" className="text-xs cursor-pointer">
                Upcoming (next 7 days)
              </Label>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

