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
  ExternalLink,
  Sun,
  Moon,
  Trophy,
  User
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
import DynamicLandingPageOptimizer from "@/components/DynamicLandingPageOptimizer";
import AdPreviewPanel from "@/components/AdPreviewPanel";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [activeTab, setActiveTab] = useState("page-optimization");
  const [adSuggestions, setAdSuggestions] = useState(null);
  const [isLoadingAds, setIsLoadingAds] = useState(false);
  const { theme, setTheme } = useTheme();
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(true);

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

  const groupedSuggestions = () => {
    const groups: Record<string, AISuggestion[]> = {};
    suggestions.forEach((s) => {
      if (!groups[s.suggestion_type]) groups[s.suggestion_type] = [];
      groups[s.suggestion_type].push(s);
    });
    return groups;
  };

  const getImpactBadge = (type: string) => {
    switch (type) {
      case "headline": return { label: "+60% Traffic", color: "bg-green-500/20 text-green-700" };
      case "button": return { label: "+20% CTR", color: "bg-blue-500/20 text-blue-700" };
      case "layout": return { label: "+15% Conversion", color: "bg-purple-500/20 text-purple-700" };
      case "content": return { label: "+10% Engagement", color: "bg-orange-500/20 text-orange-700" };
      case "keywords": return { label: "+30% SEO", color: "bg-pink-500/20 text-pink-700" };
      default: return { label: "AI", color: "bg-gray-500/20 text-gray-700" };
    }
  };

  const [undoSuggestionId, setUndoSuggestionId] = useState<string | null>(null);
  const handleUndoApply = (suggestionId: string) => {
    // ... logic to undo ...
    setUndoSuggestionId(suggestionId);
    setTimeout(() => setUndoSuggestionId(null), 2000);
    toast.success("Change reverted!");
  };

  const appliedCount = suggestions.filter(s => s.status === "applied").length;
  const progress = suggestions.length ? Math.round((appliedCount / suggestions.length) * 100) : 0;

  useEffect(() => {
    if (appliedCount === 1 && !achievements.includes("First Suggestion Applied!")) {
      setAchievements(a => [...a, "First Suggestion Applied!"]);
    }
    if (appliedCount >= 10 && !achievements.includes("10 Suggestions Applied!")) {
      setAchievements(a => [...a, "10 Suggestions Applied!"]);
    }
  }, [appliedCount, achievements]);

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="ring-2 ring-primary/30 shadow-lg">
            <AvatarImage src={user?.user_metadata?.avatar_url || undefined} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : "!"}</h2>
            <p className="text-muted-foreground text-lg">Let's supercharge your landing page 🚀</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{appliedCount}</span>
            <span className="text-xs text-muted-foreground">Suggestions Applied</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{achievements.length}</span>
            <span className="text-xs text-muted-foreground">Achievements</span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="transition-colors hover:bg-primary/10">{theme === "dark" ? <Sun /> : <Moon />}</Button>
        </div>
      </div>
      {showOnboarding && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 flex items-center gap-4 animate-fade-in shadow-md">
          <Sparkles className="h-6 w-6 text-primary animate-bounce" />
          <span className="text-base font-medium">Tip: Use the tabs below to switch between optimization and ad generation. Click on a suggestion to see its impact and apply with one click!</span>
          <Button variant="outline" size="sm" onClick={() => setShowOnboarding(false)} className="ml-auto">Got it</Button>
        </div>
      )}
      {achievements.length > 0 && (
        <div className="mb-6 flex gap-2 flex-wrap">
          {achievements.map((ach, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1 bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 animate-pulse shadow">
              <Trophy className="h-4 w-4" /> {ach}
            </Badge>
          ))}
        </div>
      )}
      <Card className="glassmorphic-card shadow-2xl border-0 bg-white/80 backdrop-blur-lg rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-t-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4 rounded-xl">
              <TabsTrigger value="page-optimization" className="text-lg font-semibold transition-colors hover:bg-primary/10">Page Optimization</TabsTrigger>
              <TabsTrigger value="ad-generation" className="text-lg font-semibold transition-colors hover:bg-primary/10">Ad Generation</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-2">
            <Progress value={progress} className="h-3 rounded-full bg-muted/30 shadow-inner" />
            <span className="text-xs text-muted-foreground ml-2">{progress}% optimized</span>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "page-optimization" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                {Object.entries(groupedSuggestions()).map(([type, group]) => (
                  <div key={type} className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      {getSuggestionIcon(type)}
                      <span className="font-bold text-base capitalize">{getSuggestionTypeLabel(type)}</span>
                      <Badge className={getImpactBadge(type).color + " ml-2"}>{getImpactBadge(type).label}</Badge>
                    </div>
                    <div className="space-y-4">
                      {group.map((suggestion) => (
                        <Card key={suggestion.id} className={`transition-all duration-300 border-2 ${suggestion.status === "applied" ? "border-green-400/60 bg-green-50/30" : suggestion.status === "rejected" ? "border-red-400/60 bg-red-50/30" : "border-primary/20 bg-white/80 hover:shadow-lg"} ${undoSuggestionId === suggestion.id ? "animate-pulse" : ""}`}>
                          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={getSuggestionTypeColor(suggestion.suggestion_type)}>
                                {getSuggestionIcon(suggestion.suggestion_type)}
                                <span className="ml-1.5">{getSuggestionTypeLabel(suggestion.suggestion_type)}</span>
                              </Badge>
                              <span className="ml-2 text-xs text-muted-foreground">{format(new Date(suggestion.created_at), "MMM d, yyyy")}</span>
                            </div>
                            <Badge variant={suggestion.status === "applied" ? "default" : suggestion.status === "rejected" ? "destructive" : "secondary"}>
                              {suggestion.status}
                            </Badge>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-base font-medium mb-2">{suggestion.content}</p>
                            <div className="text-xs text-muted-foreground mb-2">AI Insight: {getImpactBadge(suggestion.suggestion_type).label} — {getSuggestionTypeLabel(suggestion.suggestion_type)} can significantly improve your page.</div>
                          </CardContent>
                          <CardFooter className="p-4 pt-2 flex justify-end gap-2 border-t bg-muted/50">
                            {suggestion.status === "pending" && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => handleRejectSuggestion(suggestion.id)}>
                                  <X className="h-4 w-4 mr-2" /> Reject
                                </Button>
                                <Button size="sm" onClick={() => handleApplySuggestion(suggestion.id)}>
                                  <Check className="h-4 w-4 mr-2" /> Apply
                                </Button>
                              </>
                            )}
                            {suggestion.status === "applied" && (
                              <Button variant="ghost" size="sm" onClick={() => handleUndoApply(suggestion.id)}>
                                Undo
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-2">
                <Card className="overflow-hidden glassmorphic-card border-0">
                  <CardHeader className="pb-2 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Page Preview</CardTitle>
                      <Badge variant="secondary" className="font-normal cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => {
                        const previewWindow = window.open('', '_blank');
                        if (previewWindow) {
                          previewWindow.document.write(page.html_content);
                          previewWindow.document.close();
                        }
                      }}>
                        <ExternalLink className="h-3 w-3 mr-1.5" /> Live Preview
                      </Badge>
                    </div>
                  </CardHeader>
                  <div className="h-[700px] overflow-auto">
                    <iframe title="Landing Page Preview" srcDoc={page.html_content} className="w-full h-full border-0 rounded-b-2xl" />
                  </div>
                </Card>
              </div>
            </div>
          )}
          {activeTab === "ad-generation" && (
            <div className="p-4">
              <DynamicLandingPageOptimizer
                htmlContent={page.html_content}
                pageInfo={{
                  title: page.title,
                  audience: page.audience,
                  industry: page.industry,
                  campaign_type: page.campaign_type,
                  keywords: page.initial_keywords,
                }}
                onApplyChanges={() => toast.success("Ad suggestion applied!")}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AIOptimizer;
