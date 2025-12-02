import { Plus, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface TaskEmptyStateProps {
  searchQuery?: string;
  onCreate: () => void;
  onClearSearch?: () => void;
}

export function TaskEmptyState({
  searchQuery,
  onCreate,
  onClearSearch,
}: TaskEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/5 dark:bg-primary/10"></div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <CheckSquare className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          {searchQuery ? "No tasks found" : "No tasks yet"}
        </h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {searchQuery
            ? `We couldn't find any tasks matching "${searchQuery}". Try adjusting your search terms.`
            : "Start managing your tasks by creating your first task."}
        </p>
        {!searchQuery ? (
          <Button onClick={onCreate} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Task
          </Button>
        ) : (
          onClearSearch && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClearSearch}
                className="gap-2"
              >
                Clear Search
              </Button>
              <Button onClick={onCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Task
              </Button>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}

