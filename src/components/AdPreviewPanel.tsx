
import React, { useState } from "react";
import { AdSuggestion } from "@/utils/aiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BsFacebook, BsTwitterX, BsInstagram, BsLinkedin } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdPreviewPanelProps {
  adSuggestions: AdSuggestion | null;
  isLoading: boolean;
}

const AdPreviewPanel: React.FC<AdPreviewPanelProps> = ({
  adSuggestions,
  isLoading
}) => {
  const [selectedVariation, setSelectedVariation] = useState<number>(0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ad Previews</CardTitle>
          <CardDescription>Generating platform-specific ads...</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4" />
            <p className="text-sm text-muted-foreground">Generating ad variations for multiple platforms</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!adSuggestions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ad Previews</CardTitle>
          <CardDescription>No ad suggestions available yet</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Click "Generate Ad Suggestions" to create platform-specific ad content
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform-Specific Ad Previews</CardTitle>
        <CardDescription>Based on your landing page content</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="facebook">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="facebook" className="flex items-center">
              <BsFacebook className="mr-2" /> Facebook
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center">
              <BsInstagram className="mr-2" /> Instagram
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center">
              <BsLinkedin className="mr-2" /> LinkedIn
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center">
              <BsTwitterX className="mr-2" /> Twitter
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center">
              <FaGoogle className="mr-2" /> Google
            </TabsTrigger>
          </TabsList>
          
          {/* Facebook Ad Preview */}
          <TabsContent value="facebook" className="p-4">
            {adSuggestions.facebook && adSuggestions.facebook.length > 0 ? (
              <div>
                {adSuggestions.facebook.length > 1 && (
                  <div className="flex gap-2 mb-4">
                    {adSuggestions.facebook.map((_, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={selectedVariation === index ? "default" : "outline"}
                        onClick={() => setSelectedVariation(index)}
                      >
                        Variation {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-[#1877F2] p-3 text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="rounded-full bg-white w-10 h-10 mr-3"></div>
                      <div>
                        <p className="font-bold">Your Company</p>
                        <p className="text-xs opacity-80">Sponsored</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">
                      {adSuggestions.facebook[selectedVariation].headline}
                    </h3>
                    <p className="mb-3">
                      {adSuggestions.facebook[selectedVariation].description}
                    </p>
                    <div className="h-[200px] bg-gray-200 flex items-center justify-center mb-3">
                      <p className="text-sm text-gray-600">
                        [Image: {adSuggestions.facebook[selectedVariation].imagePrompt}]
                      </p>
                    </div>
                    <Button className="w-full bg-[#1877F2] hover:bg-[#0e6acf]">
                      {adSuggestions.facebook[selectedVariation].cta}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">No Facebook ad variations available</div>
            )}
          </TabsContent>
          
          {/* Instagram Ad Preview */}
          <TabsContent value="instagram" className="p-4">
            {adSuggestions.instagram && adSuggestions.instagram.length > 0 ? (
              <div>
                {adSuggestions.instagram.length > 1 && (
                  <div className="flex gap-2 mb-4">
                    {adSuggestions.instagram.map((_, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={selectedVariation === index ? "default" : "outline"}
                        onClick={() => setSelectedVariation(index)}
                      >
                        Variation {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-white p-3 flex items-center justify-between border-b">
                    <div className="flex items-center">
                      <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 w-10 h-10 mr-3"></div>
                      <div>
                        <p className="font-bold">your_company</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[300px] bg-gray-200 flex items-center justify-center">
                    <p className="text-sm text-gray-600">
                      [Image: {adSuggestions.instagram[selectedVariation].imagePrompt}]
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <p className="mb-3">
                      {adSuggestions.instagram[selectedVariation].caption}
                    </p>
                    <Button className="w-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                      {adSuggestions.instagram[selectedVariation].cta}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">No Instagram ad variations available</div>
            )}
          </TabsContent>
          
          {/* LinkedIn Ad Preview */}
          <TabsContent value="linkedin" className="p-4">
            {adSuggestions.linkedin && adSuggestions.linkedin.length > 0 ? (
              <div>
                {adSuggestions.linkedin.length > 1 && (
                  <div className="flex gap-2 mb-4">
                    {adSuggestions.linkedin.map((_, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={selectedVariation === index ? "default" : "outline"}
                        onClick={() => setSelectedVariation(index)}
                      >
                        Variation {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-white p-3 flex items-center justify-between border-b">
                    <div className="flex items-center">
                      <div className="rounded-full bg-[#0a66c2] text-white w-10 h-10 flex items-center justify-center mr-3">
                        <span className="font-bold">YC</span>
                      </div>
                      <div>
                        <p className="font-bold">Your Company</p>
                        <p className="text-xs text-gray-500">Sponsored</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[200px] bg-gray-200 flex items-center justify-center">
                    <p className="text-sm text-gray-600">
                      [Image: {adSuggestions.linkedin[selectedVariation].imagePrompt}]
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">
                      {adSuggestions.linkedin[selectedVariation].headline}
                    </h3>
                    <p className="mb-3">
                      {adSuggestions.linkedin[selectedVariation].description}
                    </p>
                    <Button className="w-full bg-[#0a66c2] hover:bg-[#004182]">
                      {adSuggestions.linkedin[selectedVariation].cta}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">No LinkedIn ad variations available</div>
            )}
          </TabsContent>
          
          {/* Twitter Ad Preview */}
          <TabsContent value="twitter" className="p-4">
            {adSuggestions.twitter && adSuggestions.twitter.length > 0 ? (
              <div>
                {adSuggestions.twitter.length > 1 && (
                  <div className="flex gap-2 mb-4">
                    {adSuggestions.twitter.map((_, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={selectedVariation === index ? "default" : "outline"}
                        onClick={() => setSelectedVariation(index)}
                      >
                        Variation {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-white p-3 flex items-center justify-between border-b">
                    <div className="flex items-center">
                      <div className="rounded-full bg-black w-10 h-10 mr-3"></div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-bold mr-1">Your Company</p>
                          <span className="text-xs text-gray-500">@YourCompany</span>
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">Promoted</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="mb-3">
                      {adSuggestions.twitter[selectedVariation].text}
                    </p>
                    
                    <div className="h-[180px] bg-gray-200 flex items-center justify-center mb-3 rounded">
                      <p className="text-sm text-gray-600">
                        [Image: {adSuggestions.twitter[selectedVariation].imagePrompt}]
                      </p>
                    </div>
                    
                    <Button className="bg-black hover:bg-gray-800 text-white">
                      {adSuggestions.twitter[selectedVariation].cta}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">No Twitter ad variations available</div>
            )}
          </TabsContent>
          
          {/* Google Ad Preview */}
          <TabsContent value="google" className="p-4">
            {adSuggestions.google && adSuggestions.google.length > 0 ? (
              <div>
                {adSuggestions.google.length > 1 && (
                  <div className="flex gap-2 mb-4">
                    {adSuggestions.google.map((_, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={selectedVariation === index ? "default" : "outline"}
                        onClick={() => setSelectedVariation(index)}
                      >
                        Variation {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="border rounded-md overflow-hidden">
                  <div className="flex gap-2 p-2 border-b">
                    <Badge variant="outline" className="text-xs">Ad</Badge>
                    <span className="text-xs text-green-600">www.yourcompany.com</span>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="text-blue-600 font-medium mb-1">
                      {adSuggestions.google[selectedVariation].headline1} | {adSuggestions.google[selectedVariation].headline2}
                    </h3>
                    <h4 className="text-blue-600 text-sm mb-1">
                      {adSuggestions.google[selectedVariation].headline3}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {adSuggestions.google[selectedVariation].description1} {adSuggestions.google[selectedVariation].description2}
                    </p>
                    
                    <div className="border-t pt-3">
                      <p className="text-sm font-medium mb-1">Google Display Ad</p>
                      <div className="h-[180px] bg-gray-200 flex items-center justify-center rounded">
                        <p className="text-sm text-gray-600">
                          [Image: {adSuggestions.google[selectedVariation].imagePrompt}]
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">No Google ad variations available</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdPreviewPanel;
