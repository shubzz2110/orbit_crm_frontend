import { Loader2 } from "lucide-react";
import type { Deal } from "@/lib/types/deal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DealDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
  onConfirm: () => Promise<void>;
  submitting: boolean;
}

export function DealDeleteDialog({
  isOpen,
  onOpenChange,
  deal,
  onConfirm,
  submitting,
}: DealDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Deal</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the deal{" "}
            <span className="font-semibold">{deal?.title}</span>? This action
            cannot be undone.
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

