import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    totalVisitors: 0,
    conversionRate: 0,
    activePages: 0,
    avgTimeOnPage: 0,
    adReach: 0, // Placeholder, no column in DB
    adEngagement: 0, // Placeholder, no column in DB
    adCTR: 0, // Placeholder, no column in DB
    adConversions: 0, // Placeholder, no column in DB
  });

  // Fetch metrics from Supabase
  const fetchMetrics = async () => {
    // Fetch all page_metrics
    const { data: pageMetrics, error: metricsError } = await supabase
      .from("page_metrics")
      .select("*");

    // Fetch all landing pages
    const { data: landingPages, error: pagesError } = await supabase
      .from("landing_pages")
      .select("id");

    if (metricsError || pagesError) {
      console.error(metricsError || pagesError);
      return;
    }

    // Calculate metrics
    let totalVisitors = 0;
    let totalClicks = 0;
    let totalAvgTime = 0;
    let totalBounceRate = 0;

    pageMetrics.forEach((row) => {
      totalVisitors += row.visitors || 0;
      totalClicks += row.clicks || 0;
      totalAvgTime += Number(row.avg_time) || 0;
      totalBounceRate += Number(row.bounce_rate) || 0;
    });

    setMetrics({
      totalVisitors,
      conversionRate: totalVisitors ? (totalClicks / totalVisitors) * 100 : 0, // Using clicks as proxy for conversions
      activePages: landingPages.length,
      avgTimeOnPage: pageMetrics.length ? totalAvgTime / pageMetrics.length : 0,
      adReach: 0, // No column in DB
      adEngagement: 0, // No column in DB
      adCTR: 0, // No column in DB
      adConversions: 0, // No column in DB
    });
  };

  useEffect(() => {
    fetchMetrics();
    // Subscribe to real-time changes in page_metrics and landing_pages
    const channel = supabase
      .channel('dashboard-metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'page_metrics' }, () => {
        fetchMetrics();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'landing_pages' }, () => {
        fetchMetrics();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "User";

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome {userName}:</h2>
          <p className="text-muted-foreground text-base">Here is the overview of all your landing pages.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalVisitors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activePages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgTimeOnPage.toFixed(2)}s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ad Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.adReach}</div>
            <div className="text-xs text-muted-foreground">(No data column yet)</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ad Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.adEngagement}</div>
            <div className="text-xs text-muted-foreground">(No data column yet)</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ad CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.adCTR.toFixed(2)}%</div>
            <div className="text-xs text-muted-foreground">(No data column yet)</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ad Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.adConversions}</div>
            <div className="text-xs text-muted-foreground">(No data column yet)</div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
