import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeOption } from "@/utils/landingPageGenerator";
import { FileText, Palette, Save, Loader2, PlusCircle, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface DesignCategory {
  name: string;
  id: string;
  description: string;
  styles: DesignStyle[];
}

interface DesignStyle {
  id: string;
  name: string;
  preview: string;
}

interface LandingPagePreviewProps {
  previewHtml: string;
  isGenerating: boolean;
  onRegenerateContent: () => void;
  onRegenerateTheme: () => void;
  onSavePage: () => void;
  showOptimizer: boolean;
  generatedContent: unknown;
  keywordSuggestions: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}

export function LandingPagePreview({
  previewHtml,
  isGenerating,
  onRegenerateContent,
  onRegenerateTheme,
  onSavePage,
  showOptimizer,
  generatedContent,
  keywordSuggestions = [],
  onAddKeyword,
  onRemoveKeyword
}: LandingPagePreviewProps) {
  const [openDesignDialog, setOpenDesignDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("modern");
  const [newKeyword, setNewKeyword] = useState("");
  
  // Design categories with styles
  const designCategories: DesignCategory[] = [
    {
      name: "Modern",
      id: "modern",
      description: "Clean, minimal designs with ample white space and bold typography",
      styles: [
        { id: "m1", name: "Modern Minimalist", preview: "Modern clean design with white space" },
        { id: "m2", name: "Modern Bold", preview: "Bold typography with vibrant accents" },
        { id: "m3", name: "Modern Gradient", preview: "Soft gradients with smooth transitions" },
        { id: "m4", name: "Modern Tech", preview: "Tech-focused with digital elements" },
        { id: "m5", name: "Modern Corporate", preview: "Professional with clean lines" },
      ]
    },
    {
      name: "Creative",
      id: "creative",
      description: "Artistic designs with unique layouts and expressive visual elements",
      styles: [
        { id: "c1", name: "Creative Playful", preview: "Playful elements with vibrant colors" },
        { id: "c2", name: "Creative Abstract", preview: "Abstract shapes and dynamic forms" },
        { id: "c3", name: "Creative Geometric", preview: "Geometric patterns and structures" },
        { id: "c4", name: "Creative Artistic", preview: "Hand-drawn elements and textures" },
        { id: "c5", name: "Creative Bold", preview: "Bold color blocks and contrasts" },
      ]
    },
    {
      name: "Business",
      id: "business",
      description: "Professional designs focused on conversion and trust-building",
      styles: [
        { id: "b1", name: "Business Professional", preview: "Clean corporate style" },
        { id: "b2", name: "Business Enterprise", preview: "Enterprise-grade design system" },
        { id: "b3", name: "Business Startup", preview: "Modern startup aesthetic" },
        { id: "b4", name: "Business Financial", preview: "Finance-focused with data elements" },
        { id: "b5", name: "Business Consulting", preview: "Consulting with trust elements" },
      ]
    },
    {
      name: "E-commerce",
      id: "ecommerce",
      description: "Sale-focused designs with strong CTAs and product showcasing",
      styles: [
        { id: "e1", name: "E-commerce Showcase", preview: "Product-focused layouts" },
        { id: "e2", name: "E-commerce Sale", preview: "Promotion-optimized design" },
        { id: "e3", name: "E-commerce Luxury", preview: "Premium product presentation" },
        { id: "e4", name: "E-commerce Minimal", preview: "Clean product-first design" },
        { id: "e5", name: "E-commerce Marketplace", preview: "Multi-product showcase layout" },
      ]
    },
    {
      name: "Educational",
      id: "educational",
      description: "Clear, structured designs that prioritize readability and information hierarchy",
      styles: [
        { id: "ed1", name: "Educational Course", preview: "Course-optimized layout" },
        { id: "ed2", name: "Educational Academic", preview: "Research-focused design" },
        { id: "ed3", name: "Educational Workshop", preview: "Workshop and event focused" },
        { id: "ed4", name: "Educational Digital", preview: "Digital learning optimized" },
        { id: "ed5", name: "Educational Kids", preview: "Child-friendly educational design" },
      ]
    },
    {
      name: "Tech",
      id: "tech",
      description: "Forward-looking designs with technology-focused elements and UI patterns",
      styles: [
        { id: "t1", name: "Tech Startup", preview: "Modern tech startup style" },
        { id: "t2", name: "Tech SaaS", preview: "SaaS-optimized interfaces" },
        { id: "t3", name: "Tech Dark Mode", preview: "Dark themed tech interfaces" },
        { id: "t4", name: "Tech AI", preview: "AI and future tech aesthetic" },
        { id: "t5", name: "Tech Mobile", preview: "Mobile-first tech design" },
      ]
    },
    {
      name: "Health & Wellness",
      id: "health",
      description: "Calming designs with soft colors and wellness-oriented imagery",
      styles: [
        { id: "h1", name: "Health Medical", preview: "Medical service focused" },
        { id: "h2", name: "Health Fitness", preview: "Fitness and active lifestyle" },
        { id: "h3", name: "Health Wellness", preview: "Wellness and mental health" },
        { id: "h4", name: "Health Nutrition", preview: "Nutrition and food focus" },
        { id: "h5", name: "Health Spa", preview: "Spa and relaxation services" },
      ]
    },
    {
      name: "Event",
      id: "event",
      description: "Engaging designs that create excitement and drive registrations",
      styles: [
        { id: "ev1", name: "Event Conference", preview: "Professional conference layout" },
        { id: "ev2", name: "Event Wedding", preview: "Elegant wedding design" },
        { id: "ev3", name: "Event Festival", preview: "Festival and celebration themed" },
        { id: "ev4", name: "Event Webinar", preview: "Webinar registration optimized" },
        { id: "ev5", name: "Event Workshop", preview: "Workshop-focused layout" },
      ]
    },
    {
      name: "Nonprofit",
      id: "nonprofit",
      description: "Mission-driven designs that emphasize impact and community",
      styles: [
        { id: "n1", name: "Nonprofit Cause", preview: "Cause-focused design" },
        { id: "n2", name: "Nonprofit Community", preview: "Community-centered layout" },
        { id: "n3", name: "Nonprofit Donation", preview: "Donation-optimized design" },
        { id: "n4", name: "Nonprofit Global", preview: "Global mission focused" },
        { id: "n5", name: "Nonprofit Local", preview: "Local community action themed" },
      ]
    },
    {
      name: "Portfolio",
      id: "portfolio",
      description: "Showcase-oriented designs that highlight work and achievements",
      styles: [
        { id: "p1", name: "Portfolio Creative", preview: "Creative work showcase" },
        { id: "p2", name: "Portfolio Professional", preview: "Professional CV style" },
        { id: "p3", name: "Portfolio Photography", preview: "Photography portfolio layout" },
        { id: "p4", name: "Portfolio Agency", preview: "Agency work showcase" },
        { id: "p5", name: "Portfolio Minimal", preview: "Minimal project display" },
      ]
    }
  ];

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      onAddKeyword(newKeyword.trim());
      setNewKeyword("");
    }
  };

  // Function to open preview in a new tab
  const openPreviewInNewTab = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(previewHtml);
      previewWindow.document.title = 'Landing Page Preview';
      previewWindow.document.close();
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Controls Panel - 5 columns (left side) - REDUCED WIDTH */}
      <div className="col-span-4">
        <div className="space-y-6">
          {/* Page Controls Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Page Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Removed Generate High-Quality AI Content button */}
              <Dialog open={openDesignDialog} onOpenChange={setOpenDesignDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/5 transition-all"
                    disabled={isGenerating}
                  >
                    <Palette className="mr-2 h-4 w-4 text-primary" />
                    Choose Design Style
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Choose a Design Style</DialogTitle>
                    <DialogDescription>
                      Select from a variety of design categories and styles for your landing page
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mt-4">
                    <TabsList className="grid grid-cols-5 mb-4 overflow-x-auto">
                      {designCategories.slice(0, 5).map(category => (
                        <TabsTrigger key={category.id} value={category.id}>
                          {category.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsList className="grid grid-cols-5 mb-4 overflow-x-auto">
                      {designCategories.slice(5, 10).map(category => (
                        <TabsTrigger key={category.id} value={category.id}>
                          {category.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {designCategories.map(category => (
                      <TabsContent key={category.id} value={category.id} className="space-y-4">
                        <div className="text-sm text-muted-foreground mb-4">
                          {category.description}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {category.styles.map(style => (
                            <Card 
                              key={style.id} 
                              className="overflow-hidden cursor-pointer hover:border-primary transition-all"
                              onClick={() => {
                                onRegenerateTheme();
                                setOpenDesignDialog(false);
                              }}
                            >
                              <div className="h-32 bg-muted flex items-center justify-center">
                                <span className="text-sm text-muted-foreground">
                                  {style.preview}
                                </span>
                              </div>
                              <CardContent className="p-3">
                                <p className="text-sm font-medium">{style.name}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </DialogContent>
              </Dialog>
              
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
          {/* Removed Content Keywords card */}
        </div>
      </div>

      {/* Preview Panel - 8 columns (right side) - INCREASED WIDTH */}
      <div className="col-span-8">
        <Card className="h-full">
          <CardHeader className="bg-muted/20 border-b flex flex-row justify-between items-center py-3 px-4">
            <CardTitle className="text-lg font-semibold text-primary">Preview</CardTitle>
            <span 
              className="text-xs text-muted-foreground px-2 py-1 bg-primary/5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={openPreviewInNewTab}
            >
              Live Preview
              <ExternalLink className="h-3 w-3 ml-1" />
            </span>
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
