import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, PenLine } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { generateOptimizedContent } from "@/utils/aiService";
import { toast } from "sonner";

type ContentType = 'headline' | 'button' | 'paragraph' | 'cta' | 'general';

const AiContentGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("general");
  const [activeTab, setActiveTab] = useState("input");

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some content to optimize");
      return;
    }

    setIsGenerating(true);
    setActiveTab("result");

    try {
      const result = await generateOptimizedContent(inputText, contentType);
      setGeneratedContent(result);
      toast.success("AI suggestions generated!");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Content Generator
        </CardTitle>
        <CardDescription>
          Optimize your content with AI-powered suggestions
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="result" disabled={!generatedContent && !isGenerating}>
              Results
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-6">
          <TabsContent value="input" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select
                  value={contentType}
                  onValueChange={(value) => setContentType(value as ContentType)}
                >
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="headline">Headline</SelectItem>
                    <SelectItem value="button">Button Text</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="cta">Call to Action</SelectItem>
                    <SelectItem value="general">General Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content to Optimize</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your content here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="result" className="space-y-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-center text-sm text-muted-foreground">
                  Generating AI suggestions...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border p-4 bg-muted/30">
                  <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy}
                  className="flex gap-2"
                >
                  <PenLine className="h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            setInputText("");
            setGeneratedContent("");
            setActiveTab("input");
          }}
          disabled={isGenerating}
        >
          Clear
        </Button>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !inputText.trim()}
          className="flex gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Generate Suggestions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AiContentGenerator;
