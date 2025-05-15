import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AdSuggestion } from "@/utils/aiService";
import { Sparkles, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface AdPreviewPanelProps {
  adSuggestions: AdSuggestion;
  isLoading?: boolean; // Make isLoading optional
}

const AdPreviewPanel: React.FC<AdPreviewPanelProps> = ({ adSuggestions, isLoading = false }) => {
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const renderFacebookAds = () => {
    return adSuggestions.facebook.map((ad, index) => (
      <Card key={index} className="mb-4 overflow-hidden border-blue-200 bg-blue-50/50">
        <CardHeader className="bg-blue-100/50 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium flex items-center">
              <Badge variant="outline" className="bg-blue-500 text-white mr-2">FB</Badge>
              Facebook Ad {index + 1}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleCopyText(ad.description)}>
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-base mb-1">{ad.headline}</div>
              <p className="text-sm text-muted-foreground">{ad.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">{ad.cta}</Badge>
              <div className="text-xs text-muted-foreground">Image: {ad.imagePrompt.substring(0, 30)}...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderInstagramAds = () => {
    return adSuggestions.instagram.map((ad, index) => (
      <Card key={index} className="mb-4 overflow-hidden border-pink-200 bg-pink-50/50">
        <CardHeader className="bg-pink-100/50 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium flex items-center">
              <Badge variant="outline" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white mr-2">IG</Badge>
              Instagram Post {index + 1}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleCopyText(ad.caption)}>
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <p className="text-sm">{ad.caption}</p>
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">{ad.cta}</Badge>
              <div className="text-xs text-muted-foreground">Image: {ad.imagePrompt.substring(0, 30)}...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderLinkedinAds = () => {
    return adSuggestions.linkedin.map((ad, index) => (
      <Card key={index} className="mb-4 overflow-hidden border-blue-200 bg-blue-50/50">
        <CardHeader className="bg-blue-100/50 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium flex items-center">
              <Badge variant="outline" className="bg-blue-700 text-white mr-2">in</Badge>
              LinkedIn Ad {index + 1}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleCopyText(ad.description)}>
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-base mb-1">{ad.headline}</div>
              <p className="text-sm text-muted-foreground">{ad.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">{ad.cta}</Badge>
              <div className="text-xs text-muted-foreground">Image: {ad.imagePrompt.substring(0, 30)}...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderTwitterAds = () => {
    return adSuggestions.twitter.map((ad, index) => (
      <Card key={index} className="mb-4 overflow-hidden border-blue-200 bg-blue-50/50">
        <CardHeader className="bg-blue-100/50 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium flex items-center">
              <Badge variant="outline" className="bg-blue-400 text-white mr-2">X</Badge>
              Twitter Ad {index + 1}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleCopyText(ad.text)}>
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <p className="text-sm">{ad.text}</p>
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">{ad.cta}</Badge>
              <div className="text-xs text-muted-foreground">Image: {ad.imagePrompt.substring(0, 30)}...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderGoogleAds = () => {
    return adSuggestions.google.map((ad, index) => (
      <Card key={index} className="mb-4 overflow-hidden border-green-200 bg-green-50/50">
        <CardHeader className="bg-green-100/50 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium flex items-center">
              <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-green-500 text-white mr-2">G</Badge>
              Google Ad {index + 1}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleCopyText(`${ad.headline1} | ${ad.headline2} | ${ad.headline3}\n${ad.description1}\n${ad.description2}`)}>
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="font-semibold text-base text-blue-600">{ad.headline1} | {ad.headline2} | {ad.headline3}</div>
              <p className="text-sm text-muted-foreground">{ad.description1}</p>
              <p className="text-sm text-muted-foreground">{ad.description2}</p>
            </div>
            <div className="text-xs text-muted-foreground">Image: {ad.imagePrompt.substring(0, 30)}...</div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">AI-Generated Ad Content</h2>
      </div>

      <Tabs defaultValue="facebook" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="facebook" className={cn("text-sm", "data-[state=active]:bg-blue-100")}>Facebook</TabsTrigger>
          <TabsTrigger value="instagram" className={cn("text-sm", "data-[state=active]:bg-pink-100")}>Instagram</TabsTrigger>
          <TabsTrigger value="linkedin" className={cn("text-sm", "data-[state=active]:bg-blue-100")}>LinkedIn</TabsTrigger>
          <TabsTrigger value="twitter" className={cn("text-sm", "data-[state=active]:bg-blue-100")}>Twitter</TabsTrigger>
          <TabsTrigger value="google" className={cn("text-sm", "data-[state=active]:bg-green-100")}>Google</TabsTrigger>
        </TabsList>
        
        <TabsContent value="facebook" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFacebookAds()}
          </div>
        </TabsContent>
        
        <TabsContent value="instagram" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInstagramAds()}
          </div>
        </TabsContent>
        
        <TabsContent value="linkedin" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderLinkedinAds()}
          </div>
        </TabsContent>
        
        <TabsContent value="twitter" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderTwitterAds()}
          </div>
        </TabsContent>
        
        <TabsContent value="google" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderGoogleAds()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdPreviewPanel;
