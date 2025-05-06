
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format, subDays } from "date-fns";
import { ArrowLeft, Calendar, RefreshCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { MetricsChart } from "@/components/dashboard/MetricsChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PageInfo {
  id: string;
  title: string;
}

interface PageMetrics {
  date: string;
  visitors: number;
  clicks: number;
  scroll_depth: number;
  avg_time: number;
  bounce_rate: number;
}

// Generate mock data for the charts
const generateDailyData = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - i - 1);
    return {
      name: format(date, "MMM dd"),
      visitors: Math.floor(Math.random() * 100) + 20,
      clicks: Math.floor(Math.random() * 40) + 5,
      scroll_depth: Math.floor(Math.random() * 100),
      avg_time: Math.floor(Math.random() * 300) + 30,
      bounce_rate: Math.floor(Math.random() * 40) + 10,
    };
  });
};

const PageMetrics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState<PageInfo | null>(null);
  const [metrics, setMetrics] = useState<PageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dailyData] = useState(generateDailyData(30));
  const [timeRange, setTimeRange] = useState("30d");

  const filteredData = () => {
    switch (timeRange) {
      case "7d":
        return dailyData.slice(-7);
      case "14d":
        return dailyData.slice(-14);
      case "30d":
      default:
        return dailyData;
    }
  };

  useEffect(() => {
    const fetchPageAndMetrics = async () => {
      try {
        if (!user || !id) return;
        
        setLoading(true);
        
        // Fetch page info
        const { data: pageData, error: pageError } = await supabase
          .from('landing_pages')
          .select('id, title')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (pageError) {
          throw pageError;
        }
        
        setPage(pageData);
        
        // Fetch the latest metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('page_metrics')
          .select('*')
          .eq('page_id', id)
          .order('date', { ascending: false })
          .limit(1)
          .single();
        
        if (metricsError && metricsError.code !== 'PGRST116') {
          // PGRST116 means no rows returned, which is ok for new pages
          throw metricsError;
        }
        
        setMetrics(metricsData || {
          visitors: 0,
          clicks: 0,
          scroll_depth: 0,
          avg_time: 0,
          bounce_rate: 0,
          date: new Date().toISOString()
        });
      } catch (error: any) {
        toast.error(`Error loading data: ${error.message}`);
        navigate('/pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPageAndMetrics();
  }, [id, user, navigate]);

  const refreshMetrics = async () => {
    try {
      if (!user || !id) return;
      
      setRefreshing(true);
      
      // For demo purposes, we'll just update with new random metrics
      const newMetrics = {
        page_id: id,
        visitors: Math.floor(Math.random() * 100) + 20,
        clicks: Math.floor(Math.random() * 40) + 5,
        scroll_depth: Math.floor(Math.random() * 100),
        avg_time: Math.floor(Math.random() * 300) + 30,
        bounce_rate: Math.floor(Math.random() * 40) + 10,
      };
      
      const { data, error } = await supabase
        .from('page_metrics')
        .upsert([newMetrics], { onConflict: 'page_id,date' })
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data[0]) {
        setMetrics(data[0]);
        toast.success("Metrics updated successfully");
      }
    } catch (error: any) {
      toast.error(`Error refreshing metrics: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Page Metrics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout title="Page Metrics">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-4">Page not found</h3>
          <Button onClick={() => navigate('/pages')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Metrics: ${page.title}`}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/pages')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshMetrics}
              disabled={refreshing}
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Metrics
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Visitors"
            value={metrics?.visitors ?? 0}
            description="People who visited your page"
            trend={12}
            loading={loading}
          />
          <MetricsCard
            title="CTA Clicks"
            value={metrics?.clicks ?? 0}
            description="Clicks on call-to-action buttons"
            trend={-3}
            loading={loading}
          />
          <MetricsCard
            title="Avg. Scroll Depth"
            value={`${metrics?.scroll_depth ?? 0}%`}
            description="How far users scroll down"
            trend={5}
            loading={loading}
          />
          <MetricsCard
            title="Bounce Rate"
            value={`${metrics?.bounce_rate ?? 0}%`}
            description="Users who leave without interaction"
            trend={-8}
            loading={loading}
          />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>
                Track how your page performs over time
              </CardDescription>
            </div>
            <Tabs
              defaultValue="30d"
              value={timeRange}
              onValueChange={setTimeRange}
              className="w-[200px]"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="14d">14d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData()}>
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Scroll Depth Insights</CardTitle>
              <CardDescription>
                How far users scroll down your page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData().slice(-7)}>
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Bar dataKey="scroll_depth" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visitor Engagement</CardTitle>
              <CardDescription>
                Average time spent and bounce rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredData().slice(-7)}>
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="avg_time"
                      stroke="#8884d8"
                    />
                    <Line
                      type="monotone"
                      dataKey="bounce_rate"
                      stroke="#ff8042"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PageMetrics;
