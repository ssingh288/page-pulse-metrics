
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, BarChart2, ExternalLink, Sparkles, Trash2 } from "lucide-react";
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
    <Layout title="Landing Pages">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Landing Pages</h2>
            <p className="text-muted-foreground mt-2">
              Create, manage and optimize your marketing pages
            </p>
          </div>
          <Button asChild>
            <Link to="/create-page">
              <Plus className="mr-2 h-4 w-4" /> Create Page
            </Link>
          </Button>
        </div>

        <div className="flex items-center border rounded-md px-3 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            placeholder="Search pages..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-9 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredPages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{page.title}</CardTitle>
                    <Badge variant={page.published_at ? "default" : "outline"}>
                      {page.published_at ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <CardDescription>{page.campaign_type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Created: {format(new Date(page.created_at), 'PPP')}
                  </p>
                  {page.published_at && (
                    <p className="text-sm text-muted-foreground">
                      Published: {format(new Date(page.published_at), 'PPP')}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Actions</Button>
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
                      <DropdownMenuItem onClick={() => handleDeletePage(page.id)} className="flex items-center cursor-pointer text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {page.published_url && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={page.published_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground mb-4">
              No landing pages found
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchTerm
                ? "No pages match your search. Try a different keyword."
                : "You haven't created any landing pages yet."}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/create-page">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Page
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LandingPages;
