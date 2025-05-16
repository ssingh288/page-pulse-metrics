import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Sparkles, RefreshCw, LineChart, LayoutGrid, X, TrendingUp, Search, CheckCircle, ChevronRight, Paintbrush, FileText, Edit } from "lucide-react";
import OptimizationPanel from "./OptimizationPanel";
import AdPreviewPanel from "./AdPreviewPanel";
import { 
  PageOptimizationSuggestion, 
  AdSuggestion,
  ContentSynthesis,
  DesignOption,
  DesignOptions,
  generatePageOptimizations,
  generateAdSuggestions,
  generateDesignOptions,
  synthesizeContentSuggestions,
  applyOptimizationsToHTML,
  applySynthesizedContentToHTML,
  applyDesignToHTML
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

interface OptimizationSuggestion {
  id: number;
  title: string;
  description: string;
  trafficPotential: number;
  keywords: string[];
  changes: {
    content: string[];
    design: string[];
  };
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
  
  // Concise suggestions
  const [conciseSuggestions, setConciseSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [selectedConciseSuggestionIndex, setSelectedConciseSuggestionIndex] = useState<number>(0);
  
  // Content synthesis
  const [synthesizedContent, setSynthesizedContent] = useState<ContentSynthesis | null>(null);
  const [isSynthesizingContent, setIsSynthesizingContent] = useState(false);
  
  // Design options
  const [designOptions, setDesignOptions] = useState<DesignOptions | null>(null);
  const [selectedDesignIndex, setSelectedDesignIndex] = useState<number>(0);
  const [isGeneratingDesigns, setIsGeneratingDesigns] = useState(false);
  
  // Preview state
  const [previewHtml, setPreviewHtml] = useState<string>(htmlContent);
  
  // Automatically generate optimizations when component mounts
  useEffect(() => {
    // Only auto-generate if we don't already have optimizations
    if (!optimizationSuggestions && !isLoadingOptimizations) {
      handleGenerateOptimizations();
    }
    // Initialize preview HTML
    setPreviewHtml(htmlContent);
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
      
      // Generate concise suggestions based on the optimization results
      const newConciseSuggestions: OptimizationSuggestion[] = [
        {
          id: 1,
          title: "High Traffic Optimization",
          description: "Maximize search visibility with high-volume keywords and SEO-optimized content structure",
          trafficPotential: 85,
          keywords: allSuggestions[0].keywords?.slice(0, 5).map(k => k.keyword) || [],
          changes: {
            content: ["Optimized headline structure", "SEO-focused content blocks", "Conversion-oriented CTA placement"],
            design: ["High contrast CTA buttons", "Social proof elements", "Streamlined navigation"]
          }
        },
        {
          id: 2,
          title: "Conversion Focused",
          description: "Boost conversion rates with persuasive copy and strategic call-to-action placement",
          trafficPotential: 72,
          keywords: allSuggestions[1].keywords?.slice(0, 5).map(k => k.keyword) || [],
          changes: {
            content: ["Benefit-driven headlines", "Problem-solution structure", "Testimonial integration"],
            design: ["Simplified form fields", "Trust indicators", "Directional cues to CTA"]
          }
        },
        {
          id: 3,
          title: "Brand Authority",
          description: "Build credibility and thought leadership with industry-specific content strategy",
          trafficPotential: 68,
          keywords: allSuggestions[2].keywords?.slice(0, 5).map(k => k.keyword) || [],
          changes: {
            content: ["Educational content blocks", "Expert quote integration", "Industry statistics"],
            design: ["Professional color palette", "Data visualization elements", "Featured case studies"]
          }
        }
      ];
      
      setConciseSuggestions(newConciseSuggestions);
      
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
        
        // Create fallback concise suggestions
        setConciseSuggestions([
          {
            id: 1,
            title: "Basic SEO Optimization",
            description: "Improve search visibility with keyword optimization",
            trafficPotential: 65,
            keywords: suggestion.keywords?.slice(0, 5).map(k => k.keyword) || [],
            changes: {
              content: ["SEO-optimized headlines", "Keyword-rich content", "Meta description updates"],
              design: ["Improved readability", "Mobile responsiveness", "Faster loading"]
            }
          }
        ]);
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
  
  const handleSynthesizeContent = async () => {
    try {
      setIsSynthesizingContent(true);
      
      // Only proceed if we have optimization suggestions
      if (!allOptimizationSuggestions || allOptimizationSuggestions.length === 0) {
        throw new Error("No optimization suggestions to synthesize");
      }
      
      // Synthesize content from all suggestions
      const synthesis = await synthesizeContentSuggestions(htmlContent, allOptimizationSuggestions, pageInfo);
      setSynthesizedContent(synthesis);
      
      // Update the preview HTML with synthesized content
      const updatedHtml = applySynthesizedContentToHTML(htmlContent, synthesis);
      setPreviewHtml(updatedHtml);
      
      toast.success("Created optimized content synthesis!");
    } catch (error) {
      console.error("Error synthesizing content:", error);
      toast.error("Failed to synthesize content");
    } finally {
      setIsSynthesizingContent(false);
    }
  };
  
  const handleGenerateDesignOptions = async () => {
    try {
      setIsGeneratingDesigns(true);
      
      // Generate design options
      const designs = await generateDesignOptions(htmlContent, pageInfo);
      setDesignOptions(designs);
      setSelectedDesignIndex(0);
      
      // Update preview HTML with first design option
      if (designs.options && designs.options.length > 0) {
        const updatedHtml = applyDesignToHTML(htmlContent, designs.options[0]);
        setPreviewHtml(updatedHtml);
      }
      
      toast.success("Generated design options!");
    } catch (error) {
      console.error("Error generating design options:", error);
      toast.error("Failed to generate design options");
    } finally {
      setIsGeneratingDesigns(false);
    }
  };
  
  const handleSelectDesign = (index: number) => {
    setSelectedDesignIndex(index);
    
    // Update preview HTML with selected design
    if (designOptions && designOptions.options && designOptions.options[index]) {
      const updatedHtml = applyDesignToHTML(htmlContent, designOptions.options[index]);
      setPreviewHtml(updatedHtml);
    }
  };
  
  const handleApplySuggestion = (updatedHtml: string) => {
    onApplyChanges(updatedHtml);
    toast.success("Applied changes to landing page!");
  };
  
  const handleApplySynthesizedContent = () => {
    if (!synthesizedContent) return;
    
    const updatedHtml = applySynthesizedContentToHTML(htmlContent, synthesizedContent);
    onApplyChanges(updatedHtml);
    toast.success("Applied synthesized content to landing page!");
  };
  
  const handleApplyDesign = () => {
    if (!designOptions || !designOptions.options || !designOptions.options[selectedDesignIndex]) return;
    
    const updatedHtml = applyDesignToHTML(htmlContent, designOptions.options[selectedDesignIndex]);
    onApplyChanges(updatedHtml);
    toast.success(`Applied "${designOptions.options[selectedDesignIndex].name}" design to landing page!`);
  };
  
  const handleSelectSuggestion = (index: number) => {
    setSelectedSuggestionIndex(index);
    setOptimizationSuggestions(allOptimizationSuggestions[index]);
    setSelectedConciseSuggestionIndex(index);
    
    // Update preview HTML with selected suggestion
    if (allOptimizationSuggestions && allOptimizationSuggestions[index]) {
      const updatedHtml = applyOptimizationsToHTML(htmlContent, allOptimizationSuggestions[index]);
      setPreviewHtml(updatedHtml);
    }
  };
  
  const handleSelectFromHistory = (index: number) => {
    setCurrentSuggestionIndex(index);
    setOptimizationSuggestions(suggestionHistory[index]);
  };
  
  const handleSelectAdFromHistory = (index: number) => {
    setAdSuggestions(adSuggestionHistory[index]);
  };
  
  // Function to open preview in a new tab
  const openPreviewInNewTab = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(previewHtml);
      previewWindow.document.title = 'Optimized Preview';
      previewWindow.document.close();
    }
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-4">
            <TabsList>
              <TabsTrigger value="page-optimization" className="flex items-center gap-1">
                <FileText className="h-4 w-4" /> Content
              </TabsTrigger>
              <TabsTrigger value="design-options" className="flex items-center gap-1">
                <Paintbrush className="h-4 w-4" /> Design
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => onApplyChanges(previewHtml)}>Apply Changes</Button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Suggestions and Controls */}
        <div className="w-full md:w-1/3 flex flex-col h-full overflow-y-auto p-6 gap-6">
          <TabsContent value="page-optimization" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Content Optimization</h2>
              <Button
                variant="outline"
                onClick={handleGenerateOptimizations}
                disabled={isLoadingOptimizations}
                size="sm"
              >
                {isLoadingOptimizations ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerate
              </Button>
            </div>
            
            {/* Generate synthesis button */}
            <Button
              variant="default"
              onClick={handleSynthesizeContent}
              disabled={isSynthesizingContent || allOptimizationSuggestions.length === 0}
              className="w-full"
            >
              {isSynthesizingContent ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Synthesizing Best Content...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Synthesize Best Content from All Options
                </>
              )}
            </Button>
            
            {/* Display synthesized content */}
            {synthesizedContent && (
              <Card className="border border-primary/30 shadow-md">
                <CardHeader className="bg-primary/5 pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>AI-Synthesized Content</span>
                    <Badge variant="default">
                      {synthesizedContent.conversionEstimate.improvement} Improvement
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Optimally combined content from all suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-3">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Conversion Estimate</h3>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Before: {synthesizedContent.conversionEstimate.before}</span>
                        <span>After: {synthesizedContent.conversionEstimate.after}</span>
                      </div>
                      <Progress value={parseFloat(synthesizedContent.conversionEstimate.after)} className="h-1.5" />
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Key Improvements</h3>
                      <ul className="text-xs space-y-1">
                        {synthesizedContent.keyImprovements.map((improvement, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-3 w-3 mr-1 text-primary flex-shrink-0 mt-0.5" />
                            <span><strong>{improvement.area}:</strong> {improvement.benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Updated Keywords</h3>
                      <div className="flex flex-wrap gap-1">
                        {synthesizedContent.updatedKeywords.slice(0, 5).map((keyword, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {synthesizedContent.updatedKeywords.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{synthesizedContent.updatedKeywords.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">SEO Score</h3>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Before: {synthesizedContent.seoScore.before}</span>
                        <span>After: {synthesizedContent.seoScore.after}</span>
                      </div>
                      <Progress value={parseFloat(synthesizedContent.seoScore.after)} max={100} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={handleApplySynthesizedContent}
                    className="w-full"
                  >
                    Apply Synthesized Content
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Display individual optimization options */}
            {!synthesizedContent && conciseSuggestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-medium">Available Content Options</h3>
                {conciseSuggestions.map((suggestion, idx) => (
                  <Card 
                    key={idx} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedConciseSuggestionIndex === idx ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelectSuggestion(idx)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{suggestion.title}</CardTitle>
                        <Badge variant="default" className="text-xs">
                          {suggestion.trafficPotential}% Traffic
                        </Badge>
                      </div>
                      <CardDescription>{suggestion.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Top Keywords</p>
                          <div className="flex flex-wrap gap-1">
                            {suggestion.keywords.slice(0, 4).map((keyword, kidx) => (
                              <Badge key={kidx} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="font-medium text-xs mb-1">Content Changes</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {suggestion.changes.content.slice(0, 3).map((change, cidx) => (
                                <li key={cidx} className="flex items-start">
                                  <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
                                  <span>{change}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button 
                        variant={selectedConciseSuggestionIndex === idx ? "default" : "outline"} 
                        size="sm" 
                        className="w-full"
                      >
                        {selectedConciseSuggestionIndex === idx ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" /> Selected
                          </>
                        ) : "Preview This Option"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="design-options" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Design Options</h2>
              <Button
                variant="outline"
                onClick={handleGenerateDesignOptions}
                disabled={isGeneratingDesigns}
                size="sm"
              >
                {isGeneratingDesigns ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            </div>
            
            {/* Generate design options button (if none exist yet) */}
            {!designOptions && !isGeneratingDesigns && (
              <Button
                variant="default"
                onClick={handleGenerateDesignOptions}
                className="w-full"
              >
                <Paintbrush className="h-4 w-4 mr-2" />
                Generate Design Options
              </Button>
            )}
            
            {/* Loading state */}
            {isGeneratingDesigns && (
              <div className="text-center py-12">
                <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Generating design options...</p>
                <p className="text-xs text-muted-foreground mt-2">AI is creating multiple design variations optimized for your target audience</p>
              </div>
            )}
            
            {/* Display design options */}
            {designOptions && designOptions.options && (
              <div className="space-y-4">
                <h3 className="text-base font-medium">Available Design Options</h3>
                {designOptions.options.map((design, idx) => (
                  <Card 
                    key={idx} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedDesignIndex === idx ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelectDesign(idx)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{design.name}</CardTitle>
                      <CardDescription>{design.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Color Palette</p>
                          <div className="flex space-x-1 my-2">
                            {design.colorScheme.map((color, i) => (
                              <div 
                                key={i}
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="font-medium text-xs mb-1">Typography</p>
                            <div className="text-xs text-muted-foreground">
                              <div>Headings: <span className="font-medium">{design.fontPairings.heading}</span></div>
                              <div>Body: <span className="font-medium">{design.fontPairings.body}</span></div>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-xs mb-1">CTA Style</p>
                            <div className="text-xs text-muted-foreground">
                              <div>{design.cta.style}</div>
                              <div>Position: {design.cta.position}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium text-xs mb-1">Conversion Focus</p>
                          <div className="text-xs text-muted-foreground">
                            {design.conversionFocus}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button 
                        variant={selectedDesignIndex === idx ? "default" : "outline"} 
                        size="sm" 
                        className="w-full"
                      >
                        {selectedDesignIndex === idx ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" /> Selected
                          </>
                        ) : "Preview This Design"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                <Button 
                  onClick={handleApplyDesign}
                  className="w-full mt-4"
                  disabled={!designOptions || designOptions.options.length === 0}
                >
                  Apply Selected Design
                </Button>
              </div>
            )}
          </TabsContent>
        </div>
        
        {/* Right: Live Mobile Preview */}
        <div className="hidden md:flex w-2/3 h-full bg-muted/10 p-8 items-center justify-center overflow-y-auto">
          <div className="w-[375px] h-[700px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
            <div className="font-semibold text-center py-2 bg-muted/20 border-b flex justify-between items-center px-4">
              <div>Mobile Preview</div>
              <div 
                className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer hover:text-primary"
                onClick={openPreviewInNewTab}
              >
                Live Preview
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
            <iframe
              title="Landing Page Preview"
              srcDoc={previewHtml}
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
