import {
  Mail,
  Phone,
  Building2,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Tag,
  Calendar,
  User as UserIcon,
  Clock,
  Globe,
} from "lucide-react";
import type { Lead } from "@/lib/types/lead";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  return new Date(dateString).toLocaleDateString();
};

interface LeadCardProps {
  lead: Lead;
  onView?: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadCard({ lead, onView, onEdit, onDelete }: LeadCardProps) {
  const displayName = lead.display_name || lead.lead_name || `Lead #${lead.id}`;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/50 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate mb-1">
                {displayName}
              </CardTitle>
              {lead.email && (
                <CardDescription className="truncate flex items-center gap-1.5 text-sm">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </CardDescription>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
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
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{lead.phone}</span>
          </div>
        )}
        {lead.company_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{lead.company_name}</span>
          </div>
        )}
        {(lead.city || lead.state || lead.country) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {[lead.city, lead.state, lead.country]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}
        {lead.website_url && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4 shrink-0" />
            <a
              href={lead.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:underline"
            >
              {lead.website_url}
            </a>
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          {lead.source && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {lead.source}
            </span>
          )}
        </div>
        {lead.tags && lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {lead.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
            {lead.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{lead.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        {lead.assigned_to_full_name && (
          <div className="pt-2 border-t flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Assigned To</span>
            <span className="text-xs font-medium truncate ml-2">
              {lead.assigned_to_full_name}
            </span>
          </div>
        )}
        {lead.last_contacted_at && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Last contacted: {formatDate(lead.last_contacted_at)}
          </div>
        )}
        {lead.next_followup_at && (
          <div className="flex items-center gap-2 text-xs text-primary font-medium">
            <Clock className="h-3.5 w-3.5" />
            Follow-up: {formatDate(lead.next_followup_at)}
          </div>
        )}
        {lead.activities_count !== undefined && lead.activities_count > 0 && (
          <div className="text-xs text-muted-foreground">
            {lead.activities_count} {lead.activities_count === 1 ? "activity" : "activities"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

