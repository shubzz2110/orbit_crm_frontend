import {
  DollarSign,
  Calendar,
  User,
  FileText,
  TrendingUp,
  Percent,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import type { Deal } from "@/lib/types/deal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface DealViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
}

export function DealViewDialog({
  isOpen,
  onOpenChange,
  deal,
  onEdit,
  onDelete,
}: DealViewDialogProps) {
  if (!deal) return null;

  const isWon = deal.status === "Won";
  const isLost = deal.status === "Lost";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${
                isWon ? "bg-green-100 dark:bg-green-950" : isLost ? "bg-red-100 dark:bg-red-950" : "bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20"
              }`}>
                {isWon ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : isLost ? (
                  <XCircle className="h-8 w-8 text-red-600" />
                ) : (
                  <TrendingUp className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl">{deal.title}</DialogTitle>
                <DialogDescription className="mt-1">Deal Details</DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(deal.status)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Action Buttons */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="outline" onClick={() => onEdit(deal)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" onClick={() => onDelete(deal)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}

          {/* Deal Value */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Deal Value
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(deal.amount, deal.currency)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Currency</p>
                  <p className="text-lg">{deal.currency}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Probability</p>
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <p className="text-lg font-semibold">{deal.probability}%</p>
                  </div>
                </div>
              </div>
              {deal.weighted_amount && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Weighted Amount</p>
                  <p className="text-xl font-semibold">{formatCurrency(deal.weighted_amount, deal.currency)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pipeline & Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pipeline & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Stage</p>
                  <div>{getStageBadge(deal.stage)}</div>
                </div>
                {deal.source && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Source</p>
                    <div>{getSourceBadge(deal.source)}</div>
                  </div>
                )}
              </div>
              {deal.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm whitespace-pre-wrap">{deal.description}</p>
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
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Expected Close Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(deal.expected_close_date)}</p>
                </div>
              </div>
              {deal.actual_close_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Actual Close Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(deal.actual_close_date)}</p>
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
              {deal.deal_owner_full_name && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Deal Owner</p>
                    <p className="text-sm text-muted-foreground">{deal.deal_owner_full_name}</p>
                  </div>
                </div>
              )}
              {deal.contact_full_name && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Related Contact</p>
                    <p className="text-sm text-muted-foreground">{deal.contact_full_name}</p>
                  </div>
                </div>
              )}
              {deal.lead_name && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Related Lead</p>
                    <p className="text-sm text-muted-foreground">{deal.lead_name}</p>
                  </div>
                </div>
              )}
              {deal.organization_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Organization</p>
                  <p className="text-sm">{deal.organization_name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {deal.created_by_full_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Created By</p>
                  <p className="text-sm">{deal.created_by_full_name}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Created At</p>
                <p className="text-sm">{formatDate(deal.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm">{formatDate(deal.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

