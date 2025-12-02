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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getPriorityBadge, getStatusBadge, getTaskTypeBadge } from "./TaskBadges";

// Date formatting helper
const formatDate = (dateString: string | null | undefined, includeTime: boolean = false): string => {
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

interface TaskListViewProps {
  tasks: Task[];
  onView?: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskListView({
  tasks,
  onView,
  onEdit,
  onDelete,
}: TaskListViewProps) {
  return (
    <div className="rounded-md border divide-y">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-3">Task</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Priority</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-2">Assigned To</div>
        <div className="col-span-1">Related</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Table Rows */}
      {tasks.map((task) => {
        const dueDate = task.due_date;
        const isOverdue = task.is_overdue || false;
        const isTodayDate = isToday(dueDate);

        return (
          <div
            key={task.id}
            className={`grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors items-center ${
              isOverdue ? "bg-red-50/50 dark:bg-red-950/20" : ""
            }`}
          >
            <div className="col-span-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                  isOverdue ? "bg-red-100 dark:bg-red-950" : "bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20"
                }`}>
                  {task.status === "Completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : task.status === "Cancelled" ? (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  ) : task.status === "In Progress" ? (
                    <PlayCircle className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-sm text-muted-foreground truncate">
                      {task.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-1">
              {task.task_type ? (
                getTaskTypeBadge(task.task_type)
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
            <div className="col-span-1">
              {getPriorityBadge(task.priority)}
            </div>
            <div className="col-span-1">
              {getStatusBadge(task.status)}
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className={`text-sm ${isOverdue ? "text-red-600 font-medium" : isTodayDate ? "text-orange-600 font-medium" : ""}`}>
                  {formatDate(dueDate, false)}
                </span>
                {isOverdue && (
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                )}
              </div>
            </div>
            <div className="col-span-2">
              {task.assigned_to_full_name ? (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{task.assigned_to_full_name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
              )}
            </div>
            <div className="col-span-1">
              {task.lead_name || task.contact_full_name ? (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">
                    {task.lead_name || task.contact_full_name}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
            <div className="col-span-1 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
        );
      })}
    </div>
  );
}

