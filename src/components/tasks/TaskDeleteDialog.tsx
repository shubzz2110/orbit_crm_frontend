import { Loader2 } from "lucide-react";
import type { Task } from "@/lib/types/task";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TaskDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onConfirm: () => Promise<void>;
  submitting: boolean;
}

export function TaskDeleteDialog({
  isOpen,
  onOpenChange,
  task,
  onConfirm,
  submitting,
}: TaskDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the task{" "}
            <span className="font-semibold">{task?.title}</span>? This action
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

