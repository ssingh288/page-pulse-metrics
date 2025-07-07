import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileText, Image, Sun, Moon, Trophy, User, Sparkles, Share2 } from "lucide-react";
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

const LandingPageCreator = () => {
  const [generatingPage, setGeneratingPage] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeTab, setActiveTab] = useState("form");
  const [generatedContent, setGeneratedContent] = useState<Record<string, unknown>>({});
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
  const [showAdPrompt, setShowAdPrompt] = useState(false);
  const [newPageId, setNewPageId] = useState<string | null>(null);
  
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

      // Process keywords into an array
      const keywordsArray = values.keywords
        .split(",")
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
        
      // Set initial keywords
      setKeywordSuggestions(keywordsArray);

      // Generate landing page content
      generateLandingPageFromValues({
        formValues: values,
        onSuccess: async (html, content, themes) => {
          setPreviewHtml(html);
          setGeneratedContent(content);
          setThemeOptions(themes);
          setActiveTab("preview");
          
          // Extract keywords from generated content if available
          if (content && typeof content === 'object' && 'keywordSuggestions' in content) {
            setKeywordSuggestions(
              [...keywordsArray, ...(content.keywordSuggestions as string[] || [])]
                .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
            );
          }
          
          // Auto save the draft with the preview content and get the real ID
          const draftResult = await autoSaveDraft(values);
          if (draftResult && draftResult.success && draftResult.id) {
            setNewPageId(draftResult.id);
            setShowAdPrompt(true);
          }
        },
        onError: (error) => {
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

      const result = await publishLandingPage(
        user.id,
        formValues,
        draftId,
        previewHtml,
        generatedContent
      );
      
      if (result.success) {
        toast.success("Landing page published successfully!");
        navigate(`/pages/${result.id}/edit`);
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
      (html, content) => {
        setPreviewHtml(html);
        setGeneratedContent(content);
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
          </Tabs>
        </CardHeader>
        <CardContent>
          {activeTab === "form" && (
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
            </div>
          )}
          {activeTab === "preview" && (
            <div className="p-4">
              <LandingPagePreview
                previewHtml={previewHtml}
                isGenerating={generatingPage}
                onRegenerateContent={handleRegenerateContent}
                onRegenerateTheme={handleRegenerateTheme}
                onSavePage={handleSavePage}
                showOptimizer={showOptimizer}
                generatedContent={generatedContent}
                keywordSuggestions={keywordSuggestions}
                onAddKeyword={handleAddKeyword}
                onRemoveKeyword={handleRemoveKeyword}
              />
              <div className="flex justify-end mt-4">
                <Button onClick={handleSavePage} disabled={generatingPage} className="font-bold transition-transform hover:scale-105">
                  Save & Publish
                </Button>
              </div>
            </div>
          )}
          {activeTab === "optimize" && (
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
              />
            </div>
          )}
          {activeTab === "ads" && (
            <div className="p-4">
              <AdGenerator
                formValues={formValues}
                pageContent={previewHtml}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={showAdPrompt} onOpenChange={setShowAdPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Ads for Your New Landing Page?</DialogTitle>
          </DialogHeader>
          <p className="mb-4">Would you like to instantly generate ads for your new landing page using AI?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdPrompt(false)}>No, Thanks</Button>
            <Button
              onClick={() => {
                setShowAdPrompt(false);
                if (newPageId) navigate(`/adgenerator/${newPageId}`);
              }}
            >
              Yes, Generate Ads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default LandingPageCreator;
