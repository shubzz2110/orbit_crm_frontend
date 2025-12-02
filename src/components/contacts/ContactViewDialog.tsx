import {
  Mail,
  Phone,
  Building2,
  MapPin,
  User as UserIcon,
  Briefcase,
  Tag,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import type { Contact } from "@/lib/types/contact";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getStatusBadge, getLifecycleBadge } from "./ContactBadges";
// Simple date formatter (fallback if date-fns is not available)
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

interface ContactViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
}

export function ContactViewDialog({
  isOpen,
  onOpenChange,
  contact,
  onEdit,
  onDelete,
}: ContactViewDialogProps) {
  if (!contact) return null;

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
                <DialogTitle className="text-2xl">
                  {contact.full_name || `${contact.first_name} ${contact.last_name}`}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Contact Details
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {contact.is_active ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-sm font-medium">
                  <XCircle className="h-4 w-4" />
                  Inactive
                </span>
              )}
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
                    onEdit(contact);
                  }}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Contact
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    onDelete(contact);
                  }}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Contact
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
                    First Name
                  </label>
                  <p className="mt-1 text-sm">{contact.first_name || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </label>
                  <p className="mt-1 text-sm">{contact.last_name || "—"}</p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p className="mt-1 text-sm">{contact.email || "—"}</p>
              </div>
              {contact.phone && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <p className="mt-1 text-sm">{contact.phone}</p>
                  </div>
                </>
              )}
              {contact.job_title && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Job Title
                    </label>
                    <p className="mt-1 text-sm">{contact.job_title}</p>
                  </div>
                </>
              )}
              {contact.company_name && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Company
                    </label>
                    <p className="mt-1 text-sm">{contact.company_name}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Address Information */}
          {(contact.address_line_1 ||
            contact.city ||
            contact.state ||
            contact.country ||
            contact.postal_code) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contact.address_line_1 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Address Line 1
                    </label>
                    <p className="mt-1 text-sm">{contact.address_line_1}</p>
                  </div>
                )}
                {contact.address_line_2 && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Address Line 2
                      </label>
                      <p className="mt-1 text-sm">{contact.address_line_2}</p>
                    </div>
                  </>
                )}
                {(contact.city || contact.state || contact.postal_code) && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-3 gap-4">
                      {contact.city && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            City
                          </label>
                          <p className="mt-1 text-sm">{contact.city}</p>
                        </div>
                      )}
                      {contact.state && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            State/Province
                          </label>
                          <p className="mt-1 text-sm">{contact.state}</p>
                        </div>
                      )}
                      {contact.postal_code && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Postal Code
                          </label>
                          <p className="mt-1 text-sm">{contact.postal_code}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {contact.country && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Country
                      </label>
                      <p className="mt-1 text-sm">{contact.country}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* CRM Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                CRM Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {contact.source && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Source
                    </label>
                    <p className="mt-1 text-sm">{contact.source}</p>
                  </div>
                )}
                {contact.lead_status && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Lead Status
                    </label>
                    <div className="mt-1">{getStatusBadge(contact.lead_status)}</div>
                  </div>
                )}
                {contact.lifecycle_stage && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Lifecycle Stage
                    </label>
                    <div className="mt-1">
                      {getLifecycleBadge(contact.lifecycle_stage)}
                    </div>
                  </div>
                )}
              </div>
              {contact.tags && contact.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {contact.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {contact.description && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Description / Notes
                    </label>
                    <p className="mt-1 text-sm whitespace-pre-wrap">
                      {contact.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Ownership & Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Ownership & Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {contact.owner_full_name && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Assigned Owner
                    </label>
                    <p className="mt-1 text-sm">{contact.owner_full_name}</p>
                    {contact.owner_email && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {contact.owner_email}
                      </p>
                    )}
                  </div>
                )}
                {contact.organization_name && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Organization
                    </label>
                    <p className="mt-1 text-sm">{contact.organization_name}</p>
                  </div>
                )}
              </div>
              {(contact.last_contacted_at ||
                contact.last_activity_type ||
                contact.last_activity_at) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-3 gap-4">
                    {contact.last_contacted_at && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Last Contacted
                        </label>
                        <p className="mt-1 text-sm">
                          {formatDate(contact.last_contacted_at)}
                        </p>
                      </div>
                    )}
                    {contact.last_activity_type && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Last Activity Type
                        </label>
                        <p className="mt-1 text-sm capitalize">
                          {contact.last_activity_type}
                        </p>
                      </div>
                    )}
                    {contact.last_activity_at && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Last Activity
                        </label>
                        <p className="mt-1 text-sm">
                          {formatDate(contact.last_activity_at)}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Audit Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Audit Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {contact.created_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created At
                    </label>
                    <p className="mt-1 text-sm">{formatDate(contact.created_at)}</p>
                    {contact.created_by_full_name && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        by {contact.created_by_full_name}
                      </p>
                    )}
                  </div>
                )}
                {contact.updated_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm">{formatDate(contact.updated_at)}</p>
                    {contact.updated_by_full_name && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        by {contact.updated_by_full_name}
                      </p>
                    )}
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

