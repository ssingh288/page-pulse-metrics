
import { useState, useEffect, useCallback } from "react";
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
  User,
  Save,
  Undo2,
  Upload
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
import { 
  PageOptimizationSuggestion,
  AdSuggestion,
  applyOptimizationsToHTML
} from "@/utils/aiService";
import { 
  applyOptimizationToPage, 
  republishOptimizedPage, 
  generateMockSuggestions,
  generateMockAdSuggestions
} from "@/utils/optimizationUtils";
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

interface OptimizationVersion {
  id: string;
  html_content: string;
  created_at: string;
  description: string;
}

const AIOptimizer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState<PageInfo | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [republishing, setRepublishing] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [activeTab, setActiveTab] = useState("page-optimization");
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<PageOptimizationSuggestion | null>(null);
  const [adSuggestions, setAdSuggestions] = useState<AdSuggestion | null>(null);
  const [isLoadingAds, setIsLoadingAds] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [originalHtml, setOriginalHtml] = useState<string>("");
  const { theme, setTheme } = useTheme();
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [versionHistory, setVersionHistory] = useState<OptimizationVersion[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Load landing page and initial suggestions
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
        setOriginalHtml(pageData.html_content || "");
        setPreviewHtml(pageData.html_content || "");
        
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

        // Initialize version history with original version
        setVersionHistory([{
          id: "original",
          html_content: pageData.html_content || "",
          created_at: pageData.created_at || new Date().toISOString(),
          description: "Original Version"
        }]);
      } catch (error: any) {
        toast.error(`Error loading data: ${error.message}`);
        navigate('/pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPageAndSuggestions();
  }, [id, user, navigate]);

  // Generate optimization suggestions
  const generateSuggestions = async () => {
    try {
      if (!user || !id || !page) return;
      
      setGenerating(true);
      
      // For demo purposes, we'll create mock optimization suggestions directly
      const mockSuggestions = generateMockSuggestions(page.html_content || "", {
        title: page.title,
        audience: page.audience,
        industry: page.industry,
        campaign_type: page.campaign_type,
        keywords: page.initial_keywords
      });
      
      setOptimizationSuggestions(mockSuggestions);
      
      // Also generate some textual suggestions
      const newSuggestions = [
        { 
          suggestion_type: "headline", 
          content: `Change headline to "${mockSuggestions.headline?.suggested}"` 
        },
        { 
          suggestion_type: "content", 
          content: "Add testimonials section with real customer quotes to build trust" 
        },
        { 
          suggestion_type: "layout", 
          content: "Move CTA button above the fold for better visibility" 
        },
        { 
          suggestion_type: "keywords", 
          content: "Add keywords 'ai training', 'tech upskilling', and 'career advancement' to improve SEO" 
        },
        { 
          suggestion_type: "button", 
          content: `Change CTA button text to "${mockSuggestions.cta?.suggested}"` 
        },
      ];
      
      // Insert new suggestions
      const { data, error } = await supabase
        .from('ai_suggestions')
        .insert(newSuggestions.map(suggestion => ({
          page_id: id,
          suggestion_type: suggestion.suggestion_type,
          content: suggestion.content,
          status: "pending" as const,
        })))
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
        
        // Add to achievements if first suggestion generated
        if (!achievements.includes("First Optimization Generated!")) {
          setAchievements(prev => [...prev, "First Optimization Generated!"]);
        }
        
        toast.success("Generated new AI suggestions!");
        
        // Update preview with suggestions 
        const updatedHtml = applyOptimizationsToHTML(page.html_content || "", mockSuggestions);
        setPreviewHtml(updatedHtml);
        
        // Add to version history
        const newVersion = {
          id: `version-${Date.now()}`,
          html_content: updatedHtml,
          created_at: new Date().toISOString(),
          description: "AI-Optimized Content"
        };
        setVersionHistory(prev => [...prev, newVersion]);
      }
    } catch (error: any) {
      toast.error(`Error generating suggestions: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // Generate ad content
  const generateAdContent = async () => {
    try {
      if (!user || !id || !page) return;
      
      setIsLoadingAds(true);
      
      // For demo purposes, we'll generate mock ad suggestions
      const mockAdSuggestions = generateMockAdSuggestions(page.html_content || "", {
        title: page.title,
        audience: page.audience,
        industry: page.industry,
        campaign_type: page.campaign_type,
        keywords: page.initial_keywords
      });
      
      setAdSuggestions(mockAdSuggestions);
      
      // Add achievement for generating ads
      if (!achievements.includes("Ad Content Generated!")) {
        setAchievements(prev => [...prev, "Ad Content Generated!"]);
      }
      
      toast.success("Generated ad content for multiple platforms!");
    } catch (error: any) {
      toast.error(`Error generating ad suggestions: ${error.message}`);
    } finally {
      setIsLoadingAds(false);
    }
  };

  // Apply a specific suggestion
  const handleApplySuggestion = async (suggestionId: string) => {
    try {
      if (!user || !id) return;
      
      const suggestion = suggestions.find(s => s.id === suggestionId);
      if (!suggestion || !page) return;

      let updatedHtml = page.html_content || "";
      
      // Apply the specific suggestion to the HTML
      // For demo, we're using a simplified approach
      if (suggestion.suggestion_type === "headline") {
        updatedHtml = updatedHtml.replace(
          /<h1[^>]*>(.*?)<\/h1>/,
          `<h1>${optimizationSuggestions?.headline?.suggested || "Master AI in Just 20 Hours: The Ultimate Tech Crash Course"}</h1>`
        );
      } else if (suggestion.suggestion_type === "button") {
        updatedHtml = updatedHtml.replace(
          /<button[^>]*class="cta-button"[^>]*>(.*?)<\/button>/,
          `<button class="cta-button">${optimizationSuggestions?.cta?.suggested || "Secure Your AI Training Spot"}</button>`
        );
      } else if (suggestion.suggestion_type === "content") {
        // Find the first paragraph in the subheader class
        updatedHtml = updatedHtml.replace(
          /<p[^>]*class="subheader"[^>]*>(.*?)<\/p>/,
          `<p class="subheader">${optimizationSuggestions?.content?.[0].suggested || "Ideal for tech professionals, job-seeking students, and non-IT professionals looking to boost their career with in-demand AI skills."}</p>`
        );
      }
      
      // Save the updated HTML
      const result = await applyOptimizationToPage(id, updatedHtml, suggestionId);
      
      if (result.success) {
        // Update local suggestion state
        setSuggestions(prev => prev.map(s => 
          s.id === suggestionId 
            ? { ...s, status: 'applied' as const, applied_at: new Date().toISOString() } 
            : s
        ));
        
        // Update the preview HTML
        setPreviewHtml(updatedHtml);
        
        // Add to version history
        const newVersion = {
          id: `version-${Date.now()}`,
          html_content: updatedHtml,
          created_at: new Date().toISOString(),
          description: `Applied "${suggestion.suggestion_type}" suggestion`
        };
        setVersionHistory(prev => [...prev, newVersion]);
        
        // Add achievement if first suggestion applied
        if (!achievements.includes("First Suggestion Applied!")) {
          setAchievements(prev => [...prev, "First Suggestion Applied!"]);
        }
        
        toast.success("Suggestion applied successfully!");
      } else {
        throw new Error("Failed to apply suggestion");
      }
    } catch (error: any) {
      toast.error(`Error applying suggestion: ${error.message}`);
    }
  };

  // Reject a specific suggestion
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
      setSuggestions(prev =>
        prev.map(s =>
          s.id === suggestionId ? { ...s, status: 'rejected' as const } : s
        )
      );
      
      toast.success("Suggestion rejected");
    } catch (error: any) {
      toast.error(`Error rejecting suggestion: ${error.message}`);
    }
  };

  // Apply all optimization suggestions at once
  const applyAllSuggestions = async () => {
    try {
      if (!page || !optimizationSuggestions) return;
      
      // Apply all suggestions to the HTML
      const updatedHtml = applyOptimizationsToHTML(page.html_content || "", optimizationSuggestions);
      
      // Save the updated HTML
      const result = await applyOptimizationToPage(id!, updatedHtml);
      
      if (result.success) {
        // Mark all pending suggestions as applied
        const pendingSuggestions = suggestions.filter(s => s.status === "pending");
        
        for (const suggestion of pendingSuggestions) {
          await supabase
            .from('ai_suggestions')
            .update({
              status: 'applied',
              applied_at: new Date().toISOString()
            })
            .eq('id', suggestion.id);
        }
        
        // Update local suggestion state
        setSuggestions(prev => prev.map(s => 
          s.status === "pending"
            ? { ...s, status: 'applied' as const, applied_at: new Date().toISOString() } 
            : s
        ));
        
        // Update the preview HTML
        setPreviewHtml(updatedHtml);
        
        // Add to version history
        const newVersion = {
          id: `version-${Date.now()}`,
          html_content: updatedHtml,
          created_at: new Date().toISOString(),
          description: "Applied all suggestions"
        };
        setVersionHistory(prev => [...prev, newVersion]);
        
        // Add achievement
        if (!achievements.includes("Full Optimization Applied!")) {
          setAchievements(prev => [...prev, "Full Optimization Applied!"]);
        }
        
        toast.success("All suggestions applied successfully!");
      } else {
        throw new Error("Failed to apply all suggestions");
      }
    } catch (error: any) {
      toast.error(`Error applying all suggestions: ${error.message}`);
    }
  };

  // Restore to a specific version
  const restoreVersion = (versionId: string) => {
    const version = versionHistory.find(v => v.id === versionId);
    if (!version) return;
    
    setPreviewHtml(version.html_content);
    toast.success(`Restored to: ${version.description}`);
  };

  // Republish the landing page with optimizations
  const handleRepublish = async () => {
    try {
      if (!id) return;
      
      setRepublishing(true);
      
      // Apply current preview HTML to page
      await applyOptimizationToPage(id, previewHtml);
      
      // Republish the page
      const result = await republishOptimizedPage(id);
      
      if (result.success) {
        // Add achievement
        if (!achievements.includes("Page Republished!")) {
          setAchievements(prev => [...prev, "Page Republished!"]);
        }
        
        toast.success("Landing page republished successfully!");
        
        // If we have a published URL, show a preview option
        if (result.publishedUrl) {
          toast("View your published page", {
            action: {
              label: "View",
              onClick: () => window.open(result.publishedUrl, '_blank')
            }
          });
        }
      } else {
        throw new Error("Failed to republish page");
      }
    } catch (error: any) {
      toast.error(`Error republishing page: ${error.message}`);
    } finally {
      setRepublishing(false);
    }
  };

  // Filter suggestions based on the selected tab
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

  // Get appropriate label for suggestion types
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
  
  // Get appropriate icon for suggestion types
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
  
  // Get appropriate color for suggestion types
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

  // Group suggestions by type
  const groupedSuggestions = () => {
    const groups: Record<string, AISuggestion[]> = {};
    filteredSuggestions().forEach((s) => {
      if (!groups[s.suggestion_type]) groups[s.suggestion_type] = [];
      groups[s.suggestion_type].push(s);
    });
    return groups;
  };

  // Get impact badge data for different suggestion types
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

  // Handle undoing an applied suggestion
  const [undoSuggestionId, setUndoSuggestionId] = useState<string | null>(null);
  const handleUndoApply = async (suggestionId: string) => {
    try {
      const suggestion = suggestions.find(s => s.id === suggestionId);
      if (!suggestion) return;
      
      // Mark suggestion as pending again
      await supabase
        .from('ai_suggestions')
        .update({
          status: 'pending',
          applied_at: null
        })
        .eq('id', suggestionId);
      
      // Update local state
      setSuggestions(prev => prev.map(s => 
        s.id === suggestionId 
          ? { ...s, status: 'pending' as const, applied_at: null } 
          : s
      ));
      
      // Revert to original HTML for now (in a real app, you'd track the specific changes)
      setPreviewHtml(originalHtml);
      
      setUndoSuggestionId(suggestionId);
      setTimeout(() => setUndoSuggestionId(null), 2000);
      toast.success("Change reverted!");
    } catch (error: any) {
      toast.error(`Error reverting change: ${error.message}`);
    }
  };

  // Calculate progress percentage
  const appliedCount = suggestions.filter(s => s.status === "applied").length;
  const progress = suggestions.length ? Math.round((appliedCount / suggestions.length) * 100) : 0;

  // Update achievements based on actions
  useEffect(() => {
    if (appliedCount === 1 && !achievements.includes("First Suggestion Applied!")) {
      setAchievements(a => [...a, "First Suggestion Applied!"]);
    }
    if (appliedCount >= 5 && !achievements.includes("5 Suggestions Applied!")) {
      setAchievements(a => [...a, "5 Suggestions Applied!"]);
    }
  }, [appliedCount, achievements]);

  // Showing loading state
  if (loading) {
    return (
      <Layout title="AI Optimizer">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Showing 404 state
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
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">AI Optimization Studio</h2>
            <p className="text-muted-foreground text-lg">Supercharge your landing page performance 🚀</p>
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
          <span className="text-base font-medium">Get started by clicking "Generate Optimization Suggestions" to see how AI can improve your landing page performance!</span>
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
      
      <div className="mb-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(`/pages/${id}/edit`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={generateSuggestions} 
          disabled={generating}
          className="ml-auto"
        >
          {generating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Optimization Suggestions
        </Button>
        <Button 
          variant={activeTab === "ad-generation" ? "default" : "outline"} 
          size="sm" 
          onClick={() => {
            setActiveTab("ad-generation");
            if (!adSuggestions) generateAdContent();
          }}
        >
          {isLoadingAds ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MessageSquare className="mr-2 h-4 w-4" />
          )}
          Generate Ads
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowVersionHistory(!showVersionHistory)}
        >
          <Target className="mr-2 h-4 w-4" />
          {showVersionHistory ? "Hide History" : "Version History"}
        </Button>
        <Button 
          variant="default"
          size="sm"
          onClick={handleRepublish}
          disabled={republishing}
        >
          {republishing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Republish Page
        </Button>
      </div>
      
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
              <div className="lg:col-span-1 space-y-8">
                {showVersionHistory ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" /> Version History
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowVersionHistory(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3 mt-4">
                      {versionHistory.map((version, index) => (
                        <Card 
                          key={version.id} 
                          className={`transition-all ${previewHtml === version.html_content ? 'border-primary bg-primary/5' : 'bg-card'}`}
                        >
                          <CardHeader className="py-3 px-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle className="text-base">{version.description}</CardTitle>
                                <CardDescription className="text-xs">
                                  {format(new Date(version.created_at), "MMMM d, yyyy • h:mm a")}
                                </CardDescription>
                              </div>
                              <Button 
                                variant={previewHtml === version.html_content ? "default" : "outline"} 
                                size="sm"
                                onClick={() => restoreVersion(version.id)}
                              >
                                {previewHtml === version.html_content ? 'Current' : 'Restore'}
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" /> AI Suggestions
                      </h3>
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-auto mr-2"
                          onClick={() => setShowVersionHistory(true)}
                        >
                          <History className="h-4 w-4 mr-1" /> History
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="ml-auto"
                          onClick={applyAllSuggestions}
                          disabled={!optimizationSuggestions || suggestions.filter(s => s.status === "pending").length === 0}
                        >
                          <Check className="h-4 w-4 mr-1" /> Apply All
                        </Button>
                      </div>
                    </div>
                    
                    <TabsList className="mb-4 w-full">
                      <TabsTrigger 
                        value="all" 
                        onClick={() => setCurrentTab("all")}
                        className={currentTab === "all" ? "bg-primary text-primary-foreground" : ""}
                      >
                        All ({suggestions.length})
                      </TabsTrigger>
                      <TabsTrigger 
                        value="pending" 
                        onClick={() => setCurrentTab("pending")}
                        className={currentTab === "pending" ? "bg-primary text-primary-foreground" : ""}
                      >
                        Pending ({suggestions.filter(s => s.status === "pending").length})
                      </TabsTrigger>
                      <TabsTrigger 
                        value="applied" 
                        onClick={() => setCurrentTab("applied")}
                        className={currentTab === "applied" ? "bg-primary text-primary-foreground" : ""}
                      >
                        Applied ({suggestions.filter(s => s.status === "applied").length})
                      </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[550px] pr-4">
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
                                      <Undo2 className="h-4 w-4 mr-2" /> Undo
                                    </Button>
                                  )}
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {filteredSuggestions().length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                          <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No suggestions yet</h3>
                          <p className="text-muted-foreground">Click "Generate Optimization Suggestions" to get AI recommendations!</p>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-2">
                <Card className="overflow-hidden glassmorphic-card border-0 h-full">
                  <CardHeader className="pb-2 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Page Preview</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setPreviewHtml(originalHtml)}
                          disabled={previewHtml === originalHtml}
                        >
                          <Undo2 className="h-4 w-4 mr-2" /> Restore Original
                        </Button>
                        <Badge variant="secondary" className="font-normal cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => {
                          const previewWindow = window.open('', '_blank');
                          if (previewWindow) {
                            previewWindow.document.write(previewHtml);
                            previewWindow.document.close();
                          }
                        }}>
                          <ExternalLink className="h-3 w-3 mr-1.5" /> Live Preview
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <div className="h-[600px] overflow-auto">
                    <iframe title="Landing Page Preview" srcDoc={previewHtml} className="w-full h-full border-0 rounded-b-2xl" />
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          {activeTab === "ad-generation" && (
            <div className="p-4">
              {adSuggestions ? (
                <AdPreviewPanel adSuggestions={adSuggestions} />
              ) : (
                <div className="text-center py-24 border-2 border-dashed rounded-lg">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-4">Generate ad content for your landing page</h3>
                  <Button
                    onClick={generateAdContent}
                    disabled={isLoadingAds}
                  >
                    {isLoadingAds ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate Ad Content
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AIOptimizer;
