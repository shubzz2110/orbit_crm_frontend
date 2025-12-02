import {
  Mail,
  Phone,
  Building2,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  User as UserIcon,
  Clock,
} from "lucide-react";
import type { Lead } from "@/lib/types/lead";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// Date formatting helper
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

interface LeadListViewProps {
  leads: Lead[];
  onView?: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadListView({
  leads,
  onView,
  onEdit,
  onDelete,
}: LeadListViewProps) {
  return (
    <div className="rounded-md border divide-y">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-3">Lead</div>
        <div className="col-span-2">Contact</div>
        <div className="col-span-2">Company</div>
        <div className="col-span-1">Source</div>
        <div className="col-span-2">Assigned To</div>
        <div className="col-span-1">Follow-up</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Table Rows */}
      {leads.map((lead) => {
        const displayName = lead.display_name || lead.lead_name || `Lead #${lead.id}`;

        return (
          <div
            key={lead.id}
            className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors items-center"
          >
            <div className="col-span-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center shrink-0">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{displayName}</div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-1">
                {lead.email && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{lead.email}</span>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2">
              {lead.company_name ? (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{lead.company_name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
            <div className="col-span-1">
              {lead.source ? (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {lead.source}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
            <div className="col-span-2">
              {lead.assigned_to_full_name ? (
                <span className="text-sm">{lead.assigned_to_full_name}</span>
              ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
              )}
            </div>
            <div className="col-span-1">
              {lead.next_followup_at ? (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(lead.next_followup_at)}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
            <div className="col-span-1 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && (
                    <>
                      <DropdownMenuItem onClick={() => onView(lead)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => onEdit(lead)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(lead)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
}

