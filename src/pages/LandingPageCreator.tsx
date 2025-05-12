
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
import { FileText, Image } from "lucide-react";
import { LandingPageForm, LandingPageFormValues } from "@/components/landing-page/LandingPageForm";
import { LandingPagePreview } from "@/components/landing-page/LandingPagePreview";
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

const LandingPageCreator = () => {
  const [generatingPage, setGeneratingPage] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeTab, setActiveTab] = useState("form");
  const [generatedContent, setGeneratedContent] = useState<Record<string, any>>({});
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
        if (draft.metadata) {
          try {
            const metadata = typeof draft.metadata === 'string' 
              ? JSON.parse(draft.metadata) 
              : draft.metadata;
              
            if (metadata.generatedContent) {
              setGeneratedContent(metadata.generatedContent as Record<string, any>);
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
        onSuccess: (html, content, themes) => {
          setPreviewHtml(html);
          setGeneratedContent(content as Record<string, any>);
          setThemeOptions(themes);
          setActiveTab("preview");
          
          // Auto save the draft with the preview content
          autoSaveDraft(values);
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
    
    regenerateContent(
      formValues,
      selectedThemeIndex,
      themeOptions,
      (html, content) => {
        setPreviewHtml(html);
        setGeneratedContent(content);
        setGeneratingPage(false);
        
        // Auto save with the new content
        autoSaveDraft(formValues);
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
  const handleApplyOptimizations = (updatedHtml: string) => {
    setPreviewHtml(updatedHtml);
    
    // Auto save with the optimized content
    autoSaveDraft(formValues);
  };

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
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            {previewHtml && (
              <>
                <LandingPagePreview
                  previewHtml={previewHtml}
                  isGenerating={generatingPage}
                  onRegenerateContent={handleRegenerateContent}
                  onRegenerateTheme={handleRegenerateTheme}
                  onToggleOptimizer={toggleOptimizer}
                  onSavePage={handleSavePage}
                  showOptimizer={showOptimizer}
                  generatedContent={generatedContent}
                />
                
                {showOptimizer && (
                  <DynamicLandingPageOptimizer 
                    htmlContent={previewHtml}
                    pageInfo={{
                      title: formValues.title,
                      audience: formValues.audience,
                      industry: formValues.industry,
                      campaign_type: formValues.campaign_type,
                      keywords: formValues.keywords
                        .split(",")
                        .map(keyword => keyword.trim())
                        .filter(keyword => keyword.length > 0)
                    }}
                    onApplyChanges={handleApplyOptimizations}
                  />
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
