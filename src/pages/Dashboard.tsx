
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Plus, ArrowRight, FileText, ChevronUp, ChevronDown, Calendar, ArrowUpDown } from "lucide-react";
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
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, Trophy, User, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

// Define filter types
type FilterType = "all" | "published" | "draft";
type SortDirection = "asc" | "desc";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<PageWithMetrics[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [averageConversion, setAverageConversion] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { theme, setTheme } = useTheme();
  const [achievements, setAchievements] = useState<string[]>([]);
  
  // New state for filtering and sorting
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  useEffect(() => {
    if (totalVisitors >= 1000 && !achievements.includes("First 1000 Visitors!")) {
      setAchievements(a => [...a, "First 1000 Visitors!"]);
    }
    if (totalPages >= 5 && !achievements.includes("5 Pages Created!")) {
      setAchievements(a => [...a, "5 Pages Created!"]);
    }
  }, [totalVisitors, totalPages, achievements]);

  // Format conversion rate as percentage
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };
  
  // Filter and sort pages
  const filteredAndSortedPages = useMemo(() => {
    // First filter the pages
    const filtered = pages.filter(page => {
      if (filter === "all") return true;
      if (filter === "published") return page.published_at !== null;
      if (filter === "draft") return page.published_at === null;
      return true;
    });
    
    // Then sort them
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [pages, filter, sortDirection]);
  
  // Calculate metrics based on filter
  const filteredMetrics = useMemo(() => {
    const filtered = pages.filter(page => {
      if (filter === "all") return true;
      if (filter === "published") return page.published_at !== null;
      if (filter === "draft") return page.published_at === null;
      return true;
    });
    
    const totalFilteredPages = filtered.length;
    const totalFilteredVisitors = filtered.reduce((sum, page) => sum + page.visitors, 0);
    const totalFilteredClicks = filtered.reduce((sum, page) => sum + page.clicks, 0);
    const avgFilteredConversion = totalFilteredVisitors > 0 
      ? totalFilteredClicks / totalFilteredVisitors 
      : 0;
      
    return {
      totalPages: totalFilteredPages,
      visitors: totalFilteredVisitors,
      clicks: totalFilteredClicks,
      conversion: avgFilteredConversion
    };
  }, [pages, filter]);
  
  // Helper function to determine active filter style
  const getFilterStyle = (filterType: FilterType) => {
    return filter === filterType 
      ? "bg-primary/10 text-primary font-bold border-b-2 border-primary" 
      : "hover:bg-primary/5";
  };
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "desc" ? "asc" : "desc");
  };

  return (
    <Layout title="Dashboard">
      {/* Personalized Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="ring-2 ring-primary/30 shadow-lg">
            <AvatarImage src={user?.user_metadata?.avatar_url || undefined} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : "!"}</h2>
            <p className="text-muted-foreground text-lg">Here's an overview of your landing pages and performance 🚀</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div 
            className={`flex flex-col items-center cursor-pointer transition-all p-2 rounded-lg ${getFilterStyle("all")}`}
            onClick={() => setFilter("all")}
          >
            <span className="text-2xl font-bold text-primary">{pages.length}</span>
            <span className="text-xs text-muted-foreground">Total Pages</span>
          </div>
          <div 
            className={`flex flex-col items-center cursor-pointer transition-all p-2 rounded-lg ${getFilterStyle("published")}`}
            onClick={() => setFilter("published")}
          >
            <span className="text-2xl font-bold text-green-600">{pages.filter(p => p.published_at !== null).length}</span>
            <span className="text-xs text-muted-foreground">Published</span>
          </div>
          <div 
            className={`flex flex-col items-center cursor-pointer transition-all p-2 rounded-lg ${getFilterStyle("draft")}`}
            onClick={() => setFilter("draft")}
          >
            <span className="text-2xl font-bold text-yellow-600">{pages.filter(p => p.published_at === null).length}</span>
            <span className="text-xs text-muted-foreground">Drafts</span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="transition-colors hover:bg-primary/10">
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
      {/* Onboarding Tooltip */}
      {showOnboarding && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 flex items-center gap-4 animate-fade-in shadow-md">
          <Sparkles className="h-6 w-6 text-primary animate-bounce" />
          <span className="text-base font-medium">Tip: Track your performance and optimize your pages for better results!</span>
          <Button variant="outline" size="sm" onClick={() => setShowOnboarding(false)} className="ml-auto">Got it</Button>
        </div>
      )}
      {/* Gamification Achievements */}
      {achievements.length > 0 && (
        <div className="mb-6 flex gap-2 flex-wrap">
          {achievements.map((ach, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1 bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 animate-pulse shadow">
              <Trophy className="h-4 w-4" /> {ach}
            </Badge>
          ))}
        </div>
      )}
      {/* Progress Bar for Conversion Rate */}
      <div className="mb-6">
        <Progress value={filteredMetrics.conversion * 100} className="h-3 rounded-full bg-muted/30 shadow-inner" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>100% Conversion</span>
        </div>
      </div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="transition-transform hover:scale-105">
          <MetricsCard
            title="Total Visitors"
            value={loading ? "..." : filteredMetrics.visitors.toLocaleString()}
            description={`For ${filter === "all" ? "all" : filter} pages`}
            trend={8.2}
            loading={loading}
          />
        </div>
        <div className="transition-transform hover:scale-105">
          <MetricsCard
            title="Total Clicks"
            value={loading ? "..." : filteredMetrics.clicks.toLocaleString()}
            description={`On all ${filter === "all" ? "" : filter} call-to-action buttons`}
            trend={12.5}
            loading={loading}
          />
        </div>
        <div className="transition-transform hover:scale-105">
          <MetricsCard
            title="Average Conversion"
            value={loading ? "..." : formatPercent(filteredMetrics.conversion)}
            description="Clicks divided by visitors"
            trend={-2.4}
            loading={loading}
          />
        </div>
        <div className="transition-transform hover:scale-105">
          <MetricsCard
            title="Active Pages"
            value={loading ? "..." : filteredMetrics.totalPages.toString()}
            description={`Currently ${filter === "all" ? "total" : filter} pages`}
            trend={0}
            loading={loading}
          />
        </div>
      </div>
      {/* Recent Landing Pages Table */}
      <Card className="glassmorphic-card shadow-2xl border-0 mt-6 bg-white/80 backdrop-blur-lg rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-t-2xl">
          <div className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {filter === "all" ? "Recent Landing Pages" : 
                 filter === "published" ? "Published Pages" : "Draft Pages"}
              </CardTitle>
              <CardDescription>
                {filter === "all" ? "Your recently created landing pages and their performance" : 
                 filter === "published" ? "Your published landing pages" : "Your draft landing pages"}
              </CardDescription>
            </div>
            <Button
              variant="ghost" 
              size="sm"
              onClick={toggleSortDirection}
              className="flex items-center gap-1"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Date
              {sortDirection === "desc" ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronUp className="h-4 w-4" />
              }
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-md" />
              ))}
            </div>
          ) : filteredAndSortedPages.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Visitors</TableHead>
                    <TableHead className="text-right">Conversion</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        Created
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={toggleSortDirection}
                          className="ml-1 p-0 h-auto"
                        >
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedPages.slice(0, 5).map((page) => (
                    <TableRow key={page.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
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
                        <Badge variant={page.published_at ? "default" : "outline"} className="transition-colors">
                          {page.published_at ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{page.visitors}</TableCell>
                      <TableCell className="text-right">{formatPercent(page.conversion_rate)}</TableCell>
                      <TableCell className="text-right">{format(new Date(page.created_at), "MMM d, yyyy")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-primary/30 mb-4 animate-fade-in" />
              <h3 className="text-lg font-medium mb-2">No {filter === "all" ? "" : filter} landing pages yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first landing page to get started
              </p>
              <Button asChild className="transition-transform hover:scale-105">
                <Link to="/create-page">
                  <Plus className="mr-2 h-4 w-4" /> Create Landing Page
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Dashboard;
