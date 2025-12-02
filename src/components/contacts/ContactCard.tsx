import {
  Mail,
  Phone,
  Building2,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Tag,
  Calendar,
  User as UserIcon,
  Briefcase,
} from "lucide-react";
import type { Contact } from "@/lib/types/contact";
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
import { getStatusBadge, getLifecycleBadge } from "./ContactBadges";

interface ContactCardProps {
  contact: Contact;
  onView?: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactCard({ contact, onView, onEdit, onDelete }: ContactCardProps) {
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
                {contact.full_name || `${contact.first_name} ${contact.last_name}`}
              </CardTitle>
              <CardDescription className="truncate flex items-center gap-1.5 text-sm">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{contact.email}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {contact.is_active ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground" />
            )}
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
                    <DropdownMenuItem onClick={() => onView(contact)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => onEdit(contact)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(contact)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{contact.phone}</span>
          </div>
        )}
        {contact.company_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{contact.company_name}</span>
          </div>
        )}
        {contact.job_title && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4 shrink-0" />
            <span>{contact.job_title}</span>
          </div>
        )}
        {(contact.city || contact.state || contact.country) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {[contact.city, contact.state, contact.country]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          {contact.lead_status && getStatusBadge(contact.lead_status)}
          {contact.lifecycle_stage && getLifecycleBadge(contact.lifecycle_stage)}
          {contact.source && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {contact.source}
            </span>
          )}
        </div>
        {contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {contact.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
            {contact.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{contact.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        {contact.owner_full_name && (
          <div className="pt-2 border-t flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Owner</span>
            <span className="text-xs font-medium truncate ml-2">
              {contact.owner_full_name}
            </span>
          </div>
        )}
        {contact.last_contacted_at && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Last contacted:{" "}
            {new Date(contact.last_contacted_at).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

