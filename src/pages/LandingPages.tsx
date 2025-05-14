import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, BarChart2, ExternalLink, Sparkles, Trash2, FileText, Download, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, Trophy, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LandingPage {
  id: string;
  title: string;
  campaign_type: string;
  published_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const LandingPages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { theme, setTheme } = useTheme();
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        if (!user) return;

        setLoading(true);
        
        const { data, error } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }
        
        setPages(data || []);
      } catch (error: any) {
        toast.error(`Error loading pages: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [user]);

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.campaign_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }

      setPages(pages.filter(page => page.id !== id));
      toast.success("Page deleted successfully");
    } catch (error: any) {
      toast.error(`Error deleting page: ${error.message}`);
    }
  };

  const publishedCount = pages.filter(p => p.published_url).length;
  const draftCount = pages.length - publishedCount;
  useEffect(() => {
    if (publishedCount === 1 && !achievements.includes("First Page Published!")) {
      setAchievements(a => [...a, "First Page Published!"]);
    }
    if (pages.length >= 5 && !achievements.includes("5 Pages Created!")) {
      setAchievements(a => [...a, "5 Pages Created!"]);
    }
  }, [publishedCount, pages.length, achievements]);

  return (
    <Layout>
      {/* Personalized Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="ring-2 ring-primary/30 shadow-lg">
            <AvatarImage src={user?.user_metadata?.avatar_url || undefined} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : "!"}</h2>
            <p className="text-muted-foreground text-lg">Manage and grow your landing pages with ease 🚀</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{pages.length}</span>
            <span className="text-xs text-muted-foreground">Total Pages</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-green-600">{publishedCount}</span>
            <span className="text-xs text-muted-foreground">Published</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-yellow-600">{draftCount}</span>
            <span className="text-xs text-muted-foreground">Drafts</span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="transition-colors hover:bg-primary/10">{theme === "dark" ? <Sun /> : <Moon />}</Button>
        </div>
      </div>
      {/* Onboarding Tooltip */}
      {showOnboarding && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 flex items-center gap-4 animate-fade-in shadow-md">
          <Sparkles className="h-6 w-6 text-primary animate-bounce" />
          <span className="text-base font-medium">Tip: Use the search bar to quickly find pages. Click 'Create New Page' to get started!</span>
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
      {/* Progress Bar for Published Pages */}
      <div className="mb-6">
        <Progress value={pages.length ? (publishedCount / pages.length) * 100 : 0} className="h-3 rounded-full bg-muted/30 shadow-inner" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Drafts</span>
          <span>Published</span>
        </div>
      </div>
      {/* Main Card List */}
      <Card className="glassmorphic-card shadow-2xl border-0 bg-white/80 backdrop-blur-lg rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">Your Pages</CardTitle>
              <CardDescription>
                {pages.length} {pages.length === 1 ? 'page' : 'pages'} created
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>
              <Button asChild className="font-bold transition-transform hover:scale-105">
                <Link to="/create-page">
                  <Plus className="mr-2 h-4 w-4" /> Create New Page
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-primary/30 mb-4 animate-fade-in" />
              <h3 className="text-lg font-medium mb-2">No landing pages yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first landing page to get started
              </p>
              <Button asChild className="transition-transform hover:scale-105">
                <Link to="/create-page">
                  <Plus className="mr-2 h-4 w-4" /> Create Landing Page
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPages.map((page) => (
                <Card key={page.id} className="overflow-hidden glassmorphic-card border-2 transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-bold">{page.title}</CardTitle>
                      <CardDescription>
                        {page.campaign_type} • Created {format(new Date(page.created_at), "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                    <Badge variant={page.published_url ? "default" : "secondary"} className={page.published_url ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {page.published_url ? "Published" : "Draft"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {page.published_url && (
                        <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                          <a href={page.published_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="transition-transform hover:scale-105">
                        <Link to={`/pages/${page.id}/edit`} className="flex items-center cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">More</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/pages/${page.id}/edit`} className="flex items-center cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePage(page.id)} className="flex items-center cursor-pointer text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default LandingPages;
