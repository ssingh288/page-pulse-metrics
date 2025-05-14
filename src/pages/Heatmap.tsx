import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { HeatmapView } from "@/components/heatmap/HeatmapView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone } from "lucide-react";

// Mock data
const mockDesktopData = Array.from({ length: 50 }, () => ({
  x: Math.random() * 800,
  y: Math.random() * 600,
  value: Math.random() * 10,
}));

const mockMobileData = Array.from({ length: 30 }, () => ({
  x: Math.random() * 375,
  y: Math.random() * 600,
  value: Math.random() * 10,
}));

const mockPages = [
  { id: "1", name: "Homepage Redesign" },
  { id: "2", name: "Product Landing Page" },
  { id: "3", name: "Black Friday Special" },
  { id: "4", name: "Webinar Registration" },
  { id: "5", name: "Free Trial Signup" },
];

const Heatmap = () => {
  const [loading, setLoading] = useState(true);
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile">("desktop");
  const [selectedPage, setSelectedPage] = useState(mockPages[0].id);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const placeholderImage = "/placeholder.svg";

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">Heatmap Analysis</h2>
          <p className="text-muted-foreground mt-2 text-lg">Visualize how users interact with your landing pages</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full md:w-72">
              <SelectValue placeholder="Select a landing page" />
            </SelectTrigger>
            <SelectContent>
              {mockPages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button
              variant={deviceType === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceType("desktop")}
            >
              <Monitor className="h-4 w-4 mr-2" /> Desktop
            </Button>
            <Button
              variant={deviceType === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceType("mobile")}
            >
              <Smartphone className="h-4 w-4 mr-2" /> Mobile
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <HeatmapView 
              data={deviceType === "desktop" ? mockDesktopData : mockMobileData}
              imageSrc={placeholderImage}
              deviceType={deviceType}
              loading={loading}
            />
          </div>
          
          <div className="space-y-6">
            <Card className="glassmorphic-card shadow-2xl border-0 bg-white/80 backdrop-blur-lg rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-t-2xl">
                <CardTitle>Click Statistics</CardTitle>
                <CardDescription>Key metrics for this page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total Clicks</div>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                    ) : (
                      deviceType === "desktop" ? "1,254" : "876"
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Most Clicked Area</div>
                  <div className="font-medium">
                    {loading ? (
                      <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                    ) : (
                      "Header CTA Button"
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Least Engaged Section</div>
                  <div className="font-medium">
                    {loading ? (
                      <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                    ) : (
                      "Footer Links"
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glassmorphic-card shadow-2xl border-0 bg-white/80 backdrop-blur-lg rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-t-2xl">
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <>
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  </>
                ) : (
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Consider moving CTA button above the fold</li>
                    <li>Simplify the navigation menu (low engagement)</li>
                    <li>Make testimonials more prominent</li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Heatmap;
