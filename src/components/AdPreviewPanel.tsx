import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { AdSuggestion } from "@/utils/aiService";

interface AdPreviewPanelProps {
  adSuggestions: AdSuggestion | null;
  isLoading: boolean;
  onApplyAdToPage?: (adText: string) => void;
}

const AdPreviewPanel: React.FC<AdPreviewPanelProps> = ({
  adSuggestions,
  isLoading,
  onApplyAdToPage
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.success("Copied to clipboard");
    
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    );
  }
  
  if (!adSuggestions) return null;
  
  return (
    <Tabs defaultValue="facebook" className="w-full">
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="facebook">Facebook</TabsTrigger>
        <TabsTrigger value="instagram">Instagram</TabsTrigger>
        <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
        <TabsTrigger value="twitter">Twitter</TabsTrigger>
        <TabsTrigger value="google">Google</TabsTrigger>
      </TabsList>
      
      <TabsContent value="facebook" className="space-y-4">
        {adSuggestions.facebook?.map((ad, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Facebook Ad {index + 1}</h4>
              <button 
                onClick={() => handleCopyText(`${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}`)}
                className="text-xs text-gray-500 flex items-center hover:text-gray-700"
              >
                {copiedText === `${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}` ? (
                  <><Check className="h-3 w-3 mr-1" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" /> Copy</>
                )}
              </button>
              <button
                onClick={() => handleDownload(`facebook-ad-${index + 1}.txt`, `${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}`)}
                className="ml-2 text-xs text-gray-500 flex items-center hover:text-gray-700"
              >
                Download
              </button>
              <button
                onClick={() => onApplyAdToPage && onApplyAdToPage(`${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}`)}
                className="ml-2 text-xs text-primary flex items-center hover:underline"
              >
                Apply to Page
              </button>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-lg">{ad.headline}</h5>
              <p className="text-sm">{ad.description}</p>
              <Badge variant="secondary" className="mt-2">{ad.cta}</Badge>
              <div className="mt-2 text-xs text-gray-500">
                <p>Image prompt: {ad.imagePrompt}</p>
              </div>
            </div>
          </div>
        ))}
      </TabsContent>
      
      <TabsContent value="instagram" className="space-y-4">
        {adSuggestions.instagram?.map((ad, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Instagram Ad {index + 1}</h4>
              <button 
                onClick={() => handleCopyText(`${ad.caption}\n\nCTA: ${ad.cta}`)}
                className="text-xs text-gray-500 flex items-center hover:text-gray-700"
              >
                {copiedText === `${ad.caption}\n\nCTA: ${ad.cta}` ? (
                  <><Check className="h-3 w-3 mr-1" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" /> Copy</>
                )}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm whitespace-pre-line">{ad.caption}</p>
              <Badge variant="secondary" className="mt-2">{ad.cta}</Badge>
              <div className="mt-2 text-xs text-gray-500">
                <p>Image prompt: {ad.imagePrompt}</p>
              </div>
            </div>
          </div>
        ))}
      </TabsContent>
      
      <TabsContent value="linkedin" className="space-y-4">
        {adSuggestions.linkedin?.map((ad, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">LinkedIn Ad {index + 1}</h4>
              <button 
                onClick={() => handleCopyText(`${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}`)}
                className="text-xs text-gray-500 flex items-center hover:text-gray-700"
              >
                {copiedText === `${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}` ? (
                  <><Check className="h-3 w-3 mr-1" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" /> Copy</>
                )}
              </button>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-lg">{ad.headline}</h5>
              <p className="text-sm">{ad.description}</p>
              <Badge variant="secondary" className="mt-2">{ad.cta}</Badge>
              <div className="mt-2 text-xs text-gray-500">
                <p>Image prompt: {ad.imagePrompt}</p>
              </div>
            </div>
          </div>
        ))}
      </TabsContent>
      
      <TabsContent value="twitter" className="space-y-4">
        {adSuggestions.twitter?.map((ad, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Twitter Ad {index + 1}</h4>
              <button 
                onClick={() => handleCopyText(`${ad.text}\n\nCTA: ${ad.cta}`)}
                className="text-xs text-gray-500 flex items-center hover:text-gray-700"
              >
                {copiedText === `${ad.text}\n\nCTA: ${ad.cta}` ? (
                  <><Check className="h-3 w-3 mr-1" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" /> Copy</>
                )}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm">{ad.text}</p>
              <Badge variant="secondary" className="mt-2">{ad.cta}</Badge>
              <div className="mt-2 text-xs text-gray-500">
                <p>Image prompt: {ad.imagePrompt}</p>
              </div>
            </div>
          </div>
        ))}
      </TabsContent>
      
      <TabsContent value="google" className="space-y-4">
        {adSuggestions.google?.map((ad, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Google Ad {index + 1}</h4>
              <button 
                onClick={() => handleCopyText(`${ad.headline1} | ${ad.headline2} | ${ad.headline3}\n\n${ad.description1}\n${ad.description2}`)}
                className="text-xs text-gray-500 flex items-center hover:text-gray-700"
              >
                {copiedText === `${ad.headline1} | ${ad.headline2} | ${ad.headline3}\n\n${ad.description1}\n${ad.description2}` ? (
                  <><Check className="h-3 w-3 mr-1" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" /> Copy</>
                )}
              </button>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-lg text-blue-600">{ad.headline1} | {ad.headline2} | {ad.headline3}</h5>
              <div>
                <p className="text-sm">{ad.description1}</p>
                <p className="text-sm">{ad.description2}</p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>Image prompt: {ad.imagePrompt}</p>
              </div>
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default AdPreviewPanel;
