
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, FileText, Lightbulb, LineChart, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getImmediateOptimization } from "@/utils/optimizationUtils";
import { LandingPageFormValues } from "./LandingPageForm";
import { Link } from "react-router-dom";

interface AIOptimizationTabProps {
  formValues: LandingPageFormValues;
  previewHtml: string;
  onApplyOptimizations: (updatedHtml: string, updatedKeywords?: string[]) => void;
  isGenerating: boolean;
  onUpdateGeneratingState: (isGenerating: boolean) => void;
  keywordSuggestions: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
  onRegenerate: () => void; // <-- new prop
  reach: number; // <-- new prop
  potentialReach: number; // <-- new prop
  setPreviewHtml: (html: string) => void;
  setFormValues: (values: LandingPageFormValues) => void;
  setActiveTab: (tab: string) => void;
}

export const AIOptimizationTab: React.FC<AIOptimizationTabProps> = ({
  formValues,
  previewHtml,
  onApplyOptimizations,
  isGenerating,
  onUpdateGeneratingState,
  keywordSuggestions,
  onAddKeyword,
  onRemoveKeyword,
  onRegenerate,
  reach,
  potentialReach,
  setPreviewHtml,
  setFormValues,
  setActiveTab
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
  
  // Function to open preview in a new tab
  const openPreviewInNewTab = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(optimizedHtml);
      previewWindow.document.title = 'Optimized Landing Page Preview';
      previewWindow.document.close();
    }
  };

  return (
    <div className="space-y-6">
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
                  className="w-full h-[600px]"
                  style={{ border: 'none' }}
                />
              </div>
              {/* Move Regenerate button here, before Apply/Preview */}
              <div className="mt-4 flex flex-col gap-2 items-end">
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={openPreviewInNewTab}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Preview in new tab
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onRegenerate}
                    disabled={isGenerating}
                    className="w-fit"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {isGenerating ? "Regenerating..." : "Regenerate"}
                  </Button>
                  <Button onClick={handleApplyOptimizations} className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Apply Optimizations and preview
                  </Button>
                  {/* New: Preview Optimized Page */}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setPreviewHtml(optimizedHtml);
                      setActiveTab('preview');
                    }}
                  >
                    Preview Optimized Page
                  </Button>
                  {/* New: Edit Optimized Page */}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setFormValues({ ...formValues, ...parseOptimizedHtmlToFormValues(optimizedHtml) });
                      setActiveTab('form');
                    }}
                  >
                    Edit Optimized Page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Helper function (mock): parseOptimizedHtmlToFormValues
function parseOptimizedHtmlToFormValues(html: string): Partial<LandingPageFormValues> {
  // In a real app, parse the HTML to extract form values. Here, just return an empty object.
  return {};
}
