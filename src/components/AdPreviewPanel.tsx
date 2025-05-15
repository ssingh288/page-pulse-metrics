import React from 'react';
import { AdSuggestion } from '@/utils/aiService';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export interface AdPreviewPanelProps {
  adSuggestions: AdSuggestion | null;
  isLoading?: boolean; // Make isLoading optional
}

const AdPreviewPanel: React.FC<AdPreviewPanelProps> = ({ adSuggestions, isLoading = false }) => {
  return (
    <div>
      {adSuggestions && (
        <>
          <TabsContent value="facebook" className="space-y-4">
            <h3 className="text-lg font-semibold">Facebook Ads</h3>
            {adSuggestions.facebook && adSuggestions.facebook.map((ad, index) => (
              <Card key={`facebook-${index}`} className="border">
                <CardHeader>
                  <CardTitle>{ad.headline}</CardTitle>
                  <CardDescription>{ad.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>CTA:</strong> {ad.cta}</p>
                  <Badge variant="secondary">Image Prompt: {ad.imagePrompt}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="instagram" className="space-y-4">
            <h3 className="text-lg font-semibold">Instagram Ads</h3>
            {adSuggestions.instagram && adSuggestions.instagram.map((ad, index) => (
              <Card key={`instagram-${index}`} className="border">
                <CardHeader>
                  <CardTitle>Caption</CardTitle>
                  <CardDescription>{ad.caption}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>CTA:</strong> {ad.cta}</p>
                  <Badge variant="secondary">Image Prompt: {ad.imagePrompt}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="linkedin" className="space-y-4">
            <h3 className="text-lg font-semibold">LinkedIn Ads</h3>
            {adSuggestions.linkedin && adSuggestions.linkedin.map((ad, index) => (
              <Card key={`linkedin-${index}`} className="border">
                <CardHeader>
                  <CardTitle>{ad.headline}</CardTitle>
                  <CardDescription>{ad.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>CTA:</strong> {ad.cta}</p>
                  <Badge variant="secondary">Image Prompt: {ad.imagePrompt}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="twitter" className="space-y-4">
            <h3 className="text-lg font-semibold">Twitter Ads</h3>
            {adSuggestions.twitter && adSuggestions.twitter.map((ad, index) => (
              <Card key={`twitter-${index}`} className="border">
                <CardHeader>
                  <CardTitle>Text</CardTitle>
                  <CardDescription>{ad.text}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>CTA:</strong> {ad.cta}</p>
                  <Badge variant="secondary">Image Prompt: {ad.imagePrompt}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="google" className="space-y-4">
            <h3 className="text-lg font-semibold">Google Ads</h3>
            {adSuggestions.google && adSuggestions.google.map((ad, index) => (
              <Card key={`google-${index}`} className="border">
                <CardHeader>
                  <CardTitle>{ad.headline1}</CardTitle>
                  <CardDescription>{ad.description1}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Headline 2:</strong> {ad.headline2}</p>
                  <p><strong>Headline 3:</strong> {ad.headline3}</p>
                  <p><strong>Description 2:</strong> {ad.description2}</p>
                  <Badge variant="secondary">Image Prompt: {ad.imagePrompt}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </>
      )}
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Generating Ad Suggestions...
        </div>
      )}
    </div>
  );
};

export default AdPreviewPanel;
