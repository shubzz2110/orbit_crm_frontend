import {
  Mail,
  Phone,
  Building2,
  MapPin,
  User as UserIcon,
  Tag,
  Calendar,
  Edit,
  Trash2,
  Globe,
  Clock,
} from "lucide-react";
import type { Lead } from "@/lib/types/lead";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadActivities } from "./LeadActivities";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
};

interface LeadViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
}

export function LeadViewDialog({
  isOpen,
  onOpenChange,
  lead,
  onEdit,
  onDelete,
}: LeadViewDialogProps) {
  if (!lead) return null;

  const displayName = lead.display_name || lead.lead_name || `Lead #${lead.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">{displayName}</DialogTitle>
                <DialogDescription className="mt-1">Lead Details</DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Action Buttons */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    onEdit(lead);
                  }}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Lead
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    onDelete(lead);
                  }}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Lead
                </Button>
              )}
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Lead Name
                  </label>
                  <p className="mt-1 text-sm">{lead.lead_name}</p>
                </div>
                {lead.company_name && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Company Name
                    </label>
                    <p className="mt-1 text-sm">{lead.company_name}</p>
                  </div>
                )}
                {lead.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <p className="mt-1 text-sm">{lead.email}</p>
                  </div>
                )}
                {lead.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <p className="mt-1 text-sm">{lead.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          {(lead.address_line1 || lead.city || lead.state || lead.country) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {lead.address_line1 && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Address Line 1
                      </label>
                      <p className="mt-1 text-sm">{lead.address_line1}</p>
                    </div>
                  )}
                  {lead.address_line2 && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Address Line 2
                      </label>
                      <p className="mt-1 text-sm">{lead.address_line2}</p>
                    </div>
                  )}
                  {lead.city && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        City
                      </label>
                      <p className="mt-1 text-sm">{lead.city}</p>
                    </div>
                  )}
                  {lead.state && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        State/Province
                      </label>
                      <p className="mt-1 text-sm">{lead.state}</p>
                    </div>
                  )}
                  {lead.postal_code && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Postal Code
                      </label>
                      <p className="mt-1 text-sm">{lead.postal_code}</p>
                    </div>
                  )}
                  {lead.country && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Country
                      </label>
                      <p className="mt-1 text-sm">{lead.country}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Source & Marketing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Source & Marketing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {lead.source && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Source
                    </label>
                    <p className="mt-1 text-sm">{lead.source}</p>
                  </div>
                )}
                {lead.utm_source && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      UTM Source
                    </label>
                    <p className="mt-1 text-sm">{lead.utm_source}</p>
                  </div>
                )}
                {lead.utm_campaign && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      UTM Campaign
                    </label>
                    <p className="mt-1 text-sm">{lead.utm_campaign}</p>
                  </div>
                )}
                {lead.website_url && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website URL
                    </label>
                    <a
                      href={lead.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-primary hover:underline block"
                    >
                      {lead.website_url}
                    </a>
                  </div>
                )}
              </div>
              {lead.tags && lead.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tags
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {lead.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity & Follow-up */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activity & Follow-up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {lead.last_contacted_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last Contacted
                    </label>
                    <p className="mt-1 text-sm">{formatDate(lead.last_contacted_at)}</p>
                  </div>
                )}
                {lead.next_followup_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Next Follow-up
                    </label>
                    <p className="mt-1 text-sm text-primary font-medium">
                      {formatDate(lead.next_followup_at)}
                    </p>
                  </div>
                )}
              </div>
              {lead.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Notes
                  </label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ownership & Organization */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Ownership & Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Organization
                  </label>
                  <p className="mt-1 text-sm">{lead.organization_name || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Assigned To
                  </label>
                  <p className="mt-1 text-sm">
                    {lead.assigned_to_full_name || "Unassigned"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <LeadActivities lead={lead} />

          {/* Audit Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Audit Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created By
                  </label>
                  <p className="mt-1 text-sm">
                    {lead.created_by_full_name || lead.created_by_email || "—"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(lead.created_at)}
                  </p>
                </div>
                {lead.updated_by && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated By
                    </label>
                    <p className="mt-1 text-sm">
                      {lead.updated_by_full_name || lead.updated_by_email || "—"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(lead.updated_at)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

