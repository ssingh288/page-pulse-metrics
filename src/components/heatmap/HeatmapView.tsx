
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

interface HeatmapViewProps {
  data: HeatmapPoint[];
  width?: number;
  height?: number;
  className?: string;
  imageSrc?: string;
  deviceType?: "desktop" | "mobile";
}

export function HeatmapView({
  data = [],
  width = 800,
  height = 600,
  className,
  imageSrc,
  deviceType = "desktop",
}: HeatmapViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setImage(img);
        setLoading(false);
      };
    } else {
      setLoading(false);
    }
  }, [imageSrc]);

  useEffect(() => {
    if (loading || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw image if available
    if (image) {
      ctx.drawImage(image, 0, 0, width, height);
    }

    // Find max value for normalization
    const maxValue = Math.max(...data.map((point) => point.value), 1);

    // Draw heatmap points
    data.forEach((point) => {
      const radius = 30;
      const intensity = Math.min(1, point.value / maxValue);
      
      // Create radial gradient for heatmap effect
      const gradient = ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        radius
      );
      
      gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity * 0.8})`);
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }, [data, loading, image, width, height]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Click Heatmap ({deviceType})</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className={cn(
            "relative overflow-hidden border rounded-md",
            deviceType === "mobile" ? "max-w-[375px] mx-auto" : "w-full"
          )}
        >
          {loading ? (
            <div className="w-full h-[600px] bg-muted animate-pulse" />
          ) : (
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={cn(
                "w-full h-auto",
                deviceType === "mobile" ? "max-w-[375px]" : ""
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
