import { Filter } from "lucide-react";
import type { LeadFilters as LeadFiltersType } from "@/lib/types/lead";
import type { User } from "@/lib/types/user";
import { LEAD_SOURCE_OPTIONS } from "@/lib/types/lead";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface LeadFiltersProps {
  filters: LeadFiltersType;
  users: User[];
  onFilterChange: (
    key: keyof LeadFiltersType,
    value: string | number | boolean | undefined
  ) => void;
  onClearFilters: () => void;
  filtersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
}

export function LeadFilters({
  filters,
  users,
  onFilterChange,
  onClearFilters,
  filtersOpen,
  onFiltersOpenChange,
}: LeadFiltersProps) {
  const activeFiltersCount = [
    filters.source,
    filters.assigned_to,
    filters.upcoming_followups !== undefined,
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
              <Label className="text-xs">Source</Label>
              <select
                value={filters.source || ""}
                onChange={(e) =>
                  onFilterChange("source", e.target.value || undefined)
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
              >
                <option value="">All</option>
                {LEAD_SOURCE_OPTIONS.map((opt) => (
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
                id="upcoming_followups"
                checked={filters.upcoming_followups === true}
                onCheckedChange={(checked) =>
                  onFilterChange("upcoming_followups", checked ? true : undefined)
                }
              />
              <Label htmlFor="upcoming_followups" className="text-xs cursor-pointer">
                Upcoming follow-ups only
              </Label>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

