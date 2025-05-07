
import React from "react";
import { Button } from "@/components/ui/button";
import { PageOptimizationSuggestion, applyOptimizationsToHTML } from "@/utils/aiService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, Circle, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface OptimizationPanelProps {
  optimizationSuggestions: PageOptimizationSuggestion | null;
  isLoading: boolean;
  originalHtml: string;
  onApplySuggestion: (updatedHtml: string) => void;
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({
  optimizationSuggestions,
  isLoading,
  originalHtml,
  onApplySuggestion
}) => {
  
  const handleApplySuggestion = (type: 'headline' | 'cta' | 'content', index?: number) => {
    if (!optimizationSuggestions) return;
    
    // Create a partial suggestion object with only the selected change
    const partialSuggestions: PageOptimizationSuggestion = {};
    
    if (type === 'headline' && optimizationSuggestions.headline) {
      partialSuggestions.headline = optimizationSuggestions.headline;
    } else if (type === 'cta' && optimizationSuggestions.cta) {
      partialSuggestions.cta = optimizationSuggestions.cta;
    } else if (type === 'content' && optimizationSuggestions.content && index !== undefined) {
      partialSuggestions.content = [optimizationSuggestions.content[index]];
    }
    
    // Apply just this specific change to the HTML
    const updatedHtml = applyOptimizationsToHTML(originalHtml, partialSuggestions);
    onApplySuggestion(updatedHtml);
  };
  
  const handleApplyAll = () => {
    if (!optimizationSuggestions) return;
    
    const updatedHtml = applyOptimizationsToHTML(originalHtml, optimizationSuggestions);
    onApplySuggestion(updatedHtml);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Page Optimization</CardTitle>
          <CardDescription>Analyzing landing page...</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4" />
            <p className="text-sm text-muted-foreground">Generating AI-powered optimization suggestions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!optimizationSuggestions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Page Optimization</CardTitle>
          <CardDescription>No optimization data yet</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Click "Generate Optimization Suggestions" to analyze your landing page
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          Page Optimization Suggestions
        </CardTitle>
        <CardDescription>
          Apply suggested changes to improve conversion rates and performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Traffic Estimate */}
        {optimizationSuggestions.trafficEstimate && (
          <Card>
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-sm flex items-center">
                <TrendingUp className="h-4 w-4 text-primary mr-2" />
                Traffic Conversion Potential
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="flex items-center mb-2">
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current: {optimizationSuggestions.trafficEstimate.current}</span>
                    <span>Potential: {optimizationSuggestions.trafficEstimate.potential}</span>
                  </div>
                  <Progress 
                    value={parseFloat(optimizationSuggestions.trafficEstimate.potential.replace('%', ''))} 
                    max={100}
                    className="h-2"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <Badge variant="outline" className="text-xs">
                  Confidence: {optimizationSuggestions.trafficEstimate.confidence}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Accordion type="single" collapsible className="w-full">
          {/* Headline Optimization */}
          {optimizationSuggestions.headline && (
            <AccordionItem value="headline">
              <AccordionTrigger className="text-base font-medium">
                Headline Optimization
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-2">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Original: </span>
                    {optimizationSuggestions.headline.original}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Suggested: </span>
                    <span className="text-primary">{optimizationSuggestions.headline.suggested}</span>
                  </div>
                  <div className="text-sm bg-muted/30 p-2 rounded">
                    <span className="font-medium">Reason: </span>
                    {optimizationSuggestions.headline.reason}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={() => handleApplySuggestion('headline')}
                      className="mt-2"
                    >
                      Apply Change <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* CTA Optimization */}
          {optimizationSuggestions.cta && (
            <AccordionItem value="cta">
              <AccordionTrigger className="text-base font-medium">
                Call-to-Action Optimization
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-2">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Original: </span>
                    {optimizationSuggestions.cta.original}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Suggested: </span>
                    <span className="text-primary">{optimizationSuggestions.cta.suggested}</span>
                  </div>
                  <div className="text-sm bg-muted/30 p-2 rounded">
                    <span className="font-medium">Reason: </span>
                    {optimizationSuggestions.cta.reason}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={() => handleApplySuggestion('cta')}
                      className="mt-2"
                    >
                      Apply Change <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Content Optimizations */}
          {optimizationSuggestions.content && optimizationSuggestions.content.length > 0 && (
            <AccordionItem value="content">
              <AccordionTrigger className="text-base font-medium">
                Content Optimizations ({optimizationSuggestions.content.length})
              </AccordionTrigger>
              <AccordionContent>
                {optimizationSuggestions.content.map((content, index) => (
                  <div key={index} className="mb-6 border-l-2 border-primary/30 pl-4">
                    <p className="font-medium text-sm mb-2">{content.section}</p>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Original: </span>
                        {content.original}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Suggested: </span>
                        <span className="text-primary">{content.suggested}</span>
                      </div>
                      <div className="text-sm bg-muted/30 p-2 rounded">
                        <span className="font-medium">Reason: </span>
                        {content.reason}
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => handleApplySuggestion('content', index)}
                          className="mt-2"
                        >
                          Apply Change <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Structural Suggestions */}
          {optimizationSuggestions.structure && optimizationSuggestions.structure.length > 0 && (
            <AccordionItem value="structure">
              <AccordionTrigger className="text-base font-medium">
                Structural Improvements ({optimizationSuggestions.structure.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {optimizationSuggestions.structure.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 pl-2">
                      <Circle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{item.suggestion}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Keyword Recommendations */}
          {optimizationSuggestions.keywords && optimizationSuggestions.keywords.length > 0 && (
            <AccordionItem value="keywords">
              <AccordionTrigger className="text-base font-medium">
                Recommended Keywords ({optimizationSuggestions.keywords.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs text-muted-foreground border-b">
                        <tr>
                          <th className="py-2 px-3 text-left">Keyword</th>
                          <th className="py-2 px-3 text-left">Relevance</th>
                          <th className="py-2 px-3 text-left">Traffic Potential</th>
                          <th className="py-2 px-3 text-left">Difficulty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {optimizationSuggestions.keywords.map((keyword, index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="py-2 px-3 font-medium">{keyword.keyword}</td>
                            <td className="py-2 px-3">
                              <Badge variant={
                                keyword.relevance === "high" ? "default" :
                                keyword.relevance === "medium" ? "outline" : "secondary"
                              } className="rounded-sm">
                                {keyword.relevance}
                              </Badge>
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex items-center">
                                <Progress className="h-2 w-16 mr-2" 
                                  value={keyword.trafficPotential} 
                                  max={100} 
                                />
                                <span>{keyword.trafficPotential}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex items-center">
                                <Progress className="h-2 w-16 mr-2" 
                                  value={keyword.difficulty} 
                                  max={100} 
                                />
                                <span>{keyword.difficulty}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <CheckCircle className="mr-2 h-4 w-4" /> My Changes
        </Button>
        <Button onClick={handleApplyAll}>
          Apply All Suggestions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OptimizationPanel;
