
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Copy, Facebook, Instagram, Loader2, Twitter } from "lucide-react";
import { AdSuggestion } from "@/utils/aiService";

interface AdPreviewPanelProps {
  adSuggestions: AdSuggestion;
  isLoading: boolean;
}

const AdPreviewPanel: React.FC<AdPreviewPanelProps> = ({
  adSuggestions,
  isLoading
}) => {
  const [activeAdPlatform, setActiveAdPlatform] = useState<string>("facebook");
  const [copied, setCopied] = useState<string | null>(null);
  
  const handleCopy = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    toast.success(`Copied ${platform} ad content!`);
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Generating ad content...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 inline-flex items-center justify-center">AI</span>
          Ad Content Generation
        </h3>
        <p className="text-muted-foreground">Use this AI-generated content for your ad campaigns across different platforms.</p>
      </div>
      
      <Tabs value={activeAdPlatform} onValueChange={setActiveAdPlatform} className="w-full">
        <TabsList className="grid grid-cols-3 gap-2 mb-6">
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="facebook">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-600" />
                Facebook Ad
              </CardTitle>
              <CardDescription>Optimized content for Facebook advertising</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Headline:</h4>
                <div className="bg-muted p-3 rounded-md">
                  {adSuggestions.facebook?.headline || "No headline available"}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1"
                  onClick={() => handleCopy(adSuggestions.facebook?.headline || "", "Facebook headline")}
                >
                  {copied === "Facebook headline" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Primary Text:</h4>
                <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                  {adSuggestions.facebook?.primary_text || "No primary text available"}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1"
                  onClick={() => handleCopy(adSuggestions.facebook?.primary_text || "", "Facebook primary text")}
                >
                  {copied === "Facebook primary text" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Description:</h4>
                <div className="bg-muted p-3 rounded-md">
                  {adSuggestions.facebook?.description || "No description available"}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1"
                  onClick={() => handleCopy(adSuggestions.facebook?.description || "", "Facebook description")}
                >
                  {copied === "Facebook description" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <h4 className="text-sm font-medium mb-2 text-blue-700">Best Practices:</h4>
                <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                  <li>Keep headlines under 40 characters</li>
                  <li>Primary text should be concise and engaging</li>
                  <li>Include a clear call-to-action</li>
                  <li>Test different images with your ad copy</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instagram">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Instagram className="h-5 w-5 text-pink-600" />
                Instagram Ad
              </CardTitle>
              <CardDescription>Visual-first content for Instagram advertising</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Caption:</h4>
                <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                  {adSuggestions.instagram?.caption || "No caption available"}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1"
                  onClick={() => handleCopy(adSuggestions.instagram?.caption || "", "Instagram caption")}
                >
                  {copied === "Instagram caption" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Hashtags:</h4>
                <div className="bg-muted p-3 rounded-md">
                  {adSuggestions.instagram?.hashtags || "No hashtags available"}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1"
                  onClick={() => handleCopy(adSuggestions.instagram?.hashtags || "", "Instagram hashtags")}
                >
                  {copied === "Instagram hashtags" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
              
              <div className="bg-pink-50 p-3 rounded-md border border-pink-100">
                <h4 className="text-sm font-medium mb-2 text-pink-700">Best Practices:</h4>
                <ul className="list-disc pl-5 text-sm text-pink-700 space-y-1">
                  <li>Use 3-5 hashtags for optimal engagement</li>
                  <li>Focus on high-quality visual content</li>
                  <li>Keep captions engaging but concise</li>
                  <li>Include a call-to-action in your caption</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="twitter">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Twitter className="h-5 w-5 text-sky-500" />
                Twitter Ad
              </CardTitle>
              <CardDescription>Concise content for Twitter advertising</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Tweet Copy:</h4>
                <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                  {adSuggestions.twitter?.tweet_copy || "No tweet copy available"}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1"
                  onClick={() => handleCopy(adSuggestions.twitter?.tweet_copy || "", "Twitter copy")}
                >
                  {copied === "Twitter copy" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Hashtags:</h4>
                <div className="bg-muted p-3 rounded-md">
                  {adSuggestions.twitter?.hashtags || "No hashtags available"}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1"
                  onClick={() => handleCopy(adSuggestions.twitter?.hashtags || "", "Twitter hashtags")}
                >
                  {copied === "Twitter hashtags" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
              
              <div className="bg-sky-50 p-3 rounded-md border border-sky-100">
                <h4 className="text-sm font-medium mb-2 text-sky-700">Best Practices:</h4>
                <ul className="list-disc pl-5 text-sm text-sky-700 space-y-1">
                  <li>Keep tweets concise and under 280 characters</li>
                  <li>Use 1-2 relevant hashtags</li>
                  <li>Include a clear call-to-action</li>
                  <li>Test different media types (images, GIFs, videos)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdPreviewPanel;
