import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Plus, Search, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PageInfo {
  id: string;
  title: string;
}

interface Keyword {
  id: string;
  page_id: string;
  keyword: string;
  volume: number | null;
  cpc: number | null;
  performance_score: number | null;
  created_at: string;
}

const KeywordsManager = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState<PageInfo | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [addingKeyword, setAddingKeyword] = useState(false);

  useEffect(() => {
    const fetchPageAndKeywords = async () => {
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
        
        // Fetch keywords
        const { data: keywordsData, error: keywordsError } = await supabase
          .from('keywords')
          .select('*')
          .eq('page_id', id);
        
        if (keywordsError) {
          throw keywordsError;
        }
        
        setKeywords(keywordsData || []);
      } catch (error: any) {
        toast.error(`Error loading data: ${error.message}`);
        navigate('/pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPageAndKeywords();
  }, [id, user, navigate]);

  const addKeyword = async () => {
    try {
      if (!user || !id || !newKeyword.trim()) return;
      
      setAddingKeyword(true);
      
      const newKeywordData = {
        page_id: id,
        keyword: newKeyword.trim(),
        volume: Math.floor(Math.random() * 5000),  // Mock data
        cpc: parseFloat((Math.random() * 5).toFixed(2))  // Mock data
      };
      
      const { data, error } = await supabase
        .from('keywords')
        .insert([newKeywordData])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setKeywords((prev) => [...prev, ...data]);
        toast.success("Keyword added successfully!");
        setNewKeyword("");
      }
    } catch (error: any) {
      toast.error(`Error adding keyword: ${error.message}`);
    } finally {
      setAddingKeyword(false);
    }
  };

  const deleteKeyword = async (keywordId: string) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', keywordId);
      
      if (error) {
        throw error;
      }
      
      setKeywords((prev) => prev.filter((k) => k.id !== keywordId));
      toast.success("Keyword deleted successfully");
    } catch (error: any) {
      toast.error(`Error deleting keyword: ${error.message}`);
    }
  };

  const filteredKeywords = keywords.filter((keyword) =>
    keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return `$${value.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Layout title="Keywords Manager">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout title="Keywords Manager">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-4">Page not found</h3>
          <Button onClick={() => navigate('/pages')} size="lg" className="mt-4 px-8 py-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Keywords: ${page.title}`}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/pages')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Keyword
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Keyword</DialogTitle>
                <DialogDescription>
                  Enter a new keyword to track for this landing page.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter keyword..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={addKeyword} 
                  disabled={addingKeyword || !newKeyword.trim()}
                >
                  Add Keyword
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Keywords Manager</CardTitle>
            <CardDescription>
              Track and optimize keywords for better landing page performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center border rounded-md px-3 max-w-md mb-6">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input
                placeholder="Search keywords..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredKeywords.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No keywords found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? "No keywords match your search. Try a different term."
                    : "You haven't added any keywords yet."}
                </p>
                {!searchTerm && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Your First Keyword
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Keyword</DialogTitle>
                        <DialogDescription>
                          Enter a new keyword to track for this landing page.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Input
                            placeholder="Enter keyword..."
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          onClick={addKeyword} 
                          disabled={addingKeyword || !newKeyword.trim()}
                        >
                          Add Keyword
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Keyword</TableHead>
                      <TableHead className="text-right">Search Volume</TableHead>
                      <TableHead className="text-right">CPC</TableHead>
                      <TableHead className="text-right">Performance</TableHead>
                      <TableHead className="text-right w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKeywords.map((keyword) => (
                      <TableRow key={keyword.id}>
                        <TableCell className="font-medium">
                          {keyword.keyword}
                        </TableCell>
                        <TableCell className="text-right">
                          {keyword.volume?.toLocaleString() || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(keyword.cpc)}
                        </TableCell>
                        <TableCell className="text-right">
                          {keyword.performance_score !== null 
                            ? `${(keyword.performance_score * 100).toFixed(1)}%` 
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Keyword</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the keyword "{keyword.keyword}"?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteKeyword(keyword.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default KeywordsManager;
