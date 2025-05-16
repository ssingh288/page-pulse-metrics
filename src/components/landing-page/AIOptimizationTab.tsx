
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2, Plus, X, BarChart2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AIOptimizationTabProps {
  formValues: {
    title: string;
    campaign_type: string;
    industry: string;
    audience: string;
    keywords: string;
  };
  previewHtml: string;
  onApplyOptimizations: (updatedHtml: string, updatedKeywords: string[]) => void;
  isGenerating: boolean;
  onUpdateGeneratingState: (state: boolean) => void;
  keywordSuggestions: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}

interface KeywordData {
  keyword: string;
  traffic: string;
  difficulty: string;
  relevance: string;
}

interface OptimizationResult {
  suggestedKeywords: KeywordData[];
  optimizedContent: string;
  recommendations: string[];
}

export function AIOptimizationTab({
  formValues,
  previewHtml,
  onApplyOptimizations,
  isGenerating,
  onUpdateGeneratingState,
  keywordSuggestions,
  onAddKeyword,
  onRemoveKeyword
}: AIOptimizationTabProps) {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [newKeyword, setNewKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<string>("keywords");

  const generateOptimizations = async () => {
    try {
      onUpdateGeneratingState(true);
      
      // Process keywords into an array
      const keywordsArray = keywordSuggestions || [];
      
      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: { 
          prompt: `
            Generate SEO keyword optimization recommendations for:
            Title: ${formValues.title}
            Target Audience: ${formValues.audience}
            Industry: ${formValues.industry}
            Campaign Type: ${formValues.campaign_type}
            
            Analyze these keywords and recommend optimizations: ${keywordsArray.join(', ')}
            
            For each keyword, provide:
            1. Traffic potential (high, medium, low with percentage)
            2. Difficulty score (high, medium, low with percentage)
            3. Relevance to the target audience
            
            Also provide 3-5 specific content recommendations to better incorporate these keywords.
            
            Return a JSON response with the following structure:
            {
              "suggestedKeywords": [
                {
                  "keyword": "example keyword",
                  "traffic": "percentage",
                  "difficulty": "percentage",
                  "relevance": "high/medium/low"
                }
              ],
              "recommendations": ["recommendation 1", "recommendation 2"]
            }
          `,
          mode: "keyword_optimization"
        }
      });

      if (error) {
        throw new Error(`Error invoking function: ${error.message}`);
      }

      if (data?.result) {
        setOptimizationResult(data.result);
        toast.success("Generated AI keyword optimization suggestions");
      } else {
        throw new Error("No optimization data received");
      }
    } catch (error: any) {
      console.error("Error generating optimization data:", error);
      toast.error(`Failed to generate optimizations: ${error.message}`);
    } finally {
      onUpdateGeneratingState(false);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      onAddKeyword(newKeyword.trim());
      setNewKeyword("");
      toast.success(`Added keyword: ${newKeyword.trim()}`);
    }
  };

  const handleApplyOptimizations = () => {
    if (!optimizationResult) return;
    
    // Apply the optimized keywords
    const updatedKeywords = optimizationResult.suggestedKeywords.map(k => k.keyword);
    
    // In a real implementation, you'd update the HTML with the optimized content
    // For now, we'll just update the keywords
    onApplyOptimizations(previewHtml, updatedKeywords);
    toast.success("Applied AI optimization suggestions");
  };

  const calculateTrafficScore = (keywords: KeywordData[]) => {
    if (!keywords || keywords.length === 0) return 0;
    
    const total = keywords.reduce((sum, keyword) => {
      const trafficValue = parseInt(keyword.traffic.replace('%', '')) || 0;
      return sum + trafficValue;
    }, 0);
    
    return Math.min(100, Math.round(total / keywords.length));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Keywords
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input 
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add keyword..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <Button 
                onClick={handleAddKeyword}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-1">
              {keywordSuggestions.length === 0 ? (
                <div className="text-sm text-muted-foreground w-full text-center py-2">
                  Add keywords to optimize content
                </div>
              ) : (
                keywordSuggestions.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {keyword}
                    <button 
                      onClick={() => onRemoveKeyword(keyword)}
                      className="ml-1 hover:bg-secondary rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            
            <Button 
              onClick={generateOptimizations}
              disabled={isGenerating || keywordSuggestions.length === 0}
              className="w-full"
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Optimize with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="keywords">Keyword Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="keywords" className="mt-0">
              {!optimizationResult ? (
                <div className="text-center py-8 text-muted-foreground">
                  Click "Optimize with AI" to analyze your keywords and generate suggestions
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Traffic Potential Score</div>
                    <div className="text-lg font-bold text-primary">
                      {calculateTrafficScore(optimizationResult.suggestedKeywords)}%
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Keyword</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Traffic</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Difficulty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {optimizationResult.suggestedKeywords.map((keyword, idx) => (
                          <tr key={idx} className="hover:bg-muted/30">
                            <td className="px-4 py-2 text-sm">{keyword.keyword}</td>
                            <td className="px-4 py-2 text-sm text-right">
                              <Badge variant={
                                parseInt(keyword.traffic) > 70 ? "default" :
                                parseInt(keyword.traffic) > 40 ? "outline" : "secondary"
                              }>
                                {keyword.traffic}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 text-sm text-right">
                              <Badge variant={
                                parseInt(keyword.difficulty) < 30 ? "default" :
                                parseInt(keyword.difficulty) < 60 ? "outline" : "secondary"
                              }>
                                {keyword.difficulty}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-0">
              {!optimizationResult ? (
                <div className="text-center py-8 text-muted-foreground">
                  Click "Optimize with AI" to generate content recommendations
                </div>
              ) : (
                <div className="space-y-4">
                  {optimizationResult.recommendations.map((recommendation, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </div>
      
      <Button 
        onClick={handleApplyOptimizations}
        disabled={!optimizationResult}
        className="w-full"
        size="lg"
      >
        <BarChart2 className="mr-2 h-4 w-4" />
        Apply Optimization Suggestions
      </Button>
    </div>
  );
}
