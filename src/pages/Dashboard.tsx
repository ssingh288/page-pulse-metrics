
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Plus, ArrowRight, FileText, ChevronUp, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface LandingPage {
  id: string;
  title: string;
  campaign_type: string;
  published_at: string | null;
  created_at: string;
}

interface PageWithMetrics extends LandingPage {
  visitors: number;
  clicks: number;
  conversion_rate: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<PageWithMetrics[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [averageConversion, setAverageConversion] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user) return;

        setLoading(true);
        
        // Fetch landing pages
        const { data: pagesData, error: pagesError } = await supabase
          .from('landing_pages')
          .select('id, title, campaign_type, published_at, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (pagesError) {
          throw pagesError;
        }

        // For demo purposes, generate mock metrics for each page
        const pagesWithMetrics = pagesData.map(page => {
          const visitors = Math.floor(Math.random() * 1000) + 100;
          const clicks = Math.floor(Math.random() * visitors * 0.3);
          const conversion_rate = clicks / visitors;
          
          return {
            ...page,
            visitors,
            clicks,
            conversion_rate
          };
        });

        setPages(pagesWithMetrics);
        
        if (pagesWithMetrics.length > 0) {
          const totalV = pagesWithMetrics.reduce((sum, page) => sum + page.visitors, 0);
          const totalC = pagesWithMetrics.reduce((sum, page) => sum + page.clicks, 0);
          
          setTotalVisitors(totalV);
          setTotalClicks(totalC);
          setTotalPages(pagesWithMetrics.length);
          setAverageConversion(totalV > 0 ? totalC / totalV : 0);
        }
      } catch (error: any) {
        toast.error(`Error loading dashboard: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Format conversion rate as percentage
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here's an overview of your landing pages and performance
            </p>
          </div>
          <Button asChild>
            <Link to="/create-page">
              <Plus className="mr-2 h-4 w-4" /> Create Landing Page
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Visitors"
            value={loading ? "..." : totalVisitors.toLocaleString()}
            description="Across all landing pages"
            trend={8.2}
            loading={loading}
          />
          <MetricsCard
            title="Total Clicks"
            value={loading ? "..." : totalClicks.toLocaleString()}
            description="On all call-to-action buttons"
            trend={12.5}
            loading={loading}
          />
          <MetricsCard
            title="Average Conversion"
            value={loading ? "..." : formatPercent(averageConversion)}
            description="Clicks divided by visitors"
            trend={-2.4}
            loading={loading}
          />
          <MetricsCard
            title="Active Pages"
            value={loading ? "..." : totalPages.toString()}
            description="Currently published pages"
            trend={0}
            loading={loading}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Landing Pages</CardTitle>
            <CardDescription>
              Your recently created landing pages and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-md" />
                ))}
              </div>
            ) : pages.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Visitors</TableHead>
                      <TableHead className="text-right">Conversion</TableHead>
                      <TableHead className="text-right">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.slice(0, 5).map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">
                          <Link
                            to={`/pages/${page.id}/metrics`}
                            className="hover:text-primary hover:underline flex items-center"
                          >
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            {page.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={page.published_at ? "default" : "outline"}>
                            {page.published_at ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {page.visitors.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {formatPercent(page.conversion_rate)}
                            {page.conversion_rate > 0.05 ? (
                              <ChevronUp className="ml-1 h-4 w-4 text-green-500" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {format(new Date(page.created_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No landing pages yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first landing page to get started
                </p>
                <Button asChild>
                  <Link to="/create-page">
                    <Plus className="mr-2 h-4 w-4" /> Create Landing Page
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
          {pages.length > 5 && (
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/pages">
                  View All Pages <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
