
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

type ChartType = "area" | "bar";

interface MetricsChartProps {
  title: string;
  data: any[];
  dataKey: string;
  type?: ChartType;
  loading?: boolean;
  className?: string;
  height?: number;
}

export function MetricsChart({
  title,
  data,
  dataKey,
  type = "area",
  loading = false,
  className,
  height = 300,
}: MetricsChartProps) {
  const renderChart = () => {
    if (type === "area") {
      return (
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--card-foreground))"
            }} 
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorData)"
          />
        </AreaChart>
      );
    }

    return (
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="name" 
          stroke="hsl(var(--muted-foreground))" 
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--card-foreground))"
          }} 
        />
        <Bar dataKey={dataKey} fill="hsl(var(--primary))" />
      </BarChart>
    );
  };

  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full bg-muted rounded-md animate-pulse" style={{ height }} />
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            {renderChart()}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
