
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import {
  ArrowLeft,
  Check,
  Lightbulb,
  Loader2,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface PageInfo {
  id: string;
  title: string;
  html_content: string;
}

interface AISuggestion {
  id: string;
  page_id: string;
  suggestion_type: string;
  content: string;
  status: "pending" | "applied" | "rejected";
  created_at: string;
  applied_at: string | null;
}

const mockSuggestions = [
  {
    suggestion_type: "headline",
    content: "Change headline to 'Boost Your Website Traffic by 247% with Our Proven SEO Strategy'",
  },
  {
    suggestion_type: "button",
    content: "Update CTA button text from 'Submit' to 'Get My Free SEO Analysis'",
  },
  {
    suggestion_type: "layout",
    content: "Move testimonials section above the pricing section for better conversion flow",
  },
  {
    suggestion_type: "content",
    content: "Add social proof metrics: '2,500+ happy customers' and '12,000+ websites optimized'",
  },
  {
    suggestion_type: "keywords",
    content: "Add keywords 'affordable SEO service', 'best SEO company', and 'SEO results' to your page content",
  },
];

const AIOptimizer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState<PageInfo | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");

  useEffect(() => {
    const fetchPageAndSuggestions = async () => {
      try {
        if (!user || !id) return;
        
        setLoading(true);
        
        // Fetch page info
        const { data: pageData, error: pageError } = await supabase
          .from('landing_pages')
          .select('id, title, html_content')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (pageError) {
          throw pageError;
        }
        
        setPage(pageData);
        
        // Fetch existing suggestions
        const { data: suggestionsData, error: suggestionsError } = await supabase
          .from('ai_suggestions')
          .select('*')
          .eq('page_id', id)
          .order('created_at', { ascending: false });
        
        if (suggestionsError) {
          throw suggestionsError;
        }
        
        setSuggestions(suggestionsData || []);
      } catch (error: any) {
        toast.error(`Error loading data: ${error.message}`);
        navigate('/pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPageAndSuggestions();
  }, [id, user, navigate]);

  const generateSuggestions = async () => {
    try {
      if (!user || !id) return;
      
      setGenerating(true);
      
      // For demo purposes, we'll create mock suggestions
      const newSuggestions = mockSuggestions.map((suggestion) => ({
        page_id: id,
        suggestion_type: suggestion.suggestion_type,
        content: suggestion.content,
        status: "pending" as const,
      }));
      
      const { data, error } = await supabase
        .from('ai_suggestions')
        .insert(newSuggestions)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setSuggestions((prev) => [...data, ...prev]);
        toast.success("Generated new AI suggestions!");
      }
    } catch (error: any) {
      toast.error(`Error generating suggestions: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleApplySuggestion = async (suggestionId: string) => {
    try {
      if (!user) return;
      
      // Update suggestion status
      const { error } = await supabase
        .from('ai_suggestions')
        .update({
          status: 'applied',
          applied_at: new Date().toISOString(),
        })
        .eq('id', suggestionId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === suggestionId
            ? { ...s, status: 'applied', applied_at: new Date().toISOString() }
            : s
        )
      );
      
      toast.success("Suggestion applied successfully!");
    } catch (error: any) {
      toast.error(`Error applying suggestion: ${error.message}`);
    }
  };

  const handleRejectSuggestion = async (suggestionId: string) => {
    try {
      if (!user) return;
      
      // Update suggestion status
      const { error } = await supabase
        .from('ai_suggestions')
        .update({
          status: 'rejected',
        })
        .eq('id', suggestionId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === suggestionId ? { ...s, status: 'rejected' } : s
        )
      );
      
      toast.success("Suggestion rejected");
    } catch (error: any) {
      toast.error(`Error rejecting suggestion: ${error.message}`);
    }
  };

  const filteredSuggestions = () => {
    switch (currentTab) {
      case "pending":
        return suggestions.filter((s) => s.status === "pending");
      case "applied":
        return suggestions.filter((s) => s.status === "applied");
      case "rejected":
        return suggestions.filter((s) => s.status === "rejected");
      default:
        return suggestions;
    }
  };

  const getSuggestionTypeLabel = (type: string) => {
    switch (type) {
      case "headline":
        return "Headline Change";
      case "button":
        return "Button Copy";
      case "layout":
        return "Layout Improvement";
      case "content":
        return "Content Enhancement";
      case "keywords":
        return "Keyword Optimization";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Layout title="AI Optimizer">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout title="AI Optimizer">
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
    <Layout title={`AI Optimizer: ${page.title}`}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/pages')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
          </Button>
          
          <Button
            size="sm"
            onClick={generateSuggestions}
            disabled={generating}
          >
            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate New Suggestions
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                  AI Optimization Suggestions
                </CardTitle>
                <CardDescription>
                  Smart suggestions to improve your landing page performance
                </CardDescription>
              </div>
              <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                className="w-full md:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="applied">Applied</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSuggestions().length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="mx-auto h-12 w-12 text-primary/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No suggestions found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {currentTab === "all"
                    ? "No AI suggestions have been generated yet for this page."
                    : `No ${currentTab} suggestions found.`}
                </p>
                {currentTab === "all" && (
                  <Button onClick={generateSuggestions} disabled={generating}>
                    {generating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Suggestions
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSuggestions().map((suggestion) => (
                  <Card key={suggestion.id} className="overflow-hidden">
                    <div className={`p-1 ${
                      suggestion.status === "applied" 
                        ? "bg-green-500" 
                        : suggestion.status === "rejected" 
                          ? "bg-red-500" 
                          : "bg-yellow-500"
                    }`}
                    />
                    <CardContent className="p-4 pt-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <Badge>
                              {getSuggestionTypeLabel(suggestion.suggestion_type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-3">
                              {format(new Date(suggestion.created_at), "MMM d, yyyy")}
                            </span>
                          </div>
                          <p>{suggestion.content}</p>
                        </div>
                        {suggestion.status === "pending" && (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectSuggestion(suggestion.id)}
                            >
                              <X className="mr-2 h-4 w-4" /> Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApplySuggestion(suggestion.id)}
                            >
                              <Check className="mr-2 h-4 w-4" /> Apply
                            </Button>
                          </div>
                        )}
                        {suggestion.status === "applied" && (
                          <div className="flex items-center text-green-500">
                            <Check className="mr-2 h-4 w-4" />
                            Applied {suggestion.applied_at && format(new Date(suggestion.applied_at), "MMM d, yyyy")}
                          </div>
                        )}
                        {suggestion.status === "rejected" && (
                          <div className="flex items-center text-red-500">
                            <X className="mr-2 h-4 w-4" />
                            Rejected
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t bg-muted/50">
            <div className="flex items-center text-center text-sm text-muted-foreground p-2">
              <RefreshCw className="mr-2 h-3 w-3" />
              {suggestions.length === 0
                ? "AI suggestions are generated based on page performance data"
                : `AI analyzes user behavior to optimize your landing page`}
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default AIOptimizer;
