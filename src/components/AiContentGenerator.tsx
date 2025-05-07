
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, PenLine, Globe, Target, Building, PenTool } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { generateOptimizedContent, generateMarketingOptimizations } from "@/utils/aiService";
import { toast } from "sonner";

type ContentType = 'headline' | 'button' | 'paragraph' | 'cta' | 'general';
type OptimizationType = 'content' | 'marketing';

const AiContentGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("general");
  const [activeTab, setActiveTab] = useState("input");
  const [optimizationType, setOptimizationType] = useState<OptimizationType>("content");
  
  // Marketing optimization specific fields
  const [landingPageUrl, setLandingPageUrl] = useState("");
  const [audienceType, setAudienceType] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("professional");

  const handleGenerate = async () => {
    if (optimizationType === 'content') {
      if (!inputText.trim()) {
        toast.error("Please enter some content to optimize");
        return;
      }
    } else {
      if (!landingPageUrl.trim()) {
        toast.error("Please enter a landing page URL");
        return;
      }
    }

    setIsGenerating(true);
    setActiveTab("result");

    try {
      let result;
      
      if (optimizationType === 'content') {
        result = await generateOptimizedContent(inputText, contentType);
      } else {
        result = await generateMarketingOptimizations({
          landingPageUrl,
          audienceType,
          industry,
          tone
        });
      }
      
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

  const renderInputFields = () => {
    if (optimizationType === 'content') {
      return (
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
              placeholder="Enter your landing page content here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="landing-page-url" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Landing Page URL
            </Label>
            <Input
              id="landing-page-url"
              placeholder="https://example.com/landing-page"
              value={landingPageUrl}
              onChange={(e) => setLandingPageUrl(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audience-type" className="flex items-center gap-2">
              <Target className="h-4 w-4" /> Target Audience
            </Label>
            <Input
              id="audience-type"
              placeholder="e.g., Small Business Owners, Marketing Professionals"
              value={audienceType}
              onChange={(e) => setAudienceType(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry" className="flex items-center gap-2">
              <Building className="h-4 w-4" /> Industry
            </Label>
            <Input
              id="industry"
              placeholder="e.g., SaaS, E-commerce, Healthcare"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tone" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" /> Desired Tone
            </Label>
            <Select
              value={tone}
              onValueChange={(value) => setTone(value)}
            >
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="authoritative">Authoritative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
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
          Optimize your landing page content with AI-powered suggestions
        </CardDescription>
        <Tabs value={optimizationType} onValueChange={(value) => setOptimizationType(value as OptimizationType)} className="mt-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content Optimization</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Optimization</TabsTrigger>
          </TabsList>
        </Tabs>
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
            {renderInputFields()}
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
            if (optimizationType === 'marketing') {
              setLandingPageUrl("");
              setAudienceType("");
              setIndustry("");
              setTone("professional");
            }
          }}
          disabled={isGenerating}
        >
          Clear
        </Button>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || (optimizationType === 'content' && !inputText.trim()) || (optimizationType === 'marketing' && !landingPageUrl.trim())}
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
