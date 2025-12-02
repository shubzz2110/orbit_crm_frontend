import { useState } from "react";
import { DollarSign, Percent } from "lucide-react";
import type { Deal, PipelineData, DealStage } from "@/lib/types/deal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStageBadge } from "./DealBadges";
import { DEAL_STAGE_OPTIONS } from "@/lib/types/deal";

// Currency formatting
const formatCurrency = (amount: number | string, currency: string = "INR"): string => {
  try {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    const currencySymbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${numAmount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  } catch {
    return String(amount);
  }
};

interface DealKanbanProps {
  pipelineData: PipelineData;
  onDealClick?: (deal: Deal) => void;
  onStageChange?: (dealId: number, newStage: string) => void;
}

export function DealKanban({ pipelineData, onDealClick, onStageChange }: DealKanbanProps) {
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: string) => {
    if (draggedDeal && onStageChange && draggedDeal.stage !== stage) {
      onStageChange(draggedDeal.id, stage);
    }
    setDraggedDeal(null);
  };

  // Sort stages by order
  const sortedStages = [...DEAL_STAGE_OPTIONS].sort((a, b) => a.order - b.order);

  return (
    <div className="flex gap-4 pb-4 overflow-auto">
      {sortedStages.map((stageOption) => {
        const stageData = pipelineData[stageOption.value] || {
          stage: stageOption.value,
          stage_display: stageOption.label,
          deals: [],
          count: 0,
          total_amount: 0,
        };

        return (
          <div
            key={stageOption.value}
            className="shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stageOption.value)}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    {getStageBadge(stageOption.value as DealStage)}
                    <span className="text-muted-foreground">({stageData.count})</span>
                  </CardTitle>
                </div>
                {stageData.total_amount > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">{formatCurrency(stageData.total_amount, "INR")}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {stageData.deals.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No deals in this stage
                  </div>
                ) : (
                  stageData.deals.map((deal) => {
                    const dealIsWon = deal.status === "Won";
                    const dealIsLost = deal.status === "Lost";

                    return (
                      <Card
                        key={deal.id}
                        draggable={!!onStageChange}
                        onDragStart={() => handleDragStart(deal)}
                        onClick={() => onDealClick?.(deal)}
                        className={`cursor-pointer hover:shadow-md transition-all ${
                          dealIsWon ? "border-l-green-500" : dealIsLost ? "border-l-red-500" : "border-l-primary/50"
                        } border-l-4`}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="font-medium text-sm line-clamp-2">
                            {deal.title}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">
                              {formatCurrency(deal.amount, deal.currency)}
                            </span>
                            {deal.probability > 0 && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Percent className="h-3 w-3" />
                                <span>{deal.probability}%</span>
                              </div>
                            )}
                          </div>
                          {deal.deal_owner_full_name && (
                            <div className="text-xs text-muted-foreground truncate">
                              {deal.deal_owner_full_name}
                            </div>
                          )}
                          {deal.contact_full_name && (
                            <div className="text-xs text-muted-foreground truncate">
                              {deal.contact_full_name}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

