import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckSquare,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Edit,
  Trash2,
  Repeat,
} from "lucide-react";
import type { Task } from "@/lib/types/task";
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
import { getPriorityBadge, getStatusBadge, getTaskTypeBadge } from "./TaskBadges";

// Date formatting helper
const formatDate = (dateString: string | null | undefined, includeTime: boolean = true): string => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (includeTime) {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {
    return dateString;
  }
};

const isToday = (dateString: string): boolean => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
};

interface TaskViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskViewDialog({
  isOpen,
  onOpenChange,
  task,
  onEdit,
  onDelete,
}: TaskViewDialogProps) {
  if (!task) return null;

  const dueDate = task.due_date;
  const isOverdue = task.is_overdue || false;
  const isTodayDate = isToday(dueDate);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${
                isOverdue ? "bg-red-100 dark:bg-red-950" : "bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20"
              }`}>
                {task.status === "Completed" ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : task.status === "Cancelled" ? (
                  <XCircle className="h-8 w-8 text-gray-400" />
                ) : task.status === "In Progress" ? (
                  <PlayCircle className="h-8 w-8 text-blue-600" />
                ) : (
                  <CheckSquare className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl">{task.title}</DialogTitle>
                <DialogDescription className="mt-1">Task Details</DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(task.status)}
              {isOverdue && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  Overdue
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
                <Button variant="outline" onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" onClick={() => onDelete(task)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Priority</p>
                  <div>{getPriorityBadge(task.priority)}</div>
                </div>
                {task.task_type && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Task Type</p>
                    <div>{getTaskTypeBadge(task.task_type)}</div>
                  </div>
                )}
              </div>
              {task.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm whitespace-pre-wrap">{task.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className={`text-sm ${isOverdue ? "text-red-600 font-medium" : isTodayDate ? "text-orange-600 font-medium" : ""}`}>
                    {formatDate(task.due_date, true)}
                  </p>
                </div>
              </div>
              {task.reminder_at && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Reminder</p>
                    <p className="text-sm text-muted-foreground">{formatDate(task.reminder_at, true)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment & Relationships */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Assignment & Relationships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {task.assigned_to_full_name && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-muted-foreground">{task.assigned_to_full_name}</p>
                  </div>
                </div>
              )}
              {task.lead_name && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Related Lead</p>
                    <p className="text-sm text-muted-foreground">{task.lead_name}</p>
                  </div>
                </div>
              )}
              {task.contact_full_name && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Related Contact</p>
                    <p className="text-sm text-muted-foreground">{task.contact_full_name}</p>
                  </div>
                </div>
              )}
              {task.organization_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Organization</p>
                  <p className="text-sm">{task.organization_name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recurrence */}
          {task.repeat_frequency !== "None" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  Recurrence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Frequency</p>
                  <p className="text-sm">{task.repeat_frequency_display || task.repeat_frequency}</p>
                </div>
                {task.repeat_until && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Repeat Until</p>
                    <p className="text-sm">{formatDate(task.repeat_until, false)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {task.created_by_full_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Created By</p>
                  <p className="text-sm">{task.created_by_full_name}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Created At</p>
                <p className="text-sm">{formatDate(task.created_at, true)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm">{formatDate(task.updated_at, true)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

