import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileText, Image, Sun, Moon, Trophy, User, Sparkles, Share2, QrCode, TrendingUp, Zap, Search } from "lucide-react";
import { LandingPageForm, LandingPageFormValues } from "@/components/landing-page/LandingPageForm";
import { LandingPagePreview } from "@/components/landing-page/LandingPagePreview";
import { AIOptimizationTab } from "@/components/landing-page/AIOptimizationTab";
import { AdGenerator } from "@/components/ad-generator/AdGenerator";
import { ThemeOption } from "@/utils/landingPageGenerator";
import {
  LandingPageData,
  PageMetadata,
  checkForExistingDraft,
  saveLandingPageDraft,
  publishLandingPage
} from "@/services/landingPageService";
import {
  generateLandingPageFromValues,
  regenerateContent,
  generateWithNextTheme
} from "@/components/landing-page/LandingPageGenerator";
import DynamicLandingPageOptimizer from "@/components/DynamicLandingPageOptimizer";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const LandingPageCreator = () => {
  const [generatingPage, setGeneratingPage] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeTab, setActiveTab] = useState("form");
  const [generatedContent, setGeneratedContent] = useState<Record<string, unknown>>({});
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [themeOptions, setThemeOptions] = useState<ThemeOption[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [mediaType, setMediaType] = useState("Image");
  const [layoutStyle, setLayoutStyle] = useState("Image Top, Content Below");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formValues, setFormValues] = useState<LandingPageFormValues>({
    title: "",
    campaign_type: "",
    industry: "",
    audience: "",
    keywords: ""
  });
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { theme, setTheme } = useTheme();
  const [achievements, setAchievements] = useState<string[]>([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const steps = ["Form", "Preview", "Optimize", "Ad Generator"];
  const currentStep = activeTab === "form" 
    ? 0 
    : activeTab === "preview" 
    ? 1 
    : activeTab === "optimize" 
    ? 2 
    : 3;
  const [slug, setSlug] = useState<string | null>(null);
  const [reach, setReach] = useState<number>(0);
  const [potentialReach, setPotentialReach] = useState<number>(0);
  const [device, setDevice] = useState("desktop");
  const [showFeedback, setShowFeedback] = useState(false);
  const deviceSizes = {
    desktop: { width: "100%", height: "600px" },
    tablet: { width: "768px", height: "900px" },
    mobile: { width: "375px", height: "700px" }
  };
  
  // Auto-save draft periodically
  useEffect(() => {
    const autoSaveInterval = window.setInterval(() => {
      if (formValues.title && formValues.title.length >= 3) {
        autoSaveDraft(formValues);
      }
    }, 5000);
    
    return () => window.clearInterval(autoSaveInterval);
  }, [formValues]);
  
  // Check for existing drafts when component mounts
  useEffect(() => {
    if (user) {
      loadExistingDraft();
    }
  }, [user]);

  // On mount, check for ?tab=preview in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ["form", "preview", "optimize", "ads"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Helper to fetch the latest slug from the database
  const fetchLatestSlug = async () => {
    if (draftId) {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('slug')
        .eq('id', draftId)
        .single();
      if (!error && data?.slug) setSlug(data.slug);
    }
  };

  // Add logic to refresh previewHtml from Supabase when preview tab is activated
  useEffect(() => {
    if (activeTab === 'preview' && (draftId || slug)) {
      (async () => {
        await fetchLatestSlug();
        let html = null;
        console.log('[Preview Fetch] Using slug:', slug, 'draftId:', draftId);
        if (slug) {
          // Try to fetch published page by slug
          const { data, error } = await supabase
            .from('landing_pages')
            .select('html_content')
            .eq('slug', slug)
            .eq('is_draft', false)
            .single();
          console.log('[Preview Fetch] Fetched by slug:', data, error);
          if (!error && data?.html_content) html = data.html_content;
        }
        if (!html && draftId) {
          // Fallback to draft by id
          const { data, error } = await supabase
            .from('landing_pages')
            .select('html_content')
            .eq('id', draftId)
            .single();
          console.log('[Preview Fetch] Fetched by draftId:', data, error);
          if (!error && data?.html_content) html = data.html_content;
        }
        if (html) setPreviewHtml(html);
      })();
    }
  }, [activeTab, draftId, slug]);
  
  const loadExistingDraft = async () => {
    if (!user) return;
    
    const draft = await checkForExistingDraft(user.id);
    
    if (draft) {
      setDraftId(draft.id);
      
      // Populate form with draft data
      const draftFormValues = {
        title: draft.title || "",
        campaign_type: draft.campaign_type || "",
        industry: draft.industry || "",
        audience: draft.audience || "",
        keywords: draft.initial_keywords ? draft.initial_keywords.join(', ') : ""
      };
      
      setFormValues(draftFormValues);
      
      // If there's HTML content, show the preview
      if (draft.html_content) {
        setPreviewHtml(draft.html_content);
        setActiveTab("preview");
        
        // Attempt to reconstruct the generated content and theme options
        // Check if metadata exists before trying to parse it
        if ('metadata' in draft && draft.metadata) {
          try {
            const parsedMetadata = typeof draft.metadata === 'string' 
              ? JSON.parse(draft.metadata) 
              : draft.metadata;
              
            if (parsedMetadata.generatedContent) {
              setGeneratedContent(parsedMetadata.generatedContent);
            }
            
            if (parsedMetadata.themeOptions) {
              setThemeOptions(parsedMetadata.themeOptions);
              setSelectedThemeIndex(parsedMetadata.selectedThemeIndex || 0);
            }
            
            if (parsedMetadata.mediaType) {
              setMediaType(parsedMetadata.mediaType);
            }
            
            if (parsedMetadata.layoutStyle) {
              setLayoutStyle(parsedMetadata.layoutStyle);
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
  };

  const autoSaveDraft = async (values: LandingPageFormValues) => {
    if (!user) return;
    
    try {
      setAutoSaving(true);
      
      // Prepare metadata to store
      const metadata: PageMetadata = {
        generatedContent,
        themeOptions,
        selectedThemeIndex,
        mediaType,
        layoutStyle
      };
      
      const result = await saveLandingPageDraft(
        user.id, 
        values, 
        draftId, 
        previewHtml, 
        metadata
      );
      
      if (result.success && result.id && !draftId) {
        setDraftId(result.id);
      }
      
      // Fetch slug from DB after save
      if (result.id) {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('slug')
          .eq('id', result.id)
          .single();
        if (!error && data?.slug) setSlug(data.slug);
      }
      
      // Update last saved timestamp
      setLastSaved(new Date());
      return result;
    } finally {
      setAutoSaving(false);
    }
  };

  const handleSubmit = async (values: LandingPageFormValues) => {
    try {
      if (!user) {
        toast.error("You must be logged in to create a page");
        return;
      }

      setGeneratingPage(true);
      setFormValues(values);

      // Generate landing page content
      generateLandingPageFromValues({
        formValues: values,
        onSuccess: async (html, content, themes) => {
          setPreviewHtml(html);
          setGeneratedContent(content);
          setThemeOptions(themes);
          setActiveTab("preview"); // Show the preview tab
          // Save the draft and store the draft ID for later editing
          const result = await saveLandingPageDraft(
            user.id,
            values,
            draftId,
            html,
            {
              generatedContent: content,
              themeOptions: themes,
              selectedThemeIndex,
              mediaType,
              layoutStyle
            }
          );
          console.log('saveLandingPageDraft result:', result);
          if (result.success && result.id) {
            setDraftId(result.id); // Store the draft ID for the edit button
            // Fetch slug from DB after save
            const { data, error } = await supabase
              .from('landing_pages')
              .select('slug')
              .eq('id', result.id)
              .single();
            if (!error && data?.slug) setSlug(data.slug);
          } else {
            toast.error(`Failed to create landing page draft${result.error ? ': ' + result.error : ''}`);
          }
        },
        onError: (error) => {
          console.log('saveLandingPageDraft error:', error);
          toast.error(`Error generating page: ${error.message}`);
        }
      });
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

      // Ensure the latest HTML is saved before publishing
      await saveLandingPageDraft(
        user.id,
        formValues,
        draftId,
        previewHtml,
        {
          generatedContent,
          themeOptions,
          selectedThemeIndex,
          mediaType,
          layoutStyle
        }
      );

      const result = await publishLandingPage(
        user.id,
        formValues,
        draftId,
        previewHtml,
        generatedContent
      );
      
      if (result.success && previewHtml) {
        toast.success("Landing page published successfully!");
        // Open the new published page in a new tab using the slug
        if (result.slug) {
          setSlug(result.slug);
          window.open(`/pages/${result.slug}`, '_blank');
        } else {
          // fallback to id if slug is not returned
          window.open(`/pages/${result.id}/view`, '_blank');
        }
        // Go back to the landing pages list
        navigate('/pages');
      } else {
        throw new Error(result.error || "Failed to publish landing page");
      }
    } catch (error: any) {
      toast.error(`Error saving page: ${error.message}`);
    } finally {
      setGeneratingPage(false);
    }
  };

  const handleRegenerateContent = () => {
    if (!generatedContent || themeOptions.length === 0) return;
    
    setGeneratingPage(true);
    
    // Update the form values with the current keywords
    const updatedFormValues = {
      ...formValues,
      keywords: keywordSuggestions.join(', ')
    };
    
    regenerateContent(
      updatedFormValues,
      selectedThemeIndex,
      themeOptions,
      (html, content, reachData) => {
        setPreviewHtml(html);
        setGeneratedContent(content);
        // Update reach values here
        setReach(reachData.reach);
        setPotentialReach(reachData.potentialReach);
        setGeneratingPage(false);
        
        // Auto save with the new content
        autoSaveDraft(updatedFormValues);
      },
      (error) => {
        toast.error(`Error regenerating content: ${error.message}`);
        setGeneratingPage(false);
      }
    );
  };

  const handleRegenerateTheme = () => {
    if (!generatedContent || themeOptions.length === 0) return;
    
    setGeneratingPage(true);
    
    generateWithNextTheme(
      formValues,
      selectedThemeIndex,
      themeOptions,
      generatedContent,
      (html, newThemeIndex) => {
        setPreviewHtml(html);
        setSelectedThemeIndex(newThemeIndex);
        setGeneratingPage(false);
        
        // Auto save with the new theme
        autoSaveDraft(formValues);
      },
      (error) => {
        toast.error(`Error changing theme: ${error.message}`);
        setGeneratingPage(false);
      }
    );
  };

  const toggleOptimizer = () => {
    setShowOptimizer(!showOptimizer);
  };

  // Handler for applying changes from the optimizer
  const handleApplyOptimizations = (updatedHtml: string, updatedKeywords?: string[]) => {
    setPreviewHtml(updatedHtml);
    
    // Update keywords if provided
    if (updatedKeywords && updatedKeywords.length > 0) {
      setKeywordSuggestions(updatedKeywords);
      
      // Update form values with the new keywords
      setFormValues({
        ...formValues,
        keywords: updatedKeywords.join(', ')
      });
    }
    
    // Auto save with the optimized content
    autoSaveDraft(formValues);
  };

  const handleAddKeyword = (keyword: string) => {
    if (!keywordSuggestions.includes(keyword)) {
      setKeywordSuggestions([...keywordSuggestions, keyword]);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywordSuggestions(keywordSuggestions.filter(k => k !== keyword));
  };

  useEffect(() => {
    if (lastSaved && !achievements.includes("First Draft Saved!")) {
      setAchievements(a => [...a, "First Draft Saved!"]);
    }
  }, [lastSaved, achievements]);

  return (
    <Layout title="Create Landing Page">
      {/* Personalized Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="ring-2 ring-primary/30 shadow-lg">
            <AvatarImage src={user?.user_metadata?.avatar_url || undefined} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : "!"}</h2>
            <p className="text-muted-foreground text-lg">Let's build your next high-converting landing page 🚀</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{draftId ? 1 : 0}</span>
            <span className="text-xs text-muted-foreground">Drafts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{achievements.length}</span>
            <span className="text-xs text-muted-foreground">Achievements</span>
          </div>
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="transition-colors hover:bg-primary/10">{theme === "dark" ? <Sun /> : <Moon />}</Button>
        </div>
      </div>
      {/* Onboarding Tooltip */}
      {showOnboarding && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 flex items-center gap-4 animate-fade-in shadow-md">
          <Sparkles className="h-6 w-6 text-primary animate-bounce" />
          <span className="text-base font-medium">Tip: Fill out the form, preview your page, and optimize with AI for best results!</span>
          <Button variant="outline" size="sm" onClick={() => setShowOnboarding(false)} className="ml-auto">Got it</Button>
        </div>
      )}
      {/* Gamification Achievements */}
      {achievements.length > 0 && (
        <div className="mb-6 flex gap-2 flex-wrap">
          {achievements.map((ach, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1 bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 animate-pulse shadow">
              <Trophy className="h-4 w-4" /> {ach}
            </Badge>
          ))}
        </div>
      )}
      {/* Progress Bar for Steps */}
      <div className="mb-6">
        <Progress value={((currentStep + 1) / steps.length) * 100} className="h-3 rounded-full bg-muted/30 shadow-inner" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          {steps.map((step, idx) => (
            <span key={step} className={idx === currentStep ? "font-bold text-primary" : ""}>{step}</span>
          ))}
        </div>
      </div>
      {/* Main Card with Tabs */}
      <Card className="glassmorphic-card shadow-2xl border-0 bg-white/80 backdrop-blur-lg rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-t-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-4 rounded-xl">
              <TabsTrigger value="form" className="text-lg font-semibold transition-colors hover:bg-primary/10">Form</TabsTrigger>
              <TabsTrigger value="preview" className="text-lg font-semibold transition-colors hover:bg-primary/10">Preview</TabsTrigger>
              <TabsTrigger value="optimize" className="text-lg font-semibold transition-colors hover:bg-primary/10">AI Optimize</TabsTrigger>
              <TabsTrigger value="ads" className="text-lg font-semibold transition-colors hover:bg-primary/10 flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>Ad Generator</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="form">
              <div className="p-4">
                <LandingPageForm
                  initialValues={formValues}
                  onSubmit={handleSubmit}
                  isGenerating={generatingPage}
                  lastSaved={lastSaved}
                  autoSaving={autoSaving}
                  mediaType={mediaType}
                  setMediaType={setMediaType}
                  layoutStyle={layoutStyle}
                  setLayoutStyle={setLayoutStyle}
                />
                <Button
                  className="mt-4"
                  onClick={async () => {
                    setGeneratingPage(true);
                    // Generate the latest HTML from form values before saving
                    await generateLandingPageFromValues({
                      formValues,
                      onSuccess: async (html, content, themes) => {
                        setPreviewHtml(html);
                        setGeneratedContent(content);
                        setThemeOptions(themes);
                        await handleSavePage();
                        setActiveTab('preview');
                        setGeneratingPage(false);
                      },
                      onError: (error) => {
                        toast.error(`Error generating page: ${error.message}`);
                        setGeneratingPage(false);
                      }
                    });
                  }}
                  disabled={generatingPage}
                >
                  Save & Preview
                </Button>
                <Button
                  className="mt-2 ml-2"
                  variant="secondary"
                  onClick={() => setActiveTab('optimize')}
                >
                  Get AI Suggestions
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              {previewHtml && (
                <div className="p-4 relative">
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="secondary"
                      onClick={() => setActiveTab('optimize')}
                    >
                      Optimize with AI
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('form')}
                    >
                      Edit Page
                    </Button>
                  </div>
                  {/* Conversion/SEO/Speed Badges */}
                  <div className="flex gap-4 mb-2 items-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                      <TrendingUp className="h-4 w-4" /> Conversion Rate: <span className="ml-1 font-bold">4.2%</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                      <Search className="h-4 w-4" /> SEO Score: <span className="ml-1 font-bold">82</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                      <Zap className="h-4 w-4" /> Load Speed: <span className="ml-1 font-bold">1.2s</span>
                    </span>
                  </div>
                  {/* 1. State for device */}
                  {/* 2. Device dimensions */}
                  {/* 3. Device toggle buttons */}
                  <div className="flex gap-2 mb-4 items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <Button variant={device === "desktop" ? "default" : "outline"} onClick={() => setDevice("desktop")}>Desktop</Button>
                      <Button variant={device === "tablet" ? "default" : "outline"} onClick={() => setDevice("tablet")}>Tablet</Button>
                      <Button variant={device === "mobile" ? "default" : "outline"} onClick={() => setDevice("mobile")}>Mobile</Button>
                      <Button
                        variant={showFeedback ? "default" : "outline"}
                        className="ml-2"
                        onClick={() => setShowFeedback(v => !v)}
                      >
                        {showFeedback ? "Hide Feedback" : "Show Feedback"}
                      </Button>
                      <Button
                        variant="outline"
                        className="ml-4"
                        onClick={async () => {
                          if (slug) {
                            const shareUrl = `${window.location.origin}/pages/${slug}`;
                            await navigator.clipboard.writeText(shareUrl);
                            toast.success("Shareable link copied to clipboard!", { description: shareUrl });
                          } else {
                            toast.error("No public link available yet. Please save or publish your page first.");
                          }
                        }}
                      >
                        Share Preview
                      </Button>
                    </div>
                    <TooltipProvider>
                      {slug ? null : draftId ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => {
                                window.open(`${window.location.origin}/pages/draft/${draftId}`, '_blank');
                              }}
                            >
                              Preview Draft
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Preview your draft (not yet published)</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" disabled>Live Preview</Button>
                          </TooltipTrigger>
                          <TooltipContent>Save or publish your page to enable preview</TooltipContent>
                        </Tooltip>
                      )}
                      {/* Preview in new tab button (always available) */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const previewWindow = window.open('', '_blank');
                              if (previewWindow) {
                                previewWindow.document.write(previewHtml);
                                previewWindow.document.title = 'Landing Page Preview';
                                previewWindow.document.close();
                              }
                            }}
                          >
                            Preview in new tab
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Open a local preview of your current page (not public)</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {/* 4. Preview iframe with dynamic size */}
                  <div className="border rounded-lg overflow-hidden mb-4 flex justify-center relative">
                    <iframe
                      title="Landing Page Preview"
                      srcDoc={previewHtml}
                      style={{
                        width: deviceSizes[device].width,
                        height: deviceSizes[device].height,
                        border: "none",
                        background: "white",
                        margin: "0 auto",
                        display: "block"
                      }}
                    />
                    {/* Feedback Overlay */}
                    {showFeedback && (
                      <div
                        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                        style={{ width: deviceSizes[device].width, height: deviceSizes[device].height }}
                      >
                        {/* Example feedback highlights - these would be dynamic in a real system */}
                        <div
                          className="absolute bg-green-200 bg-opacity-80 border border-green-500 rounded p-2 text-xs text-green-900 shadow"
                          style={{ top: '10%', left: '10%', width: '180px' }}
                        >
                          ✅ Great CTA placement!
                        </div>
                        <div
                          className="absolute bg-yellow-200 bg-opacity-80 border border-yellow-500 rounded p-2 text-xs text-yellow-900 shadow"
                          style={{ top: '40%', left: '50%', width: '200px' }}
                        >
                          ⚠️ Consider shortening this paragraph for better readability.
                        </div>
                        <div
                          className="absolute bg-blue-200 bg-opacity-80 border border-blue-500 rounded p-2 text-xs text-blue-900 shadow"
                          style={{ top: '70%', left: '20%', width: '160px' }}
                        >
                          💡 Add a testimonial here to build trust.
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={() => navigate(`/pages/${draftId}/edit`)} variant="default">Edit Page</Button>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="optimize">
              <div className="p-4">
                <AIOptimizationTab
                  formValues={formValues}
                  previewHtml={previewHtml}
                  onApplyOptimizations={handleApplyOptimizations}
                  isGenerating={generatingPage}
                  onUpdateGeneratingState={setGeneratingPage}
                  keywordSuggestions={keywordSuggestions}
                  onAddKeyword={handleAddKeyword}
                  onRemoveKeyword={handleRemoveKeyword}
                  onRegenerate={handleRegenerateContent}
                  reach={reach}
                  potentialReach={potentialReach}
                  setPreviewHtml={setPreviewHtml}
                  setFormValues={setFormValues}
                  setActiveTab={setActiveTab}
                />
              </div>
            </TabsContent>
            <TabsContent value="ads">
              <div className="p-4">
                <AdGenerator
                  formValues={formValues}
                  pageContent={previewHtml}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent />
      </Card>
    </Layout>
  );
};

export default LandingPageCreator;
