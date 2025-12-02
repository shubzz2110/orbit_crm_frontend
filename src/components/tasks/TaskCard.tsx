import {
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  User,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PlayCircle,
} from "lucide-react";
import type { Task } from "@/lib/types/task";
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

interface TaskCardProps {
  task: Task;
  onView?: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onView, onEdit, onDelete }: TaskCardProps) {
  const dueDate = task.due_date;
  const isOverdue = task.is_overdue || false;
  const isTodayDate = isToday(dueDate);

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 group ${
      isOverdue ? "border-l-red-500" : isTodayDate ? "border-l-orange-500" : "border-l-primary/50"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${
              isOverdue ? "bg-red-100 dark:bg-red-950" : "bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20"
            }`}>
              {task.status === "Completed" ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : task.status === "Cancelled" ? (
                <XCircle className="h-6 w-6 text-gray-400" />
              ) : task.status === "In Progress" ? (
                <PlayCircle className="h-6 w-6 text-blue-600" />
              ) : (
                <Clock className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate mb-1">
                {task.title}
              </CardTitle>
              {task.description && (
                <CardDescription className="line-clamp-2 text-sm">
                  {task.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isOverdue && (
              <AlertCircle className="h-5 w-5 text-red-600" />
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
                    <DropdownMenuItem onClick={() => onView(task)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(task)}
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
        <div className="flex flex-wrap gap-2">
          {getPriorityBadge(task.priority)}
          {getStatusBadge(task.status)}
          {task.task_type && getTaskTypeBadge(task.task_type)}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span className={isOverdue ? "text-red-600 font-medium" : isTodayDate ? "text-orange-600 font-medium" : ""}>
            Due: {formatDate(dueDate, true)}
          </span>
        </div>

        {task.reminder_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Reminder: {formatDate(task.reminder_at, true)}</span>
          </div>
        )}

        {task.assigned_to_full_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4 shrink-0" />
            <span>{task.assigned_to_full_name}</span>
          </div>
        )}

        {(task.lead_name || task.contact_full_name) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 shrink-0" />
            <span>
              {task.lead_name || task.contact_full_name}
            </span>
          </div>
        )}

        {task.repeat_frequency !== "None" && (
          <div className="pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Repeats: {task.repeat_frequency_display || task.repeat_frequency}
              {task.repeat_until && ` until ${formatDate(task.repeat_until, false)}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

