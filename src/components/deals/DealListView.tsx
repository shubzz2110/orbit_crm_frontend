import {
  DollarSign,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  User,
  FileText,
  Percent,
} from "lucide-react";
import type { Deal } from "@/lib/types/deal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getStageBadge, getStatusBadge, getSourceBadge } from "./DealBadges";

// Date formatting helper
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Currency formatting
const formatCurrency = (amount: string, currency: string = "INR"): string => {
  try {
    const numAmount = parseFloat(amount);
    const currencySymbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${numAmount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  } catch {
    return amount;
  }
};

interface DealListViewProps {
  deals: Deal[];
  onView?: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export function DealListView({
  deals,
  onView,
  onEdit,
  onDelete,
}: DealListViewProps) {
  return (
    <div className="rounded-md border divide-y">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-3">Deal</div>
        <div className="col-span-1">Amount</div>
        <div className="col-span-1">Stage</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Probability</div>
        <div className="col-span-2">Expected Close</div>
        <div className="col-span-2">Owner</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Table Rows */}
      {deals.map((deal) => {
        const isWon = deal.status === "Won";
        const isLost = deal.status === "Lost";

        return (
          <div
            key={deal.id}
            className={`grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors items-center ${
              isWon ? "bg-green-50/50 dark:bg-green-950/20" : isLost ? "bg-red-50/50 dark:bg-red-950/20" : ""
            }`}
          >
            <div className="col-span-3">
              <div className="min-w-0">
                <div className="font-medium truncate">
                  {deal.title}
                </div>
                {deal.description && (
                  <div className="text-sm text-muted-foreground truncate">
                    {deal.description}
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium">
                  {formatCurrency(deal.amount, deal.currency)}
                </span>
              </div>
            </div>
            <div className="col-span-1">
              {getStageBadge(deal.stage)}
            </div>
            <div className="col-span-1">
              {getStatusBadge(deal.status)}
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-1 text-sm">
                <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{deal.probability}%</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{formatDate(deal.expected_close_date)}</span>
              </div>
            </div>
            <div className="col-span-2">
              {deal.deal_owner_full_name ? (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{deal.deal_owner_full_name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
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
                      <DropdownMenuItem onClick={() => onView(deal)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => onEdit(deal)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(deal)}
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

