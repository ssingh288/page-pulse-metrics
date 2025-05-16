
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, FileText, Lightbulb, LineChart } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getImmediateOptimization } from "@/utils/optimizationUtils";
import { LandingPageFormValues } from "./LandingPageForm";

interface AIOptimizationTabProps {
  formValues: LandingPageFormValues;
  previewHtml: string;
  onApplyOptimizations: (updatedHtml: string, updatedKeywords?: string[]) => void;
  isGenerating: boolean;
  onUpdateGeneratingState: (isGenerating: boolean) => void;
  keywordSuggestions: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}

export const AIOptimizationTab: React.FC<AIOptimizationTabProps> = ({
  formValues,
  previewHtml,
  onApplyOptimizations,
  isGenerating,
  onUpdateGeneratingState,
  keywordSuggestions,
  onAddKeyword
}) => {
  const [optimizedHtml, setOptimizedHtml] = useState("");
  const [trafficReachEstimate, setTrafficReachEstimate] = useState({
    before: "0%",
    after: "0%",
    improvement: "0%",
    confidence: "low"
  });
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  useEffect(() => {
    // Auto-generate optimization when the component mounts
    if (previewHtml && !optimizedHtml && !isGenerating) {
      handleGenerateOptimization();
    }
  }, [previewHtml]);

  const handleGenerateOptimization = async () => {
    if (!previewHtml) {
      toast.error("Please generate a landing page preview first");
      return;
    }

    try {
      onUpdateGeneratingState(true);
      
      // Process keywords into an array
      const keywordsArray = formValues.keywords
        .split(",")
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
      
      // Get immediate optimization with traffic reach estimate
      const { optimizedHtml: optimizedContent, trafficReachEstimate: stats } = getImmediateOptimization(
        previewHtml,
        {
          title: formValues.title,
          audience: formValues.audience,
          industry: formValues.industry,
          campaign_type: formValues.campaign_type,
          keywords: keywordsArray,
        }
      );
      
      // Update state with optimized content and stats
      setOptimizedHtml(optimizedContent);
      setTrafficReachEstimate(stats);
      setOptimizationComplete(true);
      
      toast.success("AI optimization complete!");
    } catch (error) {
      console.error("Error during optimization:", error);
      toast.error("Failed to generate optimization. Please try again.");
    } finally {
      onUpdateGeneratingState(false);
    }
  };

  const handleApplyOptimizations = () => {
    if (!optimizedHtml) return;
    
    onApplyOptimizations(optimizedHtml);
    toast.success("Applied AI optimizations to your landing page!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">AI Optimization</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGenerateOptimization}
          disabled={isGenerating || !previewHtml}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? "Optimizing..." : "Regenerate"}
        </Button>
      </div>

      {isGenerating ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Optimizing Your Landing Page</h3>
            <p className="text-center text-muted-foreground max-w-md">
              Our AI is analyzing your content and making improvements to enhance conversion rates and search visibility.
            </p>
          </div>
        </Card>
      ) : !optimizationComplete ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Ready to Optimize</h3>
            <p className="text-center text-muted-foreground max-w-md">
              Generate AI optimizations for your landing page to improve conversion rates, SEO visibility, and overall performance.
            </p>
            <Button 
              className="mt-6"
              onClick={handleGenerateOptimization}
              disabled={!previewHtml}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Optimization
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Traffic Reach Statistics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Traffic Reach Estimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium mb-1">Current Reach</p>
                  <div className="flex items-center">
                    <div className="w-full mr-2">
                      <Progress value={parseFloat(trafficReachEstimate.before)} className="h-2" />
                    </div>
                    <span className="text-sm font-bold">{trafficReachEstimate.before}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Potential Reach</p>
                  <div className="flex items-center">
                    <div className="w-full mr-2">
                      <Progress value={parseFloat(trafficReachEstimate.after)} className="h-2" />
                    </div>
                    <span className="text-sm font-bold">{trafficReachEstimate.after}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="text-green-600 font-bold">+{trafficReachEstimate.improvement}</span> potential improvement
                </p>
                <Badge variant={trafficReachEstimate.confidence === 'high' ? "default" : "secondary"}>
                  {trafficReachEstimate.confidence} confidence
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Optimized Preview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Optimized Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  title="Optimized Preview"
                  srcDoc={optimizedHtml}
                  className="w-full h-[400px]"
                  style={{ border: 'none' }}
                />
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button onClick={handleApplyOptimizations}>
                  Apply Optimizations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Insights */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Optimization Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Badge className="mr-2 mt-1">SEO</Badge>
                  <span>Enhanced header structure and keyword placement for better search visibility</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 mt-1">Conversion</Badge>
                  <span>Improved call-to-action elements and button placement for higher conversion rates</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 mt-1">Content</Badge>
                  <span>Added persuasive copy and social proof elements to build trust</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 mt-1">UX</Badge>
                  <span>Enhanced readability and content structure for better user experience</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
