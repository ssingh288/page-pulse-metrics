import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, BarChart2, ExternalLink, Sparkles, Trash2, FileText } from "lucide-react";
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Landing Pages</h1>
            <p className="text-muted-foreground">
              Create and manage your landing pages
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/create-page">
                <Plus className="mr-2 h-4 w-4" /> Create New Page
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Your Pages</CardTitle>
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
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {pages.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-primary/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No landing pages yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first landing page to get started
                </p>
                <Button asChild>
                  <Link to="/create-page">
                    <Plus className="mr-2 h-4 w-4" /> Create Landing Page
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPages.map((page) => (
                  <Card key={page.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{page.title}</CardTitle>
                          <CardDescription>
                            {page.campaign_type} • Created {format(new Date(page.created_at), "MMM d, yyyy")}
                          </CardDescription>
                        </div>
                        <Badge variant={page.published_url ? "default" : "secondary"}>
                          {page.published_url ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {page.published_url && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={page.published_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">Actions</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/pages/${page.id}/edit`} className="flex items-center cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/pages/${page.id}/metrics`} className="flex items-center cursor-pointer">
                                <BarChart2 className="mr-2 h-4 w-4" /> Metrics
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/pages/${page.id}/optimize`} className="flex items-center cursor-pointer">
                                <Sparkles className="mr-2 h-4 w-4" /> AI Optimize
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeletePage(page.id)} 
                              className="flex items-center cursor-pointer text-destructive"
                            >
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
      </div>
    </Layout>
  );
};

export default LandingPages;
