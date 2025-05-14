import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageOptimizationSuggestion, applyOptimizationsToHTML } from "@/utils/aiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, ArrowUpRight, BarChart2, Lightbulb } from "lucide-react";

interface OptimizationPanelProps {
  optimizationSuggestions: PageOptimizationSuggestion | null;
  isLoading: boolean;
  originalHtml: string;
  onApplySuggestion: (updatedHtml: string) => void;
  suggestionHistory?: PageOptimizationSuggestion[];
  onSelectFromHistory?: (index: number) => void;
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({
  optimizationSuggestions,
  isLoading,
  originalHtml,
  onApplySuggestion,
  suggestionHistory = [],
  onSelectFromHistory
}) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [applied, setApplied] = useState<{ [key: string]: boolean }>({});
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </div>
    );
  }
  
  if (!optimizationSuggestions) return null;
  
  const applyChanges = () => {
    const updatedHtml = applyOptimizationsToHTML(originalHtml, optimizationSuggestions);
    onApplySuggestion(updatedHtml);
  };

  // Calculate total potential improvement
  const trafficEstimateImprovement = optimizationSuggestions.trafficEstimate ? 
    parseFloat(optimizationSuggestions.trafficEstimate.potential.replace('%', '')) - 
    parseFloat(optimizationSuggestions.trafficEstimate.current.replace('%', '')) : 
    0;
  
  const handleApply = (type: string) => {
    setApplied((prev) => ({ ...prev, [type]: true }));
    // Optionally, update the HTML preview or call onApplySuggestion for live preview
  };

  const handleUndo = (type: string) => {
    setApplied((prev) => ({ ...prev, [type]: false }));
    // Optionally, revert the HTML preview
  };

  // Simulate audience engagement calculation based on applied suggestions
  const baseEngagement = 40; // base percentage
  const engagementPerApplied = 8; // each applied suggestion increases engagement
  const appliedCount = Object.values(applied).filter(Boolean).length;
  const audienceEngagement = Math.min(baseEngagement + appliedCount * engagementPerApplied, 100);

  return (
    <div className="space-y-4">
      {suggestionHistory.length > 0 && onSelectFromHistory && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {suggestionHistory.map((_, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSelectFromHistory(index)}
              className="whitespace-nowrap"
            >
              Version {index + 1}
            </Button>
          ))}
        </div>
      )}
      
      <Card className="border-green-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-green-500" />
              Traffic Potential
            </CardTitle>
            <Badge variant={trafficEstimateImprovement > 5 ? "success" : "outline"}>
              +{trafficEstimateImprovement.toFixed(1)}% Potential Improvement
            </Badge>
          </div>
          <CardDescription>
            Estimated traffic increase and audience engagement based on these optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {optimizationSuggestions.trafficEstimate && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Current</div>
                <div className="text-2xl font-bold">{optimizationSuggestions.trafficEstimate.current}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Potential</div>
                <div className="text-2xl font-bold text-green-600">{optimizationSuggestions.trafficEstimate.potential}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Confidence</div>
                <div className="capitalize">{optimizationSuggestions.trafficEstimate.confidence}</div>
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-col items-center">
            <div className="text-sm font-medium text-muted-foreground mb-1">Audience Engagement</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${audienceEngagement}%` }}></div>
            </div>
            <div className="text-lg font-bold text-blue-600">{audienceEngagement}%</div>
          </div>
          <Button
            onClick={applyChanges}
            className="w-full mt-4"
          >
            Apply All Suggestions
          </Button>
        </CardContent>
      </Card>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="headline">Headlines</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          {/* Headline */}
          {optimizationSuggestions.headline && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Headline Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Original:</div>
                  <div className="p-2 border rounded bg-gray-50 text-sm">
                    {optimizationSuggestions.headline.original}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-3">Suggested:</div>
                  <div className="p-2 border border-green-200 rounded bg-green-50 text-sm">
                    {optimizationSuggestions.headline.suggested}
                  </div>
                  
                  <div className="text-sm mt-2 flex items-start">
                    <CircleCheck className="h-4 w-4 mr-1 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{optimizationSuggestions.headline.reason}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => handleApply('headline')}
                      size="sm"
                      disabled={applied['headline']}
                    >
                      {applied['headline'] ? 'Applied' : 'Apply Change'}
                    </Button>
                    {applied['headline'] && (
                      <Button
                        onClick={() => handleUndo('headline')}
                        size="sm"
                        variant="outline"
                      >
                        Undo
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* CTA */}
          {optimizationSuggestions.cta && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Call-to-Action Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Original:</div>
                  <div className="p-2 border rounded bg-gray-50 text-sm">
                    {optimizationSuggestions.cta.original}
                  </div>
                  <div className="text-sm text-muted-foreground mt-3">Suggested:</div>
                  <div className="p-2 border border-green-200 rounded bg-green-50 text-sm">
                    {optimizationSuggestions.cta.suggested}
                  </div>
                  <div className="text-sm mt-2 flex items-start">
                    <CircleCheck className="h-4 w-4 mr-1 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{optimizationSuggestions.cta.reason}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => handleApply('cta')}
                      size="sm"
                      disabled={applied['cta']}
                    >
                      {applied['cta'] ? 'Applied' : 'Apply Change'}
                    </Button>
                    {applied['cta'] && (
                      <Button
                        onClick={() => handleUndo('cta')}
                        size="sm"
                        variant="outline"
                      >
                        Undo
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Content Sections */}
          {optimizationSuggestions.content && optimizationSuggestions.content.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Content Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationSuggestions.content.map((content, index) => (
                    <div key={index} className="space-y-2 pb-3 border-b last:border-0">
                      <div className="font-medium">{content.section}</div>
                      <div className="text-sm text-muted-foreground">Original:</div>
                      <div className="p-2 border rounded bg-gray-50 text-sm">
                        {content.original}
                      </div>
                      <div className="text-sm text-muted-foreground mt-3">Suggested:</div>
                      <div className="p-2 border border-green-200 rounded bg-green-50 text-sm">
                        {content.suggested}
                      </div>
                      <div className="text-sm mt-2 flex items-start">
                        <CircleCheck className="h-4 w-4 mr-1 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{content.reason}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => handleApply(`content-${index}`)}
                          size="sm"
                          disabled={applied[`content-${index}`]}
                        >
                          {applied[`content-${index}`] ? 'Applied' : 'Apply Change'}
                        </Button>
                        {applied[`content-${index}`] && (
                          <Button
                            onClick={() => handleUndo(`content-${index}`)}
                            size="sm"
                            variant="outline"
                          >
                            Undo
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Keywords */}
          {optimizationSuggestions.keywords && optimizationSuggestions.keywords.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Keyword Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relevance</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {optimizationSuggestions.keywords.map((keyword, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 text-sm">{keyword.keyword}</td>
                            <td className="px-3 py-2">
                              <Badge variant={
                                keyword.relevance === 'high' ? 'success' :
                                keyword.relevance === 'medium' ? 'warning' : 'outline'
                              }>{keyword.relevance}</Badge>
                            </td>
                            <td className="px-3 py-2 text-sm">{keyword.trafficPotential}</td>
                            <td className="px-3 py-2 text-sm">{keyword.difficulty}/100</td>
                            <td className="px-3 py-2">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleApply(`keyword-${index}`)}
                                  size="sm"
                                  disabled={applied[`keyword-${index}`]}
                                >
                                  {applied[`keyword-${index}`] ? 'Applied' : 'Apply'}
                                </Button>
                                {applied[`keyword-${index}`] && (
                                  <Button
                                    onClick={() => handleUndo(`keyword-${index}`)}
                                    size="sm"
                                    variant="outline"
                                  >
                                    Undo
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Structure */}
          {optimizationSuggestions.structure && optimizationSuggestions.structure.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Structure Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {optimizationSuggestions.structure.map((structure, index) => (
                    <div key={index} className="flex items-start py-2 border-b last:border-0">
                      <ArrowUpRight className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">{structure.suggestion}</div>
                        <div className="text-sm text-muted-foreground">{structure.reason}</div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            onClick={() => handleApply(`structure-${index}`)}
                            size="sm"
                            disabled={applied[`structure-${index}`]}
                          >
                            {applied[`structure-${index}`] ? 'Applied' : 'Apply Change'}
                          </Button>
                          {applied[`structure-${index}`] && (
                            <Button
                              onClick={() => handleUndo(`structure-${index}`)}
                              size="sm"
                              variant="outline"
                            >
                              Undo
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="headline" className="space-y-4 mt-4">
          {optimizationSuggestions.headline ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Headline Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Original:</div>
                  <div className="p-2 border rounded bg-gray-50 text-sm">
                    {optimizationSuggestions.headline.original}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-3">Suggested:</div>
                  <div className="p-2 border border-green-200 rounded bg-green-50 text-sm">
                    {optimizationSuggestions.headline.suggested}
                  </div>
                  
                  <div className="text-sm mt-2 flex items-start">
                    <CircleCheck className="h-4 w-4 mr-1 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{optimizationSuggestions.headline.reason}</span>
                  </div>
                  
                  <Button
                    onClick={applyChanges}
                    size="sm"
                    className="mt-2"
                  >
                    Apply Change
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No headline optimization suggestions available.
            </div>
          )}
          
          {optimizationSuggestions.cta && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Call-to-Action Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Original:</div>
                  <div className="p-2 border rounded bg-gray-50 text-sm">
                    {optimizationSuggestions.cta.original}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-3">Suggested:</div>
                  <div className="p-2 border border-green-200 rounded bg-green-50 text-sm">
                    {optimizationSuggestions.cta.suggested}
                  </div>
                  
                  <div className="text-sm mt-2 flex items-start">
                    <CircleCheck className="h-4 w-4 mr-1 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{optimizationSuggestions.cta.reason}</span>
                  </div>
                  
                  <Button
                    onClick={applyChanges}
                    size="sm"
                    className="mt-2"
                  >
                    Apply Change
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4 mt-4">
          {optimizationSuggestions.content && optimizationSuggestions.content.length > 0 ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Content Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationSuggestions.content.map((content, index) => (
                    <div key={index} className="space-y-2 pb-3 border-b last:border-0">
                      <div className="font-medium">{content.section}</div>
                      
                      <div className="text-sm text-muted-foreground">Original:</div>
                      <div className="p-2 border rounded bg-gray-50 text-sm">
                        {content.original}
                      </div>
                      
                      <div className="text-sm text-muted-foreground mt-3">Suggested:</div>
                      <div className="p-2 border border-green-200 rounded bg-green-50 text-sm">
                        {content.suggested}
                      </div>
                      
                      <div className="text-sm mt-2 flex items-start">
                        <CircleCheck className="h-4 w-4 mr-1 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{content.reason}</span>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    onClick={applyChanges}
                    size="sm"
                  >
                    Apply All Content Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No content optimization suggestions available.
            </div>
          )}
          
          {optimizationSuggestions.structure && optimizationSuggestions.structure.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Structure Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {optimizationSuggestions.structure.map((structure, index) => (
                    <div key={index} className="flex items-start py-2 border-b last:border-0">
                      <ArrowUpRight className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">{structure.suggestion}</div>
                        <div className="text-sm text-muted-foreground">{structure.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="keywords" className="space-y-4 mt-4">
          {optimizationSuggestions.keywords && optimizationSuggestions.keywords.length > 0 ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Keyword Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relevance</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {optimizationSuggestions.keywords.map((keyword, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 text-sm">{keyword.keyword}</td>
                            <td className="px-3 py-2">
                              <Badge variant={
                                keyword.relevance === 'high' ? 'success' :
                                keyword.relevance === 'medium' ? 'warning' : 'outline'
                              }>{keyword.relevance}</Badge>
                            </td>
                            <td className="px-3 py-2 text-sm">{keyword.trafficPotential}</td>
                            <td className="px-3 py-2 text-sm">{keyword.difficulty}/100</td>
                            <td className="px-3 py-2">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleApply(`keyword-${index}`)}
                                  size="sm"
                                  disabled={applied[`keyword-${index}`]}
                                >
                                  {applied[`keyword-${index}`] ? 'Applied' : 'Apply'}
                                </Button>
                                {applied[`keyword-${index}`] && (
                                  <Button
                                    onClick={() => handleUndo(`keyword-${index}`)}
                                    size="sm"
                                    variant="outline"
                                  >
                                    Undo
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No keyword optimization suggestions available.
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Color Palette/Theme Suggestions */}
      {optimizationSuggestions.colors && optimizationSuggestions.colors.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
              Color Palette & Theme Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center mb-2">
              {optimizationSuggestions.colors.map((color, idx) => (
                <div key={idx} className="w-8 h-8 rounded-full border-2" style={{ background: color }} title={color}></div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => handleApply('colors')}
                size="sm"
                disabled={applied['colors']}
              >
                {applied['colors'] ? 'Applied' : 'Apply Palette'}
              </Button>
              {applied['colors'] && (
                <Button
                  onClick={() => handleUndo('colors')}
                  size="sm"
                  variant="outline"
                >
                  Undo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizationPanel;
