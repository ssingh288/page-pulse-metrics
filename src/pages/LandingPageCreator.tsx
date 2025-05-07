
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, Palette, FileText, Sparkles } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { generateLandingPageContent, generateEnhancedHtml } from "@/utils/landingPageGenerator";
import { generateAiSuggestions } from "@/utils/aiService";

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

// Create form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  campaign_type: z.string().min(1, "Please select a campaign type"),
  industry: z.string().min(1, "Please select an industry"),
  audience: z.string().min(10, "Please describe your target audience"),
  keywords: z.string().min(3, "Please enter at least one keyword")
});

const LandingPageCreator = () => {
  const [generatingPage, setGeneratingPage] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeTab, setActiveTab] = useState("form");
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [themeOptions, setThemeOptions] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationPrompt, setOptimizationPrompt] = useState("");
  const [optimizationResult, setOptimizationResult] = useState("");
  const [showOptimizer, setShowOptimizer] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      campaign_type: "",
      industry: "",
      audience: "",
      keywords: ""
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
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
      const allKeywords = [...keywordsArray, ...generatedContent.keywordSuggestions];

      // Save to Supabase
      const { data, error } = await supabase
        .from('landing_pages')
        .insert([{
          user_id: user.id,
          title: form.getValues("title"),
          campaign_type: form.getValues("campaign_type"),
          industry: form.getValues("industry"),
          audience: form.getValues("audience"),
          initial_keywords: allKeywords,
          html_content: previewHtml
        }])
        .select();

      if (error) {
        throw error;
      }

      // Add initial keywords
      if (data && data[0]) {
        const pageId = data[0].id;
        
        // Process each keyword individually to avoid array insert issues
        for (const keyword of allKeywords) {
          await supabase.from('keywords').insert({
            page_id: pageId,
            keyword: keyword,
            // Dummy data for now - convert string to number
            volume: Math.floor(Math.random() * 5000),
            cpc: parseFloat((Math.random() * 5).toFixed(2))
          });
        }
        
        toast.success("Landing page created successfully!");
        navigate(`/pages/${pageId}/edit`);
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
  };

  const handleOptimizePage = async () => {
    try {
      setOptimizing(true);
      
      // Create a prompt based on current page content and form data
      const values = form.getValues();
      const prompt = `Optimize this landing page for conversions and SEO:
Title: ${values.title}
Target Audience: ${values.audience}
Industry: ${values.industry}
Campaign Type: ${values.campaign_type}
Keywords: ${values.keywords}

Please provide comprehensive optimization recommendations in these areas:
1. Headlines and copywriting improvements
2. Call-to-action button text and placement
3. SEO keyword optimization
4. Layout and user flow improvements
5. Additional keywords to target
6. A/B testing recommendations

Current landing page structure: [Preview currently shown to user]`;

      // Generate AI suggestions using our utility
      const suggestions = await generateAiSuggestions(prompt);
      
      setOptimizationResult(suggestions);
      
    } catch (error: any) {
      toast.error(`Error optimizing page: ${error.message}`);
      setOptimizationResult("Unable to generate optimization suggestions at this time. Please try again later.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleOptimizationPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOptimizationPrompt(e.target.value);
  };

  const toggleOptimizer = () => {
    setShowOptimizer(!showOptimizer);
    if (!showOptimizer) {
      // Pre-populate the optimization prompt with some context
      const values = form.getValues();
      setOptimizationPrompt(`Please optimize this ${values.campaign_type} landing page for the ${values.industry} industry targeting ${values.audience}.`);
    }
  };

  return (
    <Layout title="Create Landing Page">
      <div className="max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Page Details</TabsTrigger>
            <TabsTrigger value="preview" disabled={!previewHtml}>Preview & Save</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Landing Page</CardTitle>
                <CardDescription>
                  Fill in the details below to generate your AI-optimized landing page
                </CardDescription>
              </CardHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Summer Sale Landing Page" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="campaign_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
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
                            <FormLabel>Industry</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
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

                    <FormField
                      control={form.control}
                      name="audience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your target audience (e.g. Small business owners aged 30-45 looking for accounting software)"
                              className="min-h-[100px]"
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
                          <FormLabel>Keywords</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter keywords separated by commas (e.g. digital marketing, SEO, content strategy)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter>
                    <Button type="submit" disabled={generatingPage} className="w-full">
                      {generatingPage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Landing Page"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            {previewHtml && (
              <>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Landing Page Preview</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={regenerateContent}
                      disabled={generatingPage}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Regenerate Content
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={regenerateTheme}
                      disabled={generatingPage}
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      Try Different Design
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleOptimizer}
                      disabled={generatingPage || optimizing}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Optimizer
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSavePage}
                      disabled={generatingPage}
                    >
                      {generatingPage ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Save Landing Page
                    </Button>
                  </div>
                </div>
                
                {showOptimizer && (
                  <Card className="mb-4">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-primary" />
                        AI Page Optimizer
                      </CardTitle>
                      <CardDescription>
                        Get AI-powered suggestions to improve your landing page performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!optimizationResult ? (
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Additional optimization instructions (optional):
                          </label>
                          <Textarea
                            value={optimizationPrompt}
                            onChange={handleOptimizationPromptChange}
                            placeholder="E.g., Focus on improving headline engagement, suggest better CTA wording, etc."
                            className="mb-4"
                          />
                          <Button
                            onClick={handleOptimizePage}
                            disabled={optimizing}
                            className="w-full"
                          >
                            {optimizing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Optimization Suggestions...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Optimization Suggestions
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="rounded-md border p-4 bg-muted/30">
                            <pre className="whitespace-pre-wrap text-sm">{optimizationResult}</pre>
                          </div>
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setOptimizationResult("");
                                setOptimizationPrompt("");
                              }}
                            >
                              Clear Results
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(optimizationResult)}
                            >
                              Copy to Clipboard
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                <div className="border rounded-lg overflow-hidden bg-white">
                  <iframe
                    title="Landing Page Preview"
                    srcDoc={previewHtml}
                    className="w-full h-[600px] border-0"
                  />
                </div>
                
                {generatedContent?.keywordSuggestions && generatedContent.keywordSuggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI-Suggested Keywords</CardTitle>
                      <CardDescription>
                        Our AI has suggested these additional keywords that might improve your page performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.keywordSuggestions.map((keyword: string, index: number) => (
                          <div key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {keyword}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LandingPageCreator;
