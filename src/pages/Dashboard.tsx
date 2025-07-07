import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageTable, PageData } from "@/components/dashboard/PageTable";
import { ChevronRight, ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FlyerCreator } from "@/components/ad-generator/FlyerCreator";

// Sample data for recent pages
const recentPages = [
  {
    id: "94371989-eb8b-46a8-bb32-f8bff59434dc",
    name: "AI workshop",
    status: "draft" as const,
    visitors: 699,
    conversionRate: 0.2389,
    createdAt: new Date("2025-05-14"),
  },
  {
    id: "ccf99145-b27f-4403-873d-29750a6dba28",
    name: "AI workshop",
    status: "draft" as const,
    visitors: 968,
    conversionRate: 0.2696,
    createdAt: new Date("2025-05-14"),
  },
  {
    id: "74217ec6-f6a7-4529-96ce-7b77066905e0",
    name: "AI workshop",
    status: "draft" as const,
    visitors: 868,
    conversionRate: 0.2143,
    createdAt: new Date("2025-05-14"),
  },
  {
    id: "a6443eed-562d-4f42-b5ab-9271e3f63ecb",
    name: "AI workshop",
    status: "draft" as const,
    visitors: 625,
    conversionRate: 0.1536,
    createdAt: new Date("2025-05-14"),
  },
  {
    id: "a143723a-9fca-4643-853e-c06d3e7effac",
    name: "AI workshop",
    status: "draft" as const,
    visitors: 671,
    conversionRate: 0.0775,
    createdAt: new Date("2025-05-14"),
  },
];

const SatisfactionFeedback = ({ page }: { page: PageData }) => {
  const [satisfied, setSatisfied] = useState<null | boolean>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestion = async () => {
    setLoading(true);
    // Stub: Replace with real AI call
    setTimeout(() => {
      setAiSuggestion("Try updating your headline and adding a stronger call-to-action to improve conversions.");
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div>
        <span className="font-medium">{page.name}</span>
        <span className="ml-2 text-xs text-muted-foreground">({(page.conversionRate * 100).toFixed(2)}% conversion)</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Are you satisfied?</span>
        <Button size="sm" variant={satisfied === true ? "default" : "outline"} onClick={() => setSatisfied(true)}>
          Yes
        </Button>
        <Button size="sm" variant={satisfied === false ? "destructive" : "outline"} onClick={() => setSatisfied(false)}>
          No
        </Button>
        {!satisfied && (
          <Button size="sm" variant="secondary" onClick={handleGetSuggestion} disabled={loading}>
            {loading ? "Getting AI Suggestion..." : "Get AI Suggestion"}
          </Button>
        )}
      </div>
      {aiSuggestion && (
        <div className="mt-2 text-sm text-blue-700 bg-blue-50 rounded p-2 w-full md:w-auto">{aiSuggestion}</div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Add filtering function for landing pages
  const filteredPages = recentPages.filter(page => 
    page.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your landing pages
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Visitors
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.2%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pages</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +3 since last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Time on Page
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1m 42s</div>
              <p className="text-xs text-muted-foreground">
                +12s from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Advertisement Metrics section after stats overview and before recent pages */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ad Reach</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,200</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ad Engagement</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" /></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,540</div>
              <p className="text-xs text-muted-foreground">+9% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ad CTR</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 19V5M5 12h14" /></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">+0.4% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ad Conversions</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">420</div>
              <p className="text-xs text-muted-foreground">+6% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* After Stats Overview, before Recent Pages Section */}
        <div className="my-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Are you satisfied with your landing page results?</CardTitle>
              <CardDescription>
                Let us know if you are satisfied with the performance of your landing pages. If not, we can suggest AI-powered improvements!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPages.length === 0 ? (
                <p className="text-muted-foreground">No landing pages to review.</p>
              ) : (
                <div className="space-y-4">
                  {filteredPages.map((page, idx) => (
                    <SatisfactionFeedback key={page.id} page={page} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Flyer Creator for WhatsApp/Hyper-local */}
        <FlyerCreator />

        {/* Recent Pages Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Recent Pages */}
          <Card className="col-span-full md:col-span-7 glassmorphic-card shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-xl">Recent Pages</CardTitle>
                <CardDescription>
                  Your most recently created landing pages
                </CardDescription>
              </div>
              <Link to="/pages" className="text-primary hover:underline text-sm flex items-center">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search pages..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <div className="relative w-full overflow-auto max-h-[400px]">
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
                            <Button variant="ghost" className="ml-1 p-0 h-auto">
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No pages found matching your search
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPages.map((page, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-primary/5 transition-colors cursor-pointer"
                          >
                            <TableCell className="font-medium">
                              <Link to={`/pages/${page.id}/metrics`} className="hover:text-primary hover:underline flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2 h-4 w-4 text-muted-foreground"
                                >
                                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                  <path d="M10 9H8" />
                                  <path d="M16 13H8" />
                                  <path d="M16 17H8" />
                                </svg>
                                {page.name}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge className="transition-colors">
                                {page.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{page.visitors}</TableCell>
                            <TableCell className="text-right">{(page.conversionRate * 100).toFixed(2)}%</TableCell>
                            <TableCell className="text-right">
                              {page.createdAt.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-full md:col-span-5">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Get started with these common tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/create-page" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Create New Landing Page
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/pages" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  View All Landing Pages
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/analytics" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  View Analytics
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/settings" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Account Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Created new landing page</p>
                  <p className="text-xs text-muted-foreground">AI Workshop</p>
                </div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Updated landing page</p>
                  <p className="text-xs text-muted-foreground">Product Launch</p>
                </div>
                <div className="text-xs text-muted-foreground">Yesterday</div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Viewed analytics</p>
                  <p className="text-xs text-muted-foreground">Monthly report</p>
                </div>
                <div className="text-xs text-muted-foreground">3 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
