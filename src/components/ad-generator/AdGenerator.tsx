import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Share2, Facebook, Linkedin, Instagram, Twitter } from "lucide-react";
import { toast } from "sonner";
import { generateAdSuggestions, AdSuggestion } from "@/utils/aiService";
import { LandingPageFormValues } from "@/components/landing-page/LandingPageForm";

interface AdGeneratorProps {
  formValues: LandingPageFormValues;
  pageContent: string;
}

// Add fallback sample data for ad suggestions
const fallbackAdSuggestions: AdSuggestion = {
  facebook: {
    headline: "Boost Your Brand with AI!",
    primary_text: "Let AI create your next viral ad. Try it now!",
    description: "AI-powered ad generation for Facebook.",
    cta: "Learn More"
  },
  instagram: {
    caption: "Create stunning Instagram ads with AI ✨",
    hashtags: "#AI #AdGenerator #Instagram"
  },
  linkedin: {
    headline: "AI for B2B Marketing",
    description: "Generate LinkedIn ads that convert.",
    cta: "Get Started"
  },
  twitter: {
    tweet_copy: "AI-generated Twitter ads are here! 🚀",
    hashtags: "#AI #TwitterAds"
  },
  google: {
    headline1: "AI Ad Generator",
    headline2: "Boost Your Reach",
    headline3: "Try Free Today",
    description1: "Create Google ads in seconds with AI.",
    description2: "No credit card required."
  },
  whatsapp: {
    message: "Share your business with friends using our AI-generated WhatsApp ad!"
  }
};

export const AdGenerator: React.FC<AdGeneratorProps> = ({ formValues, pageContent }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [adSuggestions, setAdSuggestions] = useState<AdSuggestion | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("facebook");
  const [platformConnections, setPlatformConnections] = useState({
    facebook: false,
    instagram: false,
    linkedin: false,
    twitter: false,
    google: false,
    whatsapp: false,
  });
  const [adMedia, setAdMedia] = useState<{ [key: string]: File | null }>({
    facebook: null,
    instagram: null,
    linkedin: null,
    twitter: null,
    google: null,
    whatsapp: null,
  });
  const [adSatisfaction, setAdSatisfaction] = useState<{ [key: string]: boolean | null }>({
    facebook: null,
    instagram: null,
    linkedin: null,
    twitter: null,
    google: null,
    whatsapp: null,
  });
  const [adEdits, setAdEdits] = useState<{ [key: string]: any }>({});
  const [regenerating, setRegenerating] = useState<{ [key: string]: boolean }>({});

  const handleGenerateAds = async () => {
    try {
      setIsGenerating(true);
      setAdSuggestions(null);
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
      // Merge backend suggestions with fallback to ensure all platforms are present
      const mergedSuggestions = {
        facebook: suggestions?.facebook || fallbackAdSuggestions.facebook,
        instagram: suggestions?.instagram || fallbackAdSuggestions.instagram,
        linkedin: suggestions?.linkedin || fallbackAdSuggestions.linkedin,
        twitter: suggestions?.twitter || fallbackAdSuggestions.twitter,
        google: suggestions?.google || fallbackAdSuggestions.google,
        whatsapp: suggestions?.whatsapp || fallbackAdSuggestions.whatsapp,
      };
      setAdSuggestions(mergedSuggestions);
      toast.success("Ad suggestions generated successfully!");
    } catch (error) {
      setAdSuggestions(fallbackAdSuggestions);
      toast.error("Failed to generate ad suggestions. Showing sample ads.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Add platform URLs for 'Go to Platform' buttons
  const platformUrls: { [key: string]: string } = {
    facebook: "https://www.facebook.com/adsmanager",
    instagram: "https://www.instagram.com/create/style/",
    linkedin: "https://www.linkedin.com/campaignmanager/",
    twitter: "https://ads.twitter.com/",
    google: "https://ads.google.com/",
    whatsapp: "https://web.whatsapp.com/",
  };

  // Function to render Facebook ad preview
  const renderFacebookPreview = () => {
    if (isGenerating) return <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (!adSuggestions?.facebook) return <div className="p-6 text-center text-muted-foreground">No Facebook ad generated yet. Click 'Generate Ads' to create one.</div>;
    const editable = true;
    const edited = adEdits.facebook || {};
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
        <p className="text-sm mb-3">
          <textarea
            className="w-full border rounded p-1 text-sm"
            value={edited.primary_text ?? adSuggestions.facebook.primary_text}
            onChange={e => handleAdEdit("facebook", "primary_text", e.target.value)}
          />
        </p>
        <div className="border rounded mb-3 bg-gray-50">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            {adMedia.facebook ? (
              adMedia.facebook.type.startsWith("image") ? (
                <img src={URL.createObjectURL(adMedia.facebook)} alt="Ad Media" className="max-h-44 object-contain rounded" />
              ) : (
                <video src={URL.createObjectURL(adMedia.facebook)} controls className="max-h-44 object-contain rounded" />
              )
            ) : (
              <span className="text-gray-500">Ad Image</span>
            )}
          </div>
          <div className="p-2">
            <p className="font-bold text-sm text-blue-800 uppercase">{formValues.title}</p>
            <p className="font-bold">{adSuggestions.facebook.headline}</p>
            <p className="text-sm text-gray-600">{adSuggestions.facebook.description}</p>
            <Button className="mt-2 w-full">{adSuggestions.facebook.cta}</Button>
          </div>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Button size="sm" variant="secondary" onClick={() => handleRegenerateAd("facebook")} disabled={regenerating.facebook}>
            {regenerating.facebook ? "Regenerating..." : "Regenerate"}
          </Button>
          <Button size="sm" variant="default" asChild>
            <a href={getShareUrl("facebook")}
               target="_blank"
               rel="noopener noreferrer">
              Post on Facebook
            </a>
          </Button>
        </div>
        {adMedia.facebook && (
          <Button size="sm" variant="outline" onClick={() => setAdMedia(prev => ({ ...prev, facebook: null }))} className="mt-2">Remove Media</Button>
        )}
      </div>
    );
  };

  // Function to render Instagram ad preview
  const renderInstagramPreview = () => {
    if (isGenerating) return <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (!adSuggestions?.instagram) return <div className="p-6 text-center text-muted-foreground">No Instagram ad generated yet. Click 'Generate Ads' to create one.</div>;
    
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
            {adMedia.instagram ? (
              adMedia.instagram.type.startsWith("image") ? (
                <img src={URL.createObjectURL(adMedia.instagram)} alt="Ad Media" className="max-h-60 object-contain rounded" />
              ) : (
                <video src={URL.createObjectURL(adMedia.instagram)} controls className="max-h-60 object-contain rounded" />
              )
            ) : (
              <span className="text-gray-500">Ad Image</span>
            )}
          </div>
        </div>
        <p className="text-sm mb-1">{adSuggestions.instagram.caption}</p>
        <p className="text-sm text-blue-500">{adSuggestions.instagram.hashtags}</p>
        {adMedia.instagram && (
          <Button size="sm" variant="outline" onClick={() => setAdMedia(prev => ({ ...prev, instagram: null }))} className="mt-2">Remove Media</Button>
        )}
      </div>
    );
  };

  // Function to render LinkedIn ad preview
  const renderLinkedInPreview = () => {
    if (isGenerating) return <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (!adSuggestions?.linkedin) return <div className="p-6 text-center text-muted-foreground">No LinkedIn ad generated yet. Click 'Generate Ads' to create one.</div>;
    
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
            {adMedia.linkedin ? (
              adMedia.linkedin.type.startsWith("image") ? (
                <img src={URL.createObjectURL(adMedia.linkedin)} alt="Ad Media" className="max-h-44 object-contain rounded" />
              ) : (
                <video src={URL.createObjectURL(adMedia.linkedin)} controls className="max-h-44 object-contain rounded" />
              )
            ) : (
              <span className="text-gray-500">Ad Image</span>
            )}
          </div>
          <div className="p-3">
            <p className="font-bold">{adSuggestions.linkedin.headline}</p>
            <p className="text-sm mb-2">{adSuggestions.linkedin.description}</p>
            <Button className="w-full">{adSuggestions.linkedin.cta}</Button>
          </div>
        </div>
        {adMedia.linkedin && (
          <Button size="sm" variant="outline" onClick={() => setAdMedia(prev => ({ ...prev, linkedin: null }))} className="mt-2">Remove Media</Button>
        )}
      </div>
    );
  };

  // Function to render Twitter ad preview
  const renderTwitterPreview = () => {
    if (isGenerating) return <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (!adSuggestions?.twitter) return <div className="p-6 text-center text-muted-foreground">No Twitter ad generated yet. Click 'Generate Ads' to create one.</div>;
    
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
            {adMedia.twitter ? (
              adMedia.twitter.type.startsWith("image") ? (
                <img src={URL.createObjectURL(adMedia.twitter)} alt="Ad Media" className="max-h-36 object-contain rounded" />
              ) : (
                <video src={URL.createObjectURL(adMedia.twitter)} controls className="max-h-36 object-contain rounded" />
              )
            ) : (
              <span className="text-gray-500">Ad Image</span>
            )}
          </div>
        </div>
        {adMedia.twitter && (
          <Button size="sm" variant="outline" onClick={() => setAdMedia(prev => ({ ...prev, twitter: null }))} className="mt-2">Remove Media</Button>
        )}
      </div>
    );
  };

  // Function to render Google ad preview
  const renderGooglePreview = () => {
    if (isGenerating) return <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (!adSuggestions?.google) return <div className="p-6 text-center text-muted-foreground">No Google ad generated yet. Click 'Generate Ads' to create one.</div>;
    
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
        {adMedia.google && (
          <Button size="sm" variant="outline" onClick={() => setAdMedia(prev => ({ ...prev, google: null }))} className="mt-2">Remove Media</Button>
        )}
      </div>
    );
  };

  // Function to render WhatsApp ad preview
  const renderWhatsAppPreview = () => {
    if (isGenerating) return <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    const message = adSuggestions?.whatsapp?.message || "[Your WhatsApp ad message will appear here]";
    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">WA</span>
          </div>
          <div>
            <p className="font-bold text-sm">Your Brand Name</p>
            <p className="text-xs text-gray-500">WhatsApp Message</p>
          </div>
        </div>
        <p className="text-sm mb-3">{message}</p>
        <div className="border rounded mb-3 bg-gray-50">
          <div className="h-24 bg-gray-200 flex items-center justify-center">
            {adMedia.whatsapp ? (
              adMedia.whatsapp.type.startsWith("image") ? (
                <img src={URL.createObjectURL(adMedia.whatsapp)} alt="Ad Media" className="max-h-20 object-contain rounded" />
              ) : (
                <video src={URL.createObjectURL(adMedia.whatsapp)} controls className="max-h-20 object-contain rounded" />
              )
            ) : (
              <span className="text-gray-500">Ad Image</span>
            )}
          </div>
        </div>
        {adMedia.whatsapp && (
          <Button size="sm" variant="outline" onClick={() => setAdMedia(prev => ({ ...prev, whatsapp: null }))} className="mt-2">Remove Media</Button>
        )}
      </div>
    );
  };

  // Handlers for connect and post
  const handleConnect = (platform: string) => {
    setPlatformConnections((prev) => ({ ...prev, [platform]: true }));
    toast.success(`Connected to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
  };
  const handlePostAd = (platform: string) => {
    toast.success(`Ad posted to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
  };
  const handleMediaUpload = (platform: string, file: File) => {
    setAdMedia((prev) => ({ ...prev, [platform]: file }));
    toast.success(`Media uploaded for ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
  };

  // Handler for satisfaction toggle
  const handleSatisfaction = (platform: string, satisfied: boolean) => {
    setAdSatisfaction(prev => ({ ...prev, [platform]: satisfied }));
  };

  // Handler for ad copy edit
  const handleAdEdit = (platform: string, field: string, value: string) => {
    setAdEdits(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  // Handler for ad regeneration
  const handleRegenerateAd = async (platform: string) => {
    setRegenerating(prev => ({ ...prev, [platform]: true }));
    try {
      // Generate new ad suggestions for this platform only
      const keywordsArray = formValues.keywords
        .split(",")
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
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
      setAdSuggestions(prev => ({
        ...prev,
        [platform]: suggestions?.[platform] || fallbackAdSuggestions[platform],
      }));
      setAdSatisfaction(prev => ({ ...prev, [platform]: null }));
      setAdEdits(prev => ({ ...prev, [platform]: undefined }));
      toast.success(`Regenerated ${platform.charAt(0).toUpperCase() + platform.slice(1)} ad!`);
    } catch (error) {
      setAdSuggestions(prev => ({
        ...prev,
        [platform]: fallbackAdSuggestions[platform],
      }));
      toast.error(`Failed to regenerate ${platform} ad. Showing sample ad.`);
    } finally {
      setRegenerating(prev => ({ ...prev, [platform]: false }));
    }
  };

  // Remove Satisfied/Not Satisfied, keep only Regenerate
  // Update Post button to use share/post URLs with pre-filled content
  const getShareUrl = (platform: string) => {
    const url = encodeURIComponent(window.location.href); // Use current page as a placeholder
    const ad = adSuggestions?.[platform] || {};
    switch (platform) {
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(ad.primary_text || ad.headline || "")}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(ad.tweet_copy || ad.primary_text || ad.headline || "")}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      case "whatsapp":
        return `https://wa.me/?text=${encodeURIComponent(ad.message || ad.primary_text || ad.headline || "")}`;
      case "instagram":
        // Instagram does not support web share, open Instagram and instruct user
        return `https://www.instagram.com/`;
      case "google":
        // Google Ads can't be pre-filled, open Google Ads homepage
        return `https://ads.google.com/`;
      default:
        return "#";
    }
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
          disabled={isGenerating || !pageContent}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="mr-2 h-4 w-4" />
          )}
          Generate Ads
        </Button>
      </div>
      {(!adSuggestions && !isGenerating) && (
        <div className="p-4 text-center text-destructive bg-destructive/10 rounded">No ad posts generated yet. Click 'Generate Ads' to create ads for each platform.</div>
      )}
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
              {!pageContent 
                ? "Please create a landing page preview first by filling out and submitting the form."
                : "Create platform-specific ad variations for Facebook, Instagram, LinkedIn, Twitter, and Google based on your landing page content."
              }
            </p>
            {pageContent && (
              <Button 
                className="mt-6"
                onClick={handleGenerateAds}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Generate Ads
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
            <TabsList className="mb-4 flex flex-wrap gap-2">
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
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <span className="text-xs font-bold">WA</span>
                <span className="hidden md:inline">WhatsApp</span>
              </TabsTrigger>
            </TabsList>
            
            <Card>
              <CardContent className="pt-6">
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
                <TabsContent value="whatsapp" className="mt-0">
                  {renderWhatsAppPreview()}
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      )}
    </div>
  );
};
