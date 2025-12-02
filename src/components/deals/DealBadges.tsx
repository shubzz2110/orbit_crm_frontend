import type { DealStage, DealStatus, DealSource } from "@/lib/types/deal";

export function getStageBadge(stage: DealStage) {
  const variants: Record<DealStage, { className: string }> = {
    "Qualification": { className: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800" },
    "Contacted": { className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
    "Needs Analysis": { className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800" },
    "Proposal Sent": { className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800" },
    "Negotiation": { className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800" },
    "Closed Won": { className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" },
    "Closed Lost": { className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
  };

  const config = variants[stage];
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${config.className}`}>
      {stage}
    </span>
  );
}

export function getStatusBadge(status: DealStatus) {
  const variants: Record<DealStatus, { className: string }> = {
    "Open": { className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
    "Won": { className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" },
    "Lost": { className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
    "On Hold": { className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800" },
  };

  const config = variants[status];
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${config.className}`}>
      {status}
    </span>
  );
}

export function getSourceBadge(source: DealSource) {
  return (
    <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
      {source}
    </span>
  );
}

