import { Loader2 } from "lucide-react";
import type { Contact } from "@/lib/types/contact";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ContactDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onConfirm: () => Promise<void>;
  submitting: boolean;
}

export function ContactDeleteDialog({
  isOpen,
  onOpenChange,
  contact,
  onConfirm,
  submitting,
}: ContactDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Contact</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {contact?.full_name ||
                `${contact?.first_name} ${contact?.last_name}`}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

