
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: number;
  loading?: boolean;
  className?: string;
}

export function MetricsCard({
  title,
  value,
  icon,
  description,
  trend,
  loading = false,
  className,
}: MetricsCardProps) {
  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-9 w-28 bg-muted rounded animate-pulse-subtle" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div
            className={cn(
              "text-xs mt-2 flex items-center font-medium",
              trend > 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last period
          </div>
        )}
      </CardContent>
    </Card>
  );
}
