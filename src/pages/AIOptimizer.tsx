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
  FileEdit,
  ChevronRight,
  BarChart2,
  Target,
  MessageSquare,
  LayoutGrid,
  Type,
  ExternalLink
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PageInfo {
  id: string;
  title: string;
  html_content: string;
  audience: string;
  industry: string; 
  campaign_type: string;
  initial_keywords: string[];
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
        
        // Fetch page info with additional fields for AI optimizer
        const { data: pageData, error: pageError } = await supabase
          .from('landing_pages')
          .select('id, title, html_content, audience, industry, campaign_type, initial_keywords')
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
        
        // Convert status to proper type for AISuggestion
        const typedSuggestions = (suggestionsData || []).map(suggestion => ({
          ...suggestion,
          status: suggestion.status as "pending" | "applied" | "rejected"
        }));
        
        setSuggestions(typedSuggestions);
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
        user_id: user.id,
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
        // Convert status to proper type for AISuggestion
        const typedData = data.map(item => ({
          ...item,
          status: item.status as "pending" | "applied" | "rejected"
        }));
        
        setSuggestions((prev) => [...typedData, ...prev]);
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
            ? { ...s, status: 'applied' as const, applied_at: new Date().toISOString() }
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
          s.id === suggestionId ? { ...s, status: 'rejected' as const } : s
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
  
  const navigateToLandingPageCreator = () => {
    if (page) {
      // Navigate to landing page creator with query parameters to preload the page
      navigate(`/create-landing?edit=true&pageId=${page.id}`);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "headline":
        return <Type className="h-4 w-4" />;
      case "button":
        return <Target className="h-4 w-4" />;
      case "layout":
        return <LayoutGrid className="h-4 w-4" />;
      case "content":
        return <MessageSquare className="h-4 w-4" />;
      case "keywords":
        return <BarChart2 className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getSuggestionTypeColor = (type: string) => {
    switch (type) {
      case "headline":
        return "bg-blue-500/10 text-blue-500";
      case "button":
        return "bg-purple-500/10 text-purple-500";
      case "layout":
        return "bg-green-500/10 text-green-500";
      case "content":
        return "bg-orange-500/10 text-orange-500";
      case "keywords":
        return "bg-pink-500/10 text-pink-500";
      default:
        return "bg-gray-500/10 text-gray-500";
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">AI Optimizer</h1>
            <p className="text-muted-foreground">
              Enhance your landing page with AI-powered suggestions
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/pages')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToLandingPageCreator}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Edit Page
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
              Generate Suggestions
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    AI Suggestions
                  </CardTitle>
                  <Badge variant="secondary" className="font-normal">
                    {suggestions.length} suggestions
                  </Badge>
                </div>
                <CardDescription>
                  Smart recommendations to improve your page performance
                </CardDescription>
              </CardHeader>

              <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                className="px-6"
              >
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="applied">Applied</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>

              <CardContent className="p-6">
                <ScrollArea className="h-[600px] pr-4">
                  {filteredSuggestions().length === 0 ? (
                    <div className="text-center py-8">
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
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant="secondary" 
                                className={`${getSuggestionTypeColor(suggestion.suggestion_type)}`}
                              >
                                {getSuggestionIcon(suggestion.suggestion_type)}
                                <span className="ml-1.5">
                                  {getSuggestionTypeLabel(suggestion.suggestion_type)}
                                </span>
                              </Badge>
                              <Badge 
                                variant={suggestion.status === "applied" ? "default" : 
                                        suggestion.status === "rejected" ? "destructive" : 
                                        "secondary"}
                              >
                                {suggestion.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-sm">{suggestion.content}</p>
                          </CardContent>
                          {suggestion.status === "pending" && (
                            <CardFooter className="p-4 pt-2 flex justify-end gap-2 border-t bg-muted/50">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectSuggestion(suggestion.id)}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApplySuggestion(suggestion.id)}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Apply
                              </Button>
                            </CardFooter>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
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
          
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Page Preview</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className="font-normal cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => {
                      const previewWindow = window.open('', '_blank');
                      if (previewWindow) {
                        previewWindow.document.write(page.html_content);
                        previewWindow.document.close();
                      }
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1.5" />
                    Live Preview
                  </Badge>
                </div>
              </CardHeader>
              <div className="h-[700px] overflow-auto">
                <iframe
                  title="Landing Page Preview"
                  srcDoc={page.html_content}
                  className="w-full h-full border-0"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIOptimizer;
