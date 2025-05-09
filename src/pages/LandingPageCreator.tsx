import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, Palette, FileText, Sparkles, Image, Video, Save, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// This was causing the deep type instantiation error
// Using a type alias instead of a direct reference to the form object
import type { UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { generateLandingPageContent, generateEnhancedHtml, ThemeOption } from "@/utils/landingPageGenerator";
import DynamicLandingPageOptimizer from "@/components/DynamicLandingPageOptimizer";

// Create form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  campaign_type: z.string().min(1, "Please select a campaign type"),
  industry: z.string().min(1, "Please select an industry"),
  audience: z.string().min(10, "Please describe your target audience"),
  keywords: z.string().min(3, "Please enter at least one keyword")
});

const INDUSTRY_OPTIONS = [
  "E-commerce",
  "Software/SaaS",
  "Education",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Travel",
  "Marketing",
  "Fitness",
  "Food & Beverage",
  "Consulting",
  "Entertainment",
  "Manufacturing",
  "Non-profit",
  "Other"
];

const CAMPAIGN_TYPES = [
  "Lead Generation",
  "Product Launch",
  "Webinar Registration",
  "Event Promotion",
  "Newsletter Signup",
  "Sale/Discount Promotion",
  "Product Demo",
  "Free Trial",
  "Consultation Booking",
  "Case Study/Whitepaper Download",
  "Other"
];

const MEDIA_TYPE_OPTIONS = [
  "Image",
  "Video",
  "Image and Video",
  "None"
];

const LAYOUT_OPTIONS = [
  "Image Top, Content Below",
  "Content Top, Image Below",
  "Content Left, Image Right",
  "Image Left, Content Right",
  "Full-Width Image Banner"
];

// Define metadata type separately to avoid deep nesting issues
interface PageMetadata {
  generatedContent?: unknown;
  themeOptions?: ThemeOption[];
  selectedThemeIndex?: number;
  mediaType?: string;
  layoutStyle?: string;
}

// Define our custom database schema for landing pages
interface LandingPageData {
  audience: string;
  campaign_type: string;
  created_at: string;
  html_content: string | null;
  id: string;
  industry: string;
  initial_keywords: string[];
  published_at: string | null;
  published_url: string | null;
  title: string;
  updated_at: string;
  user_id: string;
  status?: string;
  metadata?: PageMetadata | null;
}

// Form values type
type FormValues = z.infer<typeof formSchema>;

const LandingPageCreator = () => {
  const [generatingPage, setGeneratingPage] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeTab, setActiveTab] = useState("form");
  const [generatedContent, setGeneratedContent] = useState<unknown>(null);
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [themeOptions, setThemeOptions] = useState<ThemeOption[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [mediaType, setMediaType] = useState("Image");
  const [layoutStyle, setLayoutStyle] = useState("Image Top, Content Below");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      campaign_type: "",
      industry: "",
      audience: "",
      keywords: ""
    },
  });
  
  // Using ref to store form without causing TypeScript deep instantiation error
  const formRef = useRef<typeof form>(form);
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  // Auto-save draft periodically with interval to avoid dependency cycle
  useEffect(() => {
    const autoSaveInterval = window.setInterval(() => {
      const currentForm = formRef.current;
      const currentValues = currentForm.getValues();
      
      if (currentValues.title && currentValues.title.length >= 3) {
        autoSaveDraft(currentValues);
      }
    }, 5000);
    
    return () => window.clearInterval(autoSaveInterval);
  }, []);
  
  // Check for existing drafts when component mounts
  useEffect(() => {
    if (user) {
      checkForExistingDraft();
    }
  }, [user]);
  
  const checkForExistingDraft = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(1);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const draft = data[0] as LandingPageData;
        setDraftId(draft.id);
        
        // Populate form with draft data
        form.reset({
          title: draft.title || "",
          campaign_type: draft.campaign_type || "",
          industry: draft.industry || "",
          audience: draft.audience || "",
          keywords: draft.initial_keywords ? draft.initial_keywords.join(', ') : ""
        });
        
        // If there's HTML content, show the preview
        if (draft.html_content) {
          setPreviewHtml(draft.html_content);
          setActiveTab("preview");
          
          // Attempt to reconstruct the generated content and theme options
          if (draft.metadata) {
            try {
              const metadata = typeof draft.metadata === 'string' 
                ? JSON.parse(draft.metadata) 
                : draft.metadata;
                
              if (metadata.generatedContent) {
                setGeneratedContent(metadata.generatedContent);
              }
              
              if (metadata.themeOptions) {
                setThemeOptions(metadata.themeOptions);
                setSelectedThemeIndex(metadata.selectedThemeIndex || 0);
              }
              
              if (metadata.mediaType) {
                setMediaType(metadata.mediaType);
              }
              
              if (metadata.layoutStyle) {
                setLayoutStyle(metadata.layoutStyle);
              }
            } catch (e) {
              console.error("Error parsing draft metadata", e);
            }
          }
        }
        
        toast("Loaded draft from your previous session", {
          description: `Last edited: ${new Date(draft.updated_at).toLocaleString()}`
        });
      }
    } catch (error: any) {
      console.error("Error checking for drafts:", error);
    }
  };

  const autoSaveDraft = async (formValues: FormValues) => {
    try {
      if (!user) return;
      
      setAutoSaving(true);
      
      // Process keywords into an array
      const keywordsArray = formValues.keywords
        .split(",")
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
      
      // Prepare metadata to store
      const metadata: PageMetadata = {
        generatedContent,
        themeOptions,
        selectedThemeIndex,
        mediaType,
        layoutStyle
      };
      
      if (draftId) {
        // Update existing draft
        const { error } = await supabase
          .from('landing_pages')
          .update({
            title: formValues.title,
            campaign_type: formValues.campaign_type,
            industry: formValues.industry,
            audience: formValues.audience,
            initial_keywords: keywordsArray,
            html_content: previewHtml || null,
            status: 'draft',
            metadata,
            updated_at: new Date().toISOString()
          })
          .eq('id', draftId);
          
        if (error) throw error;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from('landing_pages')
          .insert([{
            user_id: user.id,
            title: formValues.title,
            campaign_type: formValues.campaign_type,
            industry: formValues.industry,
            audience: formValues.audience,
            initial_keywords: keywordsArray,
            html_content: previewHtml || null,
            status: 'draft',
            metadata
          }])
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          setDraftId(data[0].id);
        }
      }
      
      // Update last saved timestamp
      setLastSaved(new Date());
    } catch (error: any) {
      console.error("Error auto-saving draft:", error);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (!user) {
        toast.error("You must be logged in to create a page");
        return;
      }

      setGeneratingPage(true);

      // Process keywords into an array
      const keywordsArray = values.keywords
        .split(",")
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      // Generate enhanced content using our new utility
      const { content, themeOptions } = generateLandingPageContent(
        values.title, 
        values.audience, 
        values.industry, 
        values.campaign_type,
        keywordsArray
      );
      
      // Store the generated content and theme options
      setGeneratedContent(content);
      setThemeOptions(themeOptions);
      
      // Generate HTML with the first theme option
      const enhancedHtml = generateEnhancedHtml(
        values.title,
        values.audience,
        keywordsArray,
        themeOptions[0],
        content
      );
      
      // Show preview of the generated page
      setPreviewHtml(enhancedHtml);
      setActiveTab("preview");
      
      // Auto save the draft with the preview content
      await autoSaveDraft(values);

    } catch (error: any) {
      toast.error(`Error generating page: ${error.message}`);
    } finally {
      setGeneratingPage(false);
    }
  };

  const handleSavePage = async () => {
    try {
      if (!user || !generatedContent || !previewHtml) {
        toast.error("Missing required data to save page");
        return;
      }

      setGeneratingPage(true);

      // Process keywords into an array
      const keywordsArray = form.getValues("keywords")
        .split(",")
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      // Add suggested keywords
      const allKeywords = [...keywordsArray];
      if (typeof generatedContent === 'object' && generatedContent !== null && 'keywordSuggestions' in generatedContent) {
        const suggestions = generatedContent.keywordSuggestions as string[];
        allKeywords.push(...suggestions);
      }

      // Check if we're updating a draft or creating a new page
      if (draftId) {
        // Update existing draft to published
        const { error } = await supabase
          .from('landing_pages')
          .update({
            title: form.getValues("title"),
            campaign_type: form.getValues("campaign_type"),
            industry: form.getValues("industry"),
            audience: form.getValues("audience"),
            initial_keywords: allKeywords,
            html_content: previewHtml,
            status: 'published',
            updated_at: new Date().toISOString()
          })
          .eq('id', draftId);
          
        if (error) throw error;
        
        // Process keywords for the page
        for (const keyword of allKeywords) {
          await supabase.from('keywords').insert({
            page_id: draftId,
            keyword: keyword,
            volume: Math.floor(Math.random() * 5000),
            cpc: parseFloat((Math.random() * 5).toFixed(2))
          });
        }
        
        toast.success("Landing page published successfully!");
        navigate(`/pages/${draftId}/edit`);
      } else {
        // Create new published page
        const { data, error } = await supabase
          .from('landing_pages')
          .insert([{
            user_id: user.id,
            title: form.getValues("title"),
            campaign_type: form.getValues("campaign_type"),
            industry: form.getValues("industry"),
            audience: form.getValues("audience"),
            initial_keywords: allKeywords,
            html_content: previewHtml,
            status: 'published'
          }])
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          const pageId = data[0].id;
          
          // Process keywords for the page
          for (const keyword of allKeywords) {
            await supabase.from('keywords').insert({
              page_id: pageId,
              keyword: keyword,
              volume: Math.floor(Math.random() * 5000),
              cpc: parseFloat((Math.random() * 5).toFixed(2))
            });
          }
          
          toast.success("Landing page created successfully!");
          navigate(`/pages/${pageId}/edit`);
        }
      }
    } catch (error: any) {
      toast.error(`Error saving page: ${error.message}`);
    } finally {
      setGeneratingPage(false);
    }
  };

  const regenerateContent = () => {
    if (!generatedContent || themeOptions.length === 0) return;
    
    // Generate HTML with the current theme option but regenerated content
    const values = form.getValues();
    const keywordsArray = values.keywords
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    
    // Generate new content
    const { content } = generateLandingPageContent(
      values.title, 
      values.audience, 
      values.industry, 
      values.campaign_type,
      keywordsArray
    );
    
    setGeneratedContent(content);
    
    // Generate HTML with the same theme but new content
    const enhancedHtml = generateEnhancedHtml(
      values.title,
      values.audience,
      keywordsArray,
      themeOptions[selectedThemeIndex],
      content
    );
    
    // Show preview of the regenerated page
    setPreviewHtml(enhancedHtml);
    
    // Auto save with the new content
    autoSaveDraft(values);
  };

  const regenerateTheme = () => {
    if (!generatedContent || themeOptions.length === 0) return;
    
    // Rotate to the next theme option
    const nextThemeIndex = (selectedThemeIndex + 1) % themeOptions.length;
    setSelectedThemeIndex(nextThemeIndex);
    
    const values = form.getValues();
    const keywordsArray = values.keywords
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    
    // Generate HTML with the next theme option but same content
    const enhancedHtml = generateEnhancedHtml(
      values.title,
      values.audience,
      keywordsArray,
      themeOptions[nextThemeIndex],
      generatedContent
    );
    
    // Show preview of the regenerated page
    setPreviewHtml(enhancedHtml);
    
    // Auto save with the new theme
    autoSaveDraft(values);
  };

  const toggleOptimizer = () => {
    setShowOptimizer(!showOptimizer);
  };

  // Handler for applying changes from the optimizer
  const handleApplyOptimizations = (updatedHtml: string) => {
    setPreviewHtml(updatedHtml);
    
    // Auto save with the optimized content
    autoSaveDraft(form.getValues());
  };

  // Function to render form content - Updated to match the design in the image
  const renderFormContent = () => (
    <Card className="shadow-lg border-primary/10 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">Create Your Landing Page</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Fill in the details below to generate a high-converting landing page
            </CardDescription>
          </div>
          {lastSaved && (
            <div className="text-xs text-muted-foreground flex items-center bg-background/80 px-2 py-1 rounded-full shadow-sm">
              {autoSaving ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin text-primary" />
                  <span>Auto-saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-1 text-primary" />
                  <span>Saved: {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Page Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Summer Sale Landing Page" 
                      {...field}
                      className="h-11 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="campaign_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Campaign Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Campaign Types</SelectLabel>
                          {CAMPAIGN_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Industry</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Industries</SelectLabel>
                          {INDUSTRY_OPTIONS.map((industry) => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="text-base font-medium">Media Type</FormLabel>
                <Select
                  onValueChange={setMediaType}
                  defaultValue={mediaType}
                  value={mediaType}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Media Types</SelectLabel>
                      {MEDIA_TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "Image" && (
                            <div className="flex items-center">
                              <Image className="h-4 w-4 mr-2 text-primary" />
                              Image
                            </div>
                          )}
                          {type === "Video" && (
                            <div className="flex items-center">
                              <Video className="h-4 w-4 mr-2 text-primary" />
                              Video
                            </div>
                          )}
                          {type === "Image and Video" && (
                            <div className="flex items-center">
                              <Image className="h-4 w-4 mr-2 text-primary" />
                              <Video className="h-4 w-4 mr-1 text-primary" />
                              Both
                            </div>
                          )}
                          {type === "None" && type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
              
              <FormItem>
                <FormLabel className="text-base font-medium">Layout Style</FormLabel>
                <Select
                  onValueChange={setLayoutStyle}
                  defaultValue={layoutStyle}
                  value={layoutStyle}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select layout style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Layout Styles</SelectLabel>
                      {LAYOUT_OPTIONS.map((style) => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Target Audience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your target audience (e.g. Small business owners aged 30-45 looking for accounting software)"
                      className="min-h-[120px] text-base resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Keywords</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter keywords separated by commas (e.g. digital marketing, SEO, content strategy)"
                      className="h-11 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="border-t bg-gradient-to-r from-accent/5 to-primary/5 pt-4">
            <Button 
              type="submit" 
              disabled={generatingPage} 
              className="w-full h-12 text-base shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              {generatingPage ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Page...
                </>
              ) : (
                <>
                  Create Landing Page
                  <ChevronRight className="ml-1 h-5 w-5" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );

  // Function to render preview content - Updated to match the design in the image
  const renderPreviewContent = () => (
    <div className="grid grid-cols-12 gap-6">
      {/* Controls Panel - 7 columns (left side) */}
      <div className="col-span-7">
        <div className="space-y-6">
          {/* Page Controls Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Page Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/5 transition-all"
                onClick={regenerateContent}
                disabled={generatingPage}
              >
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Regenerate Content
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/5 transition-all"
                onClick={regenerateTheme}
                disabled={generatingPage}
              >
                <Palette className="mr-2 h-4 w-4 text-primary" />
                Try Different Design
              </Button>
              
              <Button
                variant={showOptimizer ? "secondary" : "outline"}
                className="w-full justify-start"
                onClick={toggleOptimizer}
                disabled={generatingPage}
              >
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                {showOptimizer ? "Hide AI Optimizer" : "AI Optimizer"}
              </Button>
              
              <Button 
                className="w-full justify-start"
                onClick={handleSavePage}
                disabled={generatingPage}
              >
                {generatingPage ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Landing Page
              </Button>
            </CardContent>
          </Card>
          
          {/* AI Optimizer */}
          {showOptimizer && (
            <DynamicLandingPageOptimizer 
              htmlContent={previewHtml}
              pageInfo={{
                title: form.getValues("title"),
                audience: form.getValues("audience"),
                industry: form.getValues("industry"),
                campaign_type: form.getValues("campaign_type"),
                keywords: form.getValues("keywords")
                  .split(",")
                  .map(keyword => keyword.trim())
                  .filter(keyword => keyword.length > 0)
              }}
              onApplyChanges={handleApplyOptimizations}
            />
          )}
          
          {/* AI-Suggested Keywords Card */}
          {typeof generatedContent === 'object' && 
           generatedContent !== null && 
           'keywordSuggestions' in generatedContent && 
           Array.isArray(generatedContent.keywordSuggestions) && 
           generatedContent.keywordSuggestions.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">AI-Suggested Keywords</CardTitle>
                <CardDescription>
                  Additional keywords that could improve page performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(generatedContent.keywordSuggestions as string[]).map((keyword, index) => (
                    <div key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {keyword}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Panel - 5 columns (right side) */}
      <div className="col-span-5">
        <Card className="h-full">
          <CardHeader className="bg-muted/20 border-b flex flex-row justify-between items-center py-3 px-4">
            <CardTitle className="text-lg font-semibold text-primary">Preview</CardTitle>
            <span className="text-xs text-muted-foreground px-2 py-1 bg-primary/5 rounded-full">Live Preview</span>
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

  return (
    <Layout title="Create Landing Page">
      <div className="max-w-7xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 mb-6 shadow-md">
            <TabsTrigger value="form" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText className="mr-2 h-4 w-4" />
              Page Details
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!previewHtml} className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Image className="mr-2 h-4 w-4" />
              Preview & Edit
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-4">
            {renderFormContent()}
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            {previewHtml && renderPreviewContent()}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LandingPageCreator;
