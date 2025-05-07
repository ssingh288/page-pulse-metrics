
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Sparkles, RefreshCw, LineChart, LayoutGrid } from "lucide-react";
import OptimizationPanel from "./OptimizationPanel";
import AdPreviewPanel from "./AdPreviewPanel";
import { 
  PageOptimizationSuggestion, 
  AdSuggestion,
  generatePageOptimizations,
  generateAdSuggestions 
} from "@/utils/aiService";

interface DynamicLandingPageOptimizerProps {
  htmlContent: string;
  pageInfo: {
    title: string;
    audience: string;
    industry: string;
    campaign_type: string;
    keywords: string[];
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
  
  const handleGenerateOptimizations = async () => {
    try {
      setIsLoadingOptimizations(true);
      const suggestions = await generatePageOptimizations(htmlContent, pageInfo);
      setOptimizationSuggestions(suggestions);
      toast.success("Generated optimization suggestions!");
    } catch (error) {
      console.error("Error generating optimizations:", error);
      toast.error("Failed to generate optimization suggestions");
    } finally {
      setIsLoadingOptimizations(false);
    }
  };
  
  const handleGenerateAdSuggestions = async () => {
    try {
      setIsLoadingAds(true);
      const suggestions = await generateAdSuggestions(htmlContent, pageInfo);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          AI Landing Page Optimizer
        </CardTitle>
        <CardDescription>
          Get AI-powered suggestions to improve your landing page performance and generate platform-specific ad content
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 m-6">
            <TabsTrigger value="page-optimization" className="flex items-center">
              <LineChart className="h-4 w-4 mr-2" />
              Page Optimization
            </TabsTrigger>
            <TabsTrigger value="ad-generation" className="flex items-center">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Ad Generation
            </TabsTrigger>
          </TabsList>
            
          <TabsContent value="page-optimization" className="p-6 pt-2">
            <div className="flex flex-col gap-4">
              {!optimizationSuggestions && !isLoadingOptimizations && (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto text-primary/30 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Optimize Your Landing Page</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    Our AI will analyze your landing page and provide actionable suggestions 
                    to improve your conversion rate and SEO performance.
                  </p>
                  <Button 
                    onClick={handleGenerateOptimizations}
                    className="mx-auto"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Optimization Suggestions
                  </Button>
                </div>
              )}
              
              {(optimizationSuggestions || isLoadingOptimizations) && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Optimization Suggestions</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGenerateOptimizations}
                      disabled={isLoadingOptimizations}
                    >
                      {isLoadingOptimizations ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Regenerate
                    </Button>
                  </div>
                  
                  <OptimizationPanel
                    optimizationSuggestions={optimizationSuggestions}
                    isLoading={isLoadingOptimizations}
                    originalHtml={htmlContent}
                    onApplySuggestion={handleApplySuggestion}
                  />
                </div>
              )}
            </div>
          </TabsContent>
            
          <TabsContent value="ad-generation" className="p-6 pt-2">
            <div className="flex flex-col gap-4">
              {!adSuggestions && !isLoadingAds && (
                <div className="text-center py-8">
                  <LayoutGrid className="h-12 w-12 mx-auto text-primary/30 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Generate Multi-Platform Ads</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    Our AI will generate platform-specific ad content for Facebook, Instagram,
                    LinkedIn, Twitter, and Google based on your landing page.
                  </p>
                  <Button 
                    onClick={handleGenerateAdSuggestions}
                    className="mx-auto"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Ad Suggestions
                  </Button>
                </div>
              )}
              
              {(adSuggestions || isLoadingAds) && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Platform-Specific Ads</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGenerateAdSuggestions}
                      disabled={isLoadingAds}
                    >
                      {isLoadingAds ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Regenerate
                    </Button>
                  </div>
                  
                  <AdPreviewPanel
                    adSuggestions={adSuggestions}
                    isLoading={isLoadingAds}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-between border-t bg-muted/50 p-6">
        <p className="text-sm text-muted-foreground">
          AI suggestions are based on conversion rate optimization best practices
        </p>
      </CardFooter>
    </Card>
  );
};

export default DynamicLandingPageOptimizer;
