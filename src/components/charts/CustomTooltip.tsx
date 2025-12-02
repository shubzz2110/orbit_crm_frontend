import React from "react";

interface TooltipPayload {
  value?: number | string;
  name?: string;
  color?: string;
  [key: string]: any;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
  labelFormatter?: (label: string | number) => React.ReactNode;
  valueFormatter?: (value: number, name: string) => React.ReactNode;
  showLabel?: boolean;
}

export function CustomTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  showLabel = true,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(label as string) : label;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2.5 shadow-xl backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200">
      {showLabel && formattedLabel && (
        <div className="mb-2.5 border-b border-border/50 pb-2">
          <p className="text-sm font-semibold leading-tight text-popover-foreground">
            {formattedLabel}
          </p>
        </div>
      )}
      <div className="space-y-2">
        {payload.map((entry, index) => {
          const value = entry.value as number;
          const formattedValue = valueFormatter
            ? valueFormatter(value, entry.name || "")
            : typeof value === "number"
            ? value.toLocaleString()
            : value;

          return (
            <div
              key={`tooltip-${index}`}
              className="flex items-center justify-between gap-6 min-w-[160px]"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div
                  className="h-3 w-3 rounded-full flex-shrink-0 ring-2 ring-background/50"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {entry.name || "Value"}
                </span>
              </div>
              <span className="text-sm font-bold text-popover-foreground flex-shrink-0 tabular-nums">
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

