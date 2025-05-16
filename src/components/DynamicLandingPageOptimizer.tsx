
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Sparkles, RefreshCw, LineChart, LayoutGrid, X, TrendingUp, Search } from "lucide-react";
import OptimizationPanel from "./OptimizationPanel";
import AdPreviewPanel from "./AdPreviewPanel";
import { 
  PageOptimizationSuggestion, 
  AdSuggestion,
  generatePageOptimizations,
  generateAdSuggestions,
  applyOptimizationsToHTML
} from "@/utils/aiService";
import { HistoryIcon } from "./HistoryIcon";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface DynamicLandingPageOptimizerProps {
  htmlContent: string;
  pageInfo: {
    title: string;
    audience: string;
    industry: string;
    campaign_type: string;
    keywords: string[];
    created_at?: string;
  };
  onApplyChanges: (updatedHtml: string) => void;
}

const DynamicLandingPageOptimizer: React.FC<DynamicLandingPageOptimizerProps> = ({
  htmlContent,
  pageInfo,
  onApplyChanges
}) => {
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<PageOptimizationSuggestion | null>(null);
  const [adSuggestions, setAdSuggestions] = useState<AdSuggestion | null>(null);
  const [isLoadingOptimizations, setIsLoadingOptimizations] = useState(false);
  const [isLoadingAds, setIsLoadingAds] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("page-optimization");
  
  // Version history
  const [suggestionHistory, setSuggestionHistory] = useState<PageOptimizationSuggestion[]>([]);
  const [adSuggestionHistory, setAdSuggestionHistory] = useState<AdSuggestion[]>([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState<number>(0);
  const [showVersionHistory, setShowVersionHistory] = useState<boolean>(false);
  
  // Generate multiple suggestions
  const [allOptimizationSuggestions, setAllOptimizationSuggestions] = useState<PageOptimizationSuggestion[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(0);
  
  // Automatically generate optimizations when component mounts
  useEffect(() => {
    // Only auto-generate if we don't already have optimizations
    if (!optimizationSuggestions && !isLoadingOptimizations) {
      handleGenerateOptimizations();
    }
  }, []);

  const handleGenerateOptimizations = async () => {
    try {
      setIsLoadingOptimizations(true);
      
      // Generate three suggestions in parallel
      const suggestionsPromises = [
        generatePageOptimizations(htmlContent, pageInfo),
        generatePageOptimizations(htmlContent, pageInfo),
        generatePageOptimizations(htmlContent, pageInfo)
      ];
      
      const allSuggestions = await Promise.all(suggestionsPromises);
      
      // Save all suggestions
      setAllOptimizationSuggestions(allSuggestions);
      setSelectedSuggestionIndex(0); // Select first suggestion by default
      setOptimizationSuggestions(allSuggestions[0]);
      
      // Add to history
      if (optimizationSuggestions) {
        setSuggestionHistory([...suggestionHistory, optimizationSuggestions]);
      }
      
      toast.success("Generated optimization suggestions!");
    } catch (error) {
      console.error("Error generating optimizations:", error);
      toast.error("Failed to generate optimization suggestions");
      
      // If we fail to generate multiple, try to generate just one
      try {
        const suggestion = await generatePageOptimizations(htmlContent, pageInfo);
        setOptimizationSuggestions(suggestion);
        setAllOptimizationSuggestions([suggestion]);
        setSelectedSuggestionIndex(0);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    } finally {
      setIsLoadingOptimizations(false);
    }
  };
  
  const handleGenerateAdSuggestions = async () => {
    try {
      setIsLoadingAds(true);
      const suggestions = await generateAdSuggestions(htmlContent, pageInfo);
      
      // Add to history if we already had suggestions
      if (adSuggestions) {
        setAdSuggestionHistory([...adSuggestionHistory, adSuggestions]);
      }
      
      setAdSuggestions(suggestions);
      toast.success("Generated ad content for multiple platforms!");
    } catch (error) {
      console.error("Error generating ad suggestions:", error);
      toast.error("Failed to generate ad suggestions");
    } finally {
      setIsLoadingAds(false);
    }
  };
  
  const handleApplySuggestion = (updatedHtml: string) => {
    onApplyChanges(updatedHtml);
    toast.success("Applied changes to landing page!");
  };
  
  const handleSelectSuggestion = (index: number) => {
    setSelectedSuggestionIndex(index);
    setOptimizationSuggestions(allOptimizationSuggestions[index]);
  };
  
  const handleSelectFromHistory = (index: number) => {
    setCurrentSuggestionIndex(index);
    setOptimizationSuggestions(suggestionHistory[index]);
  };
  
  const handleSelectAdFromHistory = (index: number) => {
    setAdSuggestions(adSuggestionHistory[index]);
  };
  
  // Render keywords with traffic likelihood
  const renderKeywordsWithTraffic = () => {
    if (!optimizationSuggestions?.keywords?.length) return null;
    
    return (
      <div className="space-y-3 mt-4">
        <h3 className="text-md font-semibold flex items-center">
          <Search className="h-4 w-4 mr-2" />
          Keyword Traffic Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {optimizationSuggestions.keywords.map((keyword, idx) => (
            <div key={idx} className="flex flex-col p-2 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-center">
                <span className="font-medium">{keyword.keyword}</span>
                <Badge 
                  variant={
                    keyword.relevance === "high" ? "default" :
                    keyword.relevance === "medium" ? "secondary" : "outline"
                  }
                >
                  {keyword.relevance}
                </Badge>
              </div>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>Traffic potential: {keyword.trafficPotential}</span>
              </div>
              <div className="mt-1">
                <Progress 
                  value={parseInt(keyword.trafficPotential) || 50} 
                  max={100} 
                  className="h-1"
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Difficulty: {keyword.difficulty}</span>
                <span className="text-primary">Recommended</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b flex items-center justify-between px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">AI Landing Page Optimizer</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onApplyChanges(htmlContent)}>Cancel</Button>
          <Button onClick={() => onApplyChanges(optimizationSuggestions ? applyOptimizationsToHTML(htmlContent, optimizationSuggestions) : htmlContent)} disabled={!optimizationSuggestions}>Apply Changes</Button>
          <Button variant="outline" onClick={handleGenerateOptimizations} disabled={isLoadingOptimizations}>
            {isLoadingOptimizations ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Regenerate
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Suggestions and Controls */}
        <div className="w-full md:w-1/3 flex flex-col h-full overflow-y-auto p-6 gap-6">
          {/* Theme/Layout Switcher */}
          <div className="mb-2">
            <div className="font-semibold mb-2">Theme/Layout</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {/* Theme/layout thumbnails */}
              <div className="w-24 h-16 bg-muted rounded border flex items-center justify-center text-xs cursor-pointer hover:ring-2 ring-primary transition">Theme 1</div>
              <div className="w-24 h-16 bg-muted rounded border flex items-center justify-center text-xs cursor-pointer hover:ring-2 ring-primary transition">Theme 2</div>
              <div className="w-24 h-16 bg-muted rounded border flex items-center justify-center text-xs cursor-pointer hover:ring-2 ring-primary transition">Theme 3</div>
            </div>
          </div>
          {/* Generate Suggestions Button */}
          <Button
            variant="default"
            onClick={handleGenerateOptimizations}
            disabled={isLoadingOptimizations}
            className="mb-4"
          >
            {isLoadingOptimizations ? "Analyzing Page..." : "Generate Optimization Suggestions"}
          </Button>
          
          {/* Display keyword traffic analysis */}
          {renderKeywordsWithTraffic()}
          
          {/* AI Suggestions, grouped by type */}
          <div className="space-y-6">
            <OptimizationPanel
              optimizationSuggestions={optimizationSuggestions}
              isLoading={isLoadingOptimizations}
              originalHtml={htmlContent}
              onApplySuggestion={handleApplySuggestion}
              suggestionHistory={showVersionHistory ? suggestionHistory : undefined}
              onSelectFromHistory={showVersionHistory ? handleSelectFromHistory : undefined}
            />
          </div>
        </div>
        {/* Right: Live Mobile Preview */}
        <div className="hidden md:flex w-2/3 h-full bg-muted/10 p-8 items-center justify-center overflow-y-auto">
          <div className="w-[375px] h-[700px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
            <div className="font-semibold text-center py-2 bg-muted/20 border-b">Mobile Preview</div>
            <iframe
              title="Landing Page Preview"
              srcDoc={optimizationSuggestions ? applyOptimizationsToHTML(htmlContent, optimizationSuggestions) : htmlContent}
              className="w-full h-full border-0"
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicLandingPageOptimizer;
