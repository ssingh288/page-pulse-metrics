
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, Share2, Facebook, Linkedin, Instagram, Twitter } from "lucide-react";
import { toast } from "sonner";
import { generateAdSuggestions, AdSuggestion } from "@/utils/aiService";
import { LandingPageFormValues } from "@/components/landing-page/LandingPageForm";

interface AdGeneratorProps {
  formValues: LandingPageFormValues;
  pageContent: string;
}

export const AdGenerator: React.FC<AdGeneratorProps> = ({ formValues, pageContent }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [adSuggestions, setAdSuggestions] = useState<AdSuggestion | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("facebook");

  const handleGenerateAds = async () => {
    try {
      setIsGenerating(true);
      
      // Process keywords into an array
      const keywordsArray = formValues.keywords
        .split(",")
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
      
      // Get ad suggestions from the AI service
      const suggestions = await generateAdSuggestions(
        pageContent,
        {
          title: formValues.title,
          audience: formValues.audience,
          industry: formValues.industry,
          campaign_type: formValues.campaign_type,
          keywords: keywordsArray,
        }
      );
      
      setAdSuggestions(suggestions);
      toast.success("Ad suggestions generated successfully!");
    } catch (error) {
      console.error("Error generating ads:", error);
      toast.error("Failed to generate ad suggestions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to render Facebook ad preview
  const renderFacebookPreview = () => {
    if (!adSuggestions?.facebook) return null;
    
    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Facebook className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Your Brand Name</p>
            <p className="text-xs text-gray-500">Sponsored · <span>⋯</span></p>
          </div>
        </div>
        <p className="text-sm mb-3">{adSuggestions.facebook.primary_text}</p>
        <div className="border rounded mb-3 bg-gray-50">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Ad Image</span>
          </div>
          <div className="p-2">
            <p className="font-bold text-sm text-blue-800 uppercase">{formValues.title}</p>
            <p className="font-bold">{adSuggestions.facebook.headline}</p>
            <p className="text-sm text-gray-600">{adSuggestions.facebook.description}</p>
            <Button className="mt-2 w-full">{adSuggestions.facebook.cta}</Button>
          </div>
        </div>
      </div>
    );
  };

  // Function to render Instagram ad preview
  const renderInstagramPreview = () => {
    if (!adSuggestions?.instagram) return null;
    
    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center">
            <Instagram className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Your Brand Name</p>
            <p className="text-xs text-gray-500">Sponsored</p>
          </div>
        </div>
        <div className="border rounded mb-3 bg-gray-50">
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Ad Image</span>
          </div>
        </div>
        <p className="text-sm mb-1">{adSuggestions.instagram.caption}</p>
        <p className="text-sm text-blue-500">{adSuggestions.instagram.hashtags}</p>
      </div>
    );
  };

  // Function to render LinkedIn ad preview
  const renderLinkedInPreview = () => {
    if (!adSuggestions?.linkedin) return null;
    
    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
            <Linkedin className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Your Brand Name</p>
            <p className="text-xs text-gray-500">Promoted · <span>⋯</span></p>
          </div>
        </div>
        <div className="border rounded mb-3 bg-gray-50">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Ad Image</span>
          </div>
          <div className="p-3">
            <p className="font-bold">{adSuggestions.linkedin.headline}</p>
            <p className="text-sm mb-2">{adSuggestions.linkedin.description}</p>
            <Button className="w-full">{adSuggestions.linkedin.cta}</Button>
          </div>
        </div>
      </div>
    );
  };

  // Function to render Twitter ad preview
  const renderTwitterPreview = () => {
    if (!adSuggestions?.twitter) return null;
    
    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
            <Twitter className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Your Brand Name</p>
            <p className="text-xs text-gray-500">Promoted</p>
          </div>
        </div>
        <p className="text-sm mb-3">{adSuggestions.twitter.tweet_copy}</p>
        <p className="text-sm text-blue-500">{adSuggestions.twitter.hashtags}</p>
        <div className="border rounded mt-2 bg-gray-50">
          <div className="h-40 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Ad Image</span>
          </div>
        </div>
      </div>
    );
  };

  // Function to render Google ad preview
  const renderGooglePreview = () => {
    if (!adSuggestions?.google) return null;
    
    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center mb-2">
          <span className="text-xs bg-green-100 text-green-800 px-1 mr-2">Ad</span>
          <span className="text-xs text-green-800">www.yourbrand.com/landing</span>
        </div>
        <p className="text-blue-800 text-lg font-semibold">
          {adSuggestions.google.headline1} | {adSuggestions.google.headline2}
        </p>
        <p className="text-blue-800 text-sm">{adSuggestions.google.headline3}</p>
        <p className="text-sm text-gray-600">{adSuggestions.google.description1}</p>
        <p className="text-sm text-gray-600">{adSuggestions.google.description2}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight flex items-center">
          <Share2 className="mr-2 h-5 w-5" />
          Ad Generator
        </h2>
        <Button 
          onClick={handleGenerateAds} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="mr-2 h-4 w-4" />
          )}
          {isGenerating ? "Generating..." : "Generate Ads"}
        </Button>
      </div>

      {isGenerating ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Generating Ad Suggestions</h3>
            <p className="text-center text-muted-foreground max-w-md">
              Our AI is analyzing your landing page content to create optimized ad variations for different social platforms.
            </p>
          </div>
        </Card>
      ) : !adSuggestions ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Share2 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Generate Social Media Ads</h3>
            <p className="text-center text-muted-foreground max-w-md">
              Create platform-specific ad variations for Facebook, Instagram, LinkedIn, Twitter, and Google based on your landing page content.
            </p>
            <Button 
              className="mt-6"
              onClick={handleGenerateAds}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Generate Ads
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="facebook" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                <span className="hidden md:inline">Facebook</span>
              </TabsTrigger>
              <TabsTrigger value="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                <span className="hidden md:inline">Instagram</span>
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <span className="hidden md:inline">LinkedIn</span>
              </TabsTrigger>
              <TabsTrigger value="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <span className="hidden md:inline">Twitter</span>
              </TabsTrigger>
              <TabsTrigger value="google" className="flex items-center gap-2">
                <span className="text-xs font-bold">G</span>
                <span className="hidden md:inline">Google</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ad Preview Section */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Ad Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TabsContent value="facebook" className="mt-0">
                    {renderFacebookPreview()}
                  </TabsContent>
                  <TabsContent value="instagram" className="mt-0">
                    {renderInstagramPreview()}
                  </TabsContent>
                  <TabsContent value="linkedin" className="mt-0">
                    {renderLinkedInPreview()}
                  </TabsContent>
                  <TabsContent value="twitter" className="mt-0">
                    {renderTwitterPreview()}
                  </TabsContent>
                  <TabsContent value="google" className="mt-0">
                    {renderGooglePreview()}
                  </TabsContent>
                </CardContent>
              </Card>

              {/* Ad Copy Section */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Ad Copy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TabsContent value="facebook" className="mt-0 space-y-4">
                    <div>
                      <p className="font-semibold mb-1">Headline</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.facebook?.headline}
                      </div>
                      <Badge className="mt-1">90 characters max</Badge>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Primary Text</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.facebook?.primary_text}
                      </div>
                      <Badge className="mt-1">125 characters recommended</Badge>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Description</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.facebook?.description}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">CTA Button</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.facebook?.cta}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="instagram" className="mt-0 space-y-4">
                    <div>
                      <p className="font-semibold mb-1">Caption</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.instagram?.caption}
                      </div>
                      <Badge className="mt-1">2,200 characters max</Badge>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Hashtags</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.instagram?.hashtags}
                      </div>
                      <Badge className="mt-1">30 hashtags max</Badge>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="linkedin" className="mt-0 space-y-4">
                    <div>
                      <p className="font-semibold mb-1">Headline</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.linkedin?.headline}
                      </div>
                      <Badge className="mt-1">150 characters max</Badge>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Description</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.linkedin?.description}
                      </div>
                      <Badge className="mt-1">150 characters recommended</Badge>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">CTA Button</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.linkedin?.cta}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="twitter" className="mt-0 space-y-4">
                    <div>
                      <p className="font-semibold mb-1">Tweet Copy</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.twitter?.tweet_copy}
                      </div>
                      <Badge className="mt-1">280 characters max</Badge>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Hashtags</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.twitter?.hashtags}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="google" className="mt-0 space-y-4">
                    <div>
                      <p className="font-semibold mb-1">Headline 1</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.google?.headline1}
                      </div>
                      <Badge className="mt-1">30 characters max</Badge>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Headline 2</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.google?.headline2}
                      </div>
                      <Badge className="mt-1">30 characters max</Badge>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Headline 3</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.google?.headline3}
                      </div>
                      <Badge className="mt-1">30 characters max</Badge>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Description Line 1</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.google?.description1}
                      </div>
                      <Badge className="mt-1">90 characters max</Badge>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Description Line 2</p>
                      <div className="bg-muted p-2 rounded">
                        {adSuggestions.google?.description2}
                      </div>
                      <Badge className="mt-1">90 characters max</Badge>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};
