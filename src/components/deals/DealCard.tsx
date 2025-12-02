import {
  DollarSign,
  Calendar,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  FileText,
  TrendingUp,
  Percent,
} from "lucide-react";
import type { Deal } from "@/lib/types/deal";
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

interface DealCardProps {
  deal: Deal;
  onView?: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export function DealCard({ deal, onView, onEdit, onDelete }: DealCardProps) {
  const isWon = deal.status === "Won";
  const isLost = deal.status === "Lost";

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 group ${
      isWon ? "border-l-green-500" : isLost ? "border-l-red-500" : "border-l-primary/50"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${
              isWon ? "bg-green-100 dark:bg-green-950" : isLost ? "bg-red-100 dark:bg-red-950" : "bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20"
            }`}>
              <DollarSign className={`h-6 w-6 ${isWon ? "text-green-600" : isLost ? "text-red-600" : "text-primary"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate mb-1">
                {deal.title}
              </CardTitle>
              {deal.description && (
                <CardDescription className="line-clamp-2 text-sm">
                  {deal.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-bold">
              {formatCurrency(deal.amount, deal.currency)}
            </span>
          </div>
          {deal.probability > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Percent className="h-3.5 w-3.5" />
              <span>{deal.probability}%</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {getStageBadge(deal.stage)}
          {getStatusBadge(deal.status)}
          {deal.source && getSourceBadge(deal.source)}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>Expected: {formatDate(deal.expected_close_date)}</span>
        </div>

        {deal.actual_close_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Closed: {formatDate(deal.actual_close_date)}</span>
          </div>
        )}

        {deal.deal_owner_full_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4 shrink-0" />
            <span>{deal.deal_owner_full_name}</span>
          </div>
        )}

        {(deal.contact_full_name || deal.lead_name) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 shrink-0" />
            <span>
              {deal.contact_full_name || deal.lead_name}
            </span>
          </div>
        )}

        {deal.weighted_amount && (
          <div className="pt-2 border-t flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Weighted Value</span>
            <span className="text-xs font-medium">
              {formatCurrency(deal.weighted_amount, deal.currency)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

