
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Loader2, 
  Plus, 
  X, 
  BarChart2, 
  ArrowRight, 
  Palette, 
  LayoutTemplate, 
  Type, 
  MousePointerClick, 
  Image,
  Search,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  ctr?: string;
  conversion?: string;
}

interface DesignSuggestion {
  category: string;
  suggestions: string[];
}

interface OptimizationResult {
  suggestedKeywords: KeywordData[];
  optimizedContent: string;
  recommendations: string[];
  designSuggestions?: DesignSuggestion[];
  headlines?: string[];
}

interface ContentSection {
  headline: string;
  content: string;
  notes?: string;
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
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");
  const [optimizationProgress, setOptimizationProgress] = useState<number>(0);
  const [optimizationStage, setOptimizationStage] = useState<string>("Preparing analysis...");
  const [recommendedLayoutStyle, setRecommendedLayoutStyle] = useState<string>("Standard Hero Layout");
  const [colorScheme, setColorScheme] = useState<{name: string, colors: string[]}>({
    name: "Professional Blue",
    colors: ["#1a73e8", "#34a853", "#fbbc05", "#ea4335", "#ffffff"]
  });

  const generateOptimizations = async () => {
    try {
      onUpdateGeneratingState(true);
      setOptimizationProgress(10);
      setOptimizationStage("Analyzing keywords...");
      
      // Process keywords into an array
      const keywordsArray = keywordSuggestions || [];

      // First stage - start simulated progress updates
      const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 5) + 1;
          
          if (newProgress < 25) {
            setOptimizationStage("Analyzing keywords...");
          } else if (newProgress < 50) {
            setOptimizationStage("Generating content recommendations...");
          } else if (newProgress < 75) {
            setOptimizationStage("Optimizing page structure...");
          } else if (newProgress < 95) {
            setOptimizationStage("Finalizing optimizations...");
          }
          
          return Math.min(newProgress, 95);
        });
      }, 800);
      
      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: { 
          prompt: `
            Generate comprehensive AI optimizations for this landing page:
            
            Title: ${formValues.title}
            Target Audience: ${formValues.audience}
            Industry: ${formValues.industry}
            Campaign Type: ${formValues.campaign_type}
            
            Current Keywords: ${keywordsArray.join(', ')}
            
            Please analyze these keywords and provide:
            
            1. Traffic potential for each keyword (include search volume estimates)
            2. Keyword difficulty scores
            3. Click-through rate estimates
            4. Conversion potential ranking
            
            Also provide:
            - 5 optimized headline suggestions that incorporate top keywords
            - Content structure recommendations with 3-5 section suggestions
            - Layout and design recommendations for maximum conversion
            - Color scheme suggestions appropriate for this industry
            
            Additionally, provide 5-7 new keyword suggestions that could improve traffic.
          `,
          mode: "ai_optimize",
          keywords: keywordsArray,
          depth: "deep"
        }
      });

      // Clear the progress interval
      clearInterval(progressInterval);

      if (error) {
        throw new Error(`Error invoking function: ${error.message}`);
      }

      // Process the AI response
      if (data?.result) {
        setOptimizationResult(data.result);
        
        // Extract headlines if they exist
        if (data.result.optimizedContent && typeof data.result.optimizedContent === 'string') {
          const headlineMatches = data.result.optimizedContent.match(/headline[s]?:?\s*([\s\S]*?)(?:\n\n|$)/i);
          if (headlineMatches && headlineMatches[1]) {
            const headlines = headlineMatches[1]
              .split(/\n/)
              .map(line => line.replace(/^[-*•]|\d+\.\s*/, '').trim())
              .filter(line => line.length > 0);
            
            data.result.headlines = headlines;
          }
          
          // Generate content sections
          generateContentSections(data.result);
        }
        
        // Set a recommended layout style based on content
        if (data.result.designSuggestions) {
          const layoutSuggestions = data.result.designSuggestions.find(s => 
            s.category.toLowerCase().includes('layout'));
          
          if (layoutSuggestions && layoutSuggestions.suggestions.length > 0) {
            setRecommendedLayoutStyle(layoutSuggestions.suggestions[0]);
          }
          
          // Extract color scheme if possible
          const colorSuggestions = data.result.designSuggestions.find(s => 
            s.category.toLowerCase().includes('color'));
            
          if (colorSuggestions && colorSuggestions.suggestions.length > 0) {
            // Try to detect color names
            const colorNames = ['blue', 'green', 'red', 'orange', 'purple', 'teal', 'gray', 'black'];
            const colorMentioned = colorNames.find(color => 
              colorSuggestions.suggestions[0].toLowerCase().includes(color));
            
            if (colorMentioned) {
              let colorArray: string[] = [];
              switch(colorMentioned) {
                case 'blue':
                  colorArray = ["#1a73e8", "#4285f4", "#8ab4f8", "#c6dafc", "#ffffff"];
                  setColorScheme({name: "Professional Blue", colors: colorArray});
                  break;
                case 'green':
                  colorArray = ["#0f9d58", "#34a853", "#81c995", "#ceead6", "#ffffff"];
                  setColorScheme({name: "Growth Green", colors: colorArray});
                  break;
                case 'red':
                  colorArray = ["#ea4335", "#f06292", "#f8bbd0", "#fce4ec", "#ffffff"];
                  setColorScheme({name: "Conversion Red", colors: colorArray});
                  break;
                case 'purple':
                  colorArray = ["#673ab7", "#9c27b0", "#ba68c8", "#e1bee7", "#ffffff"];
                  setColorScheme({name: "Creative Purple", colors: colorArray});
                  break;
                default:
                  // Default professional color scheme
                  colorArray = ["#1a73e8", "#34a853", "#fbbc05", "#ea4335", "#ffffff"];
                  setColorScheme({name: "Professional Blue", colors: colorArray});
              }
            }
          }
        }
        
        setOptimizationProgress(100);
        setOptimizationStage("Optimization complete!");
        toast.success("Generated AI keyword and content optimization suggestions");
      } else {
        throw new Error("No optimization data received");
      }
    } catch (error: any) {
      console.error("Error generating optimization data:", error);
      toast.error(`Failed to generate optimizations: ${error.message}`);
      setOptimizationProgress(0);
      
      // Generate fallback data for demonstration purposes
      generateFallbackData();
    } finally {
      onUpdateGeneratingState(false);
    }
  };
  
  // Generate fallback demonstration data if the API call fails
  const generateFallbackData = () => {
    const fallbackKeywords: KeywordData[] = keywordSuggestions.map((keyword) => ({
      keyword,
      traffic: Math.floor(Math.random() * 10000) + "/month",
      difficulty: Math.floor(Math.random() * 100) + "%",
      relevance: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
      ctr: Math.floor(Math.random() * 30 + 5) + "%",
      conversion: ["high", "medium", "low"][Math.floor(Math.random() * 3)]
    }));
    
    // Add some additional keyword suggestions
    ["optimization", "conversion rate", "landing page design", "conversion strategy", "website traffic"].forEach(keyword => {
      fallbackKeywords.push({
        keyword,
        traffic: Math.floor(Math.random() * 10000) + "/month",
        difficulty: Math.floor(Math.random() * 100) + "%",
        relevance: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
        ctr: Math.floor(Math.random() * 30 + 5) + "%",
        conversion: ["high", "medium", "low"][Math.floor(Math.random() * 3)]
      });
    });
    
    const fallbackResult: OptimizationResult = {
      suggestedKeywords: fallbackKeywords,
      optimizedContent: "This is fallback content for demonstration purposes. In a real implementation, this would contain AI-generated content optimized for the selected keywords.",
      recommendations: [
        "Incorporate primary keywords into your headline for better SEO ranking and relevance",
        "Use action verbs in your calls-to-action to encourage user engagement",
        "Add social proof elements like testimonials or client logos to build trust",
        "Optimize page load speed by compressing images and minimizing scripts",
        "Implement A/B testing for key conversion elements to identify highest performers"
      ],
      headlines: [
        `Boost Your ${formValues.industry} Results: The Ultimate ${formValues.campaign_type} Guide`,
        `${formValues.campaign_type} Strategies That Drive Real ${formValues.industry} Growth`,
        `How ${formValues.audience} Are Transforming ${formValues.industry} Through ${formValues.campaign_type}`,
        `Unlock ${formValues.industry} Success: Proven ${formValues.campaign_type} Techniques`,
        `${formValues.campaign_type} Mastery: Elevate Your ${formValues.industry} Performance Today`
      ],
      designSuggestions: [
        {
          category: "Color Scheme",
          suggestions: [
            "Use a professional blue color scheme to establish trust and reliability",
            "Add accent colors in orange or green for call-to-action elements"
          ]
        },
        {
          category: "Layout",
          suggestions: [
            "Implement a Z-pattern layout to guide users through key information to conversion points",
            "Ensure critical conversion elements appear above the fold"
          ]
        },
        {
          category: "Typography",
          suggestions: [
            "Use sans-serif fonts for headings and body text to improve readability",
            "Create clear visual hierarchy with font sizes and weights"
          ]
        },
        {
          category: "Call-to-Action",
          suggestions: [
            "Use high-contrast buttons with action-oriented text",
            "Position primary CTA buttons in the right column of content for higher conversion"
          ]
        },
        {
          category: "Visual Elements",
          suggestions: [
            "Include relevant imagery showing the product/service in action",
            "Use icons to break up text and illustrate key benefits"
          ]
        }
      ]
    };
    
    setOptimizationResult(fallbackResult);
    generateContentSections(fallbackResult);
    setOptimizationProgress(100);
    setOptimizationStage("Optimization complete! (demo data)");
  };
  
  // Generate structured content sections from the optimization result
  const generateContentSections = (result: OptimizationResult) => {
    // Default sections if we can't extract them
    const defaultSections = [
      {
        headline: "Hero Section - Main Value Proposition",
        content: `${formValues.title} - The leading solution for ${formValues.audience} in the ${formValues.industry} industry. Our ${formValues.campaign_type} approach delivers proven results.`,
        notes: "Include a strong call-to-action button and social proof elements"
      },
      {
        headline: "Key Benefits",
        content: `• Benefit 1: Tailored specifically for ${formValues.audience}\n• Benefit 2: Improved outcomes in ${formValues.industry}\n• Benefit 3: Optimized for ${formValues.campaign_type}`,
        notes: "Use icons to visually represent each benefit"
      },
      {
        headline: "Social Proof",
        content: "Customer testimonials and case studies demonstrating success stories and results.",
        notes: "Include metrics and specific results when possible"
      },
      {
        headline: "Features and Capabilities",
        content: "Detailed explanation of key features with supporting visuals.",
        notes: "Focus on features that solve specific pain points"
      },
      {
        headline: "Call-to-Action",
        content: `Start optimizing your ${formValues.industry} performance today with our ${formValues.campaign_type} solution.`,
        notes: "Use action-oriented language and create urgency"
      }
    ];
    
    // Try to extract content sections from recommendations or optimized content
    const extractedSections: ContentSection[] = [];
    
    if (result.recommendations && result.recommendations.length > 0) {
      // Look for section-specific recommendations
      const sectionKeywords = ["hero", "headline", "benefit", "feature", "testimonial", "social proof", "cta", "call to action"];
      
      sectionKeywords.forEach(keyword => {
        const matchingRecs = result.recommendations.filter(rec => 
          rec.toLowerCase().includes(keyword.toLowerCase()));
          
        if (matchingRecs.length > 0) {
          extractedSections.push({
            headline: keyword.charAt(0).toUpperCase() + keyword.slice(1) + " Section",
            content: matchingRecs[0],
            notes: matchingRecs.length > 1 ? matchingRecs[1] : undefined
          });
        }
      });
    }
    
    // If we have headlines, create sections with them
    if (result.headlines && result.headlines.length > 0) {
      // Add a hero section with the first headline
      extractedSections.push({
        headline: "Hero Section",
        content: result.headlines[0],
        notes: "Primary headline for maximum impact and conversion"
      });
      
      // Add content sections with other headlines
      result.headlines.slice(1).forEach((headline, index) => {
        extractedSections.push({
          headline: `Content Section ${index + 1}`,
          content: headline,
          notes: `Supporting content for the "${headline}" section`
        });
      });
    }
    
    // Set either extracted or default sections
    setContentSections(extractedSections.length > 0 ? extractedSections : defaultSections);
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
  
  const handleSelectKeyword = (keyword: string) => {
    setSelectedKeyword(selectedKeyword === keyword ? null : keyword);
  };

  const calculateTrafficScore = (keywords: KeywordData[]) => {
    if (!keywords || keywords.length === 0) return 0;
    
    const total = keywords.reduce((sum, keyword) => {
      const trafficValue = parseInt(
        keyword.traffic.replace(/\D/g, '').substring(0, 2)
      ) || 0;
      return sum + trafficValue;
    }, 0);
    
    return Math.min(100, Math.round(total / keywords.length));
  };
  
  const calculateConversionScore = (keywords: KeywordData[]) => {
    if (!keywords || keywords.length === 0) return 0;
    
    const conversionMap = { "high": 100, "medium": 50, "low": 25 };
    
    const total = keywords.reduce((sum, keyword) => {
      return sum + (conversionMap[keyword.conversion as keyof typeof conversionMap] || 50);
    }, 0);
    
    return Math.min(100, Math.round(total / keywords.length));
  };
  
  const getKeywordBadgeVariant = (value: string, isLowerBetter: boolean = false) => {
    // For percentage values
    if (value.includes('%')) {
      const numValue = parseInt(value.replace('%', ''));
      if (isLowerBetter) {
        // For difficulty, lower is better
        return numValue < 30 ? "default" : numValue < 60 ? "outline" : "secondary";
      } else {
        // For traffic, CTR, higher is better
        return numValue > 70 ? "default" : numValue > 40 ? "outline" : "secondary";
      }
    } 
    // For traffic values with /month
    else if (value.includes('/month')) {
      const numValue = parseInt(value.replace(/\D/g, ''));
      return numValue > 5000 ? "default" : numValue > 1000 ? "outline" : "secondary";
    }
    // For text values
    else if (["high", "medium", "low"].includes(value.toLowerCase())) {
      return value.toLowerCase() === "high" ? "default" : 
             value.toLowerCase() === "medium" ? "outline" : "secondary";
    }
    
    // Default
    return "outline";
  };
  
  // Filter keywords based on search input
  const filteredKeywords = optimizationResult?.suggestedKeywords.filter(keyword => 
    keyword.keyword.toLowerCase().includes(filterValue.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold tracking-tight">AI Content Optimization</h3>
      
      {/* Step 1: Keywords Analysis */}
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
          {isGenerating ? (
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">{optimizationStage}</h3>
                  <Progress value={optimizationProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{optimizationProgress}% complete</p>
                </div>
                <div className="grid grid-cols-3 gap-3 py-6">
                  {Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="flex items-center justify-center h-24 bg-muted/40 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-0">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="keywords">Keyword Analysis</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                </TabsList>
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
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Conversion Potential</div>
                        <div className="text-lg font-bold text-primary">
                          {calculateConversionScore(optimizationResult.suggestedKeywords)}%
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Filter keywords..."
                          className="pl-9"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                        />
                      </div>
                      
                      <ScrollArea className="h-[240px] rounded-md border">
                        <div className="p-4">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2">Keyword</th>
                                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2">Traffic</th>
                                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2">Difficulty</th>
                                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2">CTR</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredKeywords.map((keyword, idx) => (
                                <tr 
                                  key={idx} 
                                  className={`hover:bg-muted/30 cursor-pointer ${selectedKeyword === keyword.keyword ? 'bg-muted/40' : ''}`}
                                  onClick={() => handleSelectKeyword(keyword.keyword)}
                                >
                                  <td className="py-2 pr-4">
                                    <div className="flex items-center">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span>{keyword.conversion === 'high' ? 
                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" /> : 
                                            keyword.conversion === 'low' ?
                                            <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-amber-500" /> :
                                            <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-blue-500" />}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Conversion Potential: {keyword.conversion}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      {keyword.keyword}
                                    </div>
                                  </td>
                                  <td className="py-2 text-sm text-right">
                                    <Badge variant={getKeywordBadgeVariant(keyword.traffic)}>
                                      {keyword.traffic}
                                    </Badge>
                                  </td>
                                  <td className="py-2 text-sm text-right">
                                    <Badge variant={getKeywordBadgeVariant(keyword.difficulty, true)}>
                                      {keyword.difficulty}
                                    </Badge>
                                  </td>
                                  <td className="py-2 text-sm text-right">
                                    <Badge variant="outline">
                                      {keyword.ctr || "15%"}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="content" className="mt-0">
                  {!optimizationResult ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Click "Optimize with AI" to generate content recommendations
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Optimized Headlines</h4>
                        <div className="space-y-2">
                          {(optimizationResult.headlines || []).map((headline, idx) => (
                            <div key={idx} className="p-2 border rounded-md hover:bg-muted/20">
                              <p className="text-sm font-medium">{headline}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Suggested Content Structure</h4>
                        <Accordion type="single" collapsible className="w-full">
                          {contentSections.map((section, idx) => (
                            <AccordionItem key={idx} value={`section-${idx}`}>
                              <AccordionTrigger className="text-sm">{section.headline}</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2 p-2 rounded-md bg-muted/20">
                                  <p className="text-sm whitespace-pre-line">{section.content}</p>
                                  {section.notes && (
                                    <p className="text-xs text-muted-foreground italic mt-2">{section.notes}</p>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Optimization Recommendations</h4>
                        <div className="space-y-3">
                          {optimizationResult.recommendations.map((recommendation, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                              <p className="text-sm">{recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="design" className="mt-0">
                  {!optimizationResult ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Click "Optimize with AI" to generate design recommendations
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center">
                          <Palette className="h-4 w-4 mr-2 text-primary" />
                          Recommended Color Scheme: {colorScheme.name}
                        </h4>
                        <div className="flex gap-2">
                          {colorScheme.colors.map((color, idx) => (
                            <div 
                              key={idx}
                              className="w-10 h-10 rounded-md border shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center">
                          <LayoutTemplate className="h-4 w-4 mr-2 text-primary" />
                          Recommended Layout: {recommendedLayoutStyle}
                        </h4>
                        <div className="border rounded-md p-3 bg-muted/10">
                          <div className="aspect-video bg-muted/30 rounded flex items-center justify-center text-center text-xs p-2">
                            Visual representation of the recommended layout would appear here
                          </div>
                        </div>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                        {(optimizationResult.designSuggestions || []).map((section, idx) => {
                          let icon;
                          switch(section.category.toLowerCase()) {
                            case "color scheme":
                              icon = <Palette className="h-4 w-4 mr-2 text-primary" />;
                              break;
                            case "layout":
                              icon = <LayoutTemplate className="h-4 w-4 mr-2 text-primary" />;
                              break;
                            case "typography":
                              icon = <Type className="h-4 w-4 mr-2 text-primary" />;
                              break;
                            case "call-to-action":
                              icon = <MousePointerClick className="h-4 w-4 mr-2 text-primary" />;
                              break;
                            case "visual elements":
                              icon = <Image className="h-4 w-4 mr-2 text-primary" />;
                              break;
                            default:
                              icon = <Sparkles className="h-4 w-4 mr-2 text-primary" />;
                          }
                          
                          return (
                            <AccordionItem key={idx} value={`design-${idx}`}>
                              <AccordionTrigger className="text-sm">
                                <span className="flex items-center">
                                  {icon}
                                  {section.category}
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {section.suggestions.map((suggestion, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                                      <p className="text-sm">{suggestion}</p>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          )}
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
