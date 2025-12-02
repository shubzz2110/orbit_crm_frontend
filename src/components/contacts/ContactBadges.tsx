import { cn } from "@/lib/utils";

export function getStatusBadge(status: string | null | undefined) {
  if (!status) return null;
  const colors: Record<string, string> = {
    New: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Working: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Converted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span
      className={cn(
        "text-xs font-medium px-2 py-1 rounded-full",
        colors[status] || "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}

export function getLifecycleBadge(stage: string | null | undefined) {
  if (!stage) return null;
  const colors: Record<string, string> = {
    Subscriber: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    Lead: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    MQL: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    SQL: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    Opportunity: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    Customer: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return (
    <span
      className={cn(
        "text-xs font-medium px-2 py-1 rounded-full",
        colors[stage] || "bg-muted text-muted-foreground"
      )}
    >
      {stage}
    </span>
  );
}

