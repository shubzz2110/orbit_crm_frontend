import type { TaskPriority, TaskStatus, TaskType } from "@/lib/types/task";

export function getPriorityBadge(priority: TaskPriority) {
  const variants: Record<TaskPriority, { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
    Low: { variant: "outline", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
    Medium: { variant: "secondary", className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800" },
    High: { variant: "default", className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800" },
    Urgent: { variant: "destructive", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
  };

  const config = variants[priority];
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${config.className}`}>
      {priority}
    </span>
  );
}

export function getStatusBadge(status: TaskStatus) {
  const variants: Record<TaskStatus, { className: string }> = {
    "To Do": { className: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800" },
    "In Progress": { className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
    "Completed": { className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" },
    "Cancelled": { className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
  };

  const config = variants[status];
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${config.className}`}>
      {status}
    </span>
  );
}

export function getTaskTypeBadge(taskType: TaskType) {
  return (
    <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
      {taskType}
    </span>
  );
}

