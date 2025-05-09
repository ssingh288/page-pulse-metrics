
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeOption } from "@/utils/landingPageGenerator";
import { FileText, Palette, Sparkles, Save, Loader2 } from "lucide-react";

interface LandingPagePreviewProps {
  previewHtml: string;
  isGenerating: boolean;
  onRegenerateContent: () => void;
  onRegenerateTheme: () => void;
  onToggleOptimizer: () => void;
  onSavePage: () => void;
  showOptimizer: boolean;
  generatedContent: unknown;
}

export function LandingPagePreview({
  previewHtml,
  isGenerating,
  onRegenerateContent,
  onRegenerateTheme,
  onToggleOptimizer,
  onSavePage,
  showOptimizer,
  generatedContent
}: LandingPagePreviewProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Controls Panel - 7 columns (left side) */}
      <div className="col-span-7">
        <div className="space-y-6">
          {/* Page Controls Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Page Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/5 transition-all"
                onClick={onRegenerateContent}
                disabled={isGenerating}
              >
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Regenerate Content
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/5 transition-all"
                onClick={onRegenerateTheme}
                disabled={isGenerating}
              >
                <Palette className="mr-2 h-4 w-4 text-primary" />
                Try Different Design
              </Button>
              
              <Button
                variant={showOptimizer ? "secondary" : "outline"}
                className="w-full justify-start"
                onClick={onToggleOptimizer}
                disabled={isGenerating}
              >
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                {showOptimizer ? "Hide AI Optimizer" : "AI Optimizer"}
              </Button>
              
              <Button 
                className="w-full justify-start"
                onClick={onSavePage}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Landing Page
              </Button>
            </CardContent>
          </Card>
          
          {/* AI-Suggested Keywords Card */}
          {typeof generatedContent === 'object' && 
          generatedContent !== null && 
          'keywordSuggestions' in generatedContent && 
          Array.isArray(generatedContent.keywordSuggestions) && 
          generatedContent.keywordSuggestions.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">AI-Suggested Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(generatedContent.keywordSuggestions as string[]).map((keyword, index) => (
                    <div key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {keyword}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Panel - 5 columns (right side) */}
      <div className="col-span-5">
        <Card className="h-full">
          <CardHeader className="bg-muted/20 border-b flex flex-row justify-between items-center py-3 px-4">
            <CardTitle className="text-lg font-semibold text-primary">Preview</CardTitle>
            <span className="text-xs text-muted-foreground px-2 py-1 bg-primary/5 rounded-full">Live Preview</span>
          </CardHeader>
          <CardContent className="p-0 h-[600px] overflow-hidden bg-white">
            <iframe
              title="Landing Page Preview"
              srcDoc={previewHtml}
              className="w-full h-full border-0"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
