import {
  Mail,
  Phone,
  Building2,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  User as UserIcon,
} from "lucide-react";
import type { Contact } from "@/lib/types/contact";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getStatusBadge, getLifecycleBadge } from "./ContactBadges";

interface ContactListViewProps {
  contacts: Contact[];
  onView?: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactListView({
  contacts,
  onView,
  onEdit,
  onDelete,
}: ContactListViewProps) {
  return (
    <div className="rounded-md border divide-y">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-3">Contact</div>
        <div className="col-span-2">Email</div>
        <div className="col-span-1">Phone</div>
        <div className="col-span-2">Company</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Lifecycle</div>
        <div className="col-span-1">Owner</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Table Rows */}
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors items-center"
        >
          <div className="col-span-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center shrink-0">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">
                  {contact.full_name || `${contact.first_name} ${contact.last_name}`}
                </div>
                {contact.job_title && (
                  <div className="text-sm text-muted-foreground truncate">
                    {contact.job_title}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm truncate">{contact.email}</span>
            </div>
          </div>
          <div className="col-span-1">
            {contact.phone ? (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm truncate">{contact.phone}</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
          <div className="col-span-2">
            {contact.company_name ? (
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm truncate">{contact.company_name}</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
          <div className="col-span-1">
            {contact.lead_status ? (
              getStatusBadge(contact.lead_status)
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
          <div className="col-span-1">
            {contact.lifecycle_stage ? (
              getLifecycleBadge(contact.lifecycle_stage)
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
          <div className="col-span-1">
            {contact.owner_full_name ? (
              <span className="text-sm truncate">{contact.owner_full_name}</span>
            ) : (
              <span className="text-sm text-muted-foreground">Unassigned</span>
            )}
          </div>
          <div className="col-span-1 text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
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
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}

