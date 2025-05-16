import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  Loader2,
  Save,
  Eye,
  ArrowLeft,
  Upload,
  Code,
  PanelLeft,
  Sparkles,
  ExternalLink
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import DynamicLandingPageOptimizer from '@/components/DynamicLandingPageOptimizer';

interface LandingPage {
  id: string;
  title: string;
  html_content: string;
  published_url: string | null;
  published_at: string | null;
}

const LandingPageEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);
  
  // Add state for AI optimization
  const [optimizerData, setOptimizerData] = useState({
    title: "",
    audience: "",
    industry: "",
    campaign_type: "",
    keywords: [] as string[],
  });

  useEffect(() => {
    const fetchPage = async () => {
      try {
        if (!user || !id) return;
        
        setLoading(true);
        
        const { data, error } = await supabase
          .from('landing_pages')
          .select('id, title, html_content, published_url, published_at')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setPage(data);
        setHtmlContent(data.html_content || "");
      } catch (error: any) {
        toast.error(`Error loading page: ${error.message}`);
        navigate('/pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id, user, navigate]);

  useEffect(() => {
    // Set up optimizer data from page
    if (page) {
      setOptimizerData({
        title: page.title,
        audience: "General",
        industry: "Technology",
        campaign_type: "Lead Generation",
        keywords: [],
      });
    }
  }, [page]);

  const handleSave = async () => {
    try {
      if (!user || !id) return;
      
      setSaving(true);
      
      const { error } = await supabase
        .from('landing_pages')
        .update({
          html_content: htmlContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Changes saved successfully");
    } catch (error: any) {
      toast.error(`Error saving changes: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      if (!user || !id) return;
      
      setPublishing(true);
      
      // In a real app, this would upload the page to a hosting service
      // and return a URL. For now, we'll simulate it.
      const publishedUrl = `https://pagepulse-${id.slice(0, 8)}.example.com`;
      
      const { error } = await supabase
        .from('landing_pages')
        .update({
          published_url: publishedUrl,
          published_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setPage(prev => {
        if (!prev) return null;
        return {
          ...prev,
          published_url: publishedUrl,
          published_at: new Date().toISOString()
        };
      });
      
      toast.success("Page published successfully");
    } catch (error: any) {
      toast.error(`Error publishing page: ${error.message}`);
    } finally {
      setPublishing(false);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: htmlContent,
    onUpdate: ({ editor }) => {
      setHtmlContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && htmlContent !== editor.getHTML()) {
      editor.commands.setContent(htmlContent || '', false);
    }
  }, [htmlContent]);

  // Debug: log editor and htmlContent changes
  useEffect(() => {
    console.log('Tiptap editor instance:', editor);
    console.log('htmlContent:', htmlContent);
  }, [editor, htmlContent]);

  // Function to open preview in a new tab
  const openPreviewInNewTab = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(htmlContent);
      previewWindow.document.title = 'Landing Page Preview';
      previewWindow.document.close();
    }
  };

  // Function to handle AI optimizations
  const handleAIOptimize = () => {
    setShowOptimizer(true);
  };

  // Function to apply optimizations
  const handleApplyOptimizations = (updatedHtml: string) => {
    setHtmlContent(updatedHtml);
    setShowOptimizer(false);
    toast.success("AI optimizations applied successfully!");
  };

  if (loading) {
    return (
      <Layout title="Editor">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout title="Editor">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-4">Page not found</h3>
          <Button onClick={() => navigate('/pages')} size="lg" className="mt-4 px-8 py-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
          </Button>
        </div>
      </Layout>
    );
  }

  const openPageInNewTab = () => {
    if (page?.published_url) {
      window.open(page.published_url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error("This page has not been published yet");
    }
  };

  return (
    <Layout title={`Editing: ${page?.title || ''}`}>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/pages')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptimizer(true)}
              id="radix-:r0:-trigger-optimize"
            >
              <Sparkles className="mr-2 h-4 w-4" /> AI Optimize
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Page Preview</DialogTitle>
                  <DialogDescription>
                    This is how your page will look when published.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mb-2">
                  <span 
                    className="text-xs text-muted-foreground px-2 py-1 bg-primary/5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={openPreviewInNewTab}
                  >
                    Open in new tab
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </span>
                </div>
                <div className="border rounded-md">
                  <iframe
                    title="Preview"
                    srcDoc={htmlContent}
                    className="w-full h-[70vh]"
                    style={{ border: 'none' }}
                  />
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
            
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {page.published_at ? "Update" : "Publish"}
            </Button>
            
            {page.published_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={openPageInNewTab}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Open
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="editor" className="w-full">
          <TabsList>
            <TabsTrigger value="editor" className="flex items-center">
              <Code className="mr-2 h-4 w-4" /> HTML Editor
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center">
              <PanelLeft className="mr-2 h-4 w-4" /> Visual Editor
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <Card>
              <CardContent className="p-4 space-y-4">
                <textarea
                  value={htmlContent}
                  onChange={e => setHtmlContent(e.target.value)}
                  className="w-full min-h-[400px] font-mono p-4 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visual">
            <Card>
              <CardContent className="p-4">
                <div className="text-center p-12 border-2 border-dashed rounded-md">
                  <h3 className="text-lg font-medium mb-2">Visual Editor Coming Soon</h3>
                  <p className="text-muted-foreground">A full drag-and-drop visual editor is in development and will be available in a future update.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {showOptimizer && (
          <Dialog open={showOptimizer} onOpenChange={setShowOptimizer}>
            <DialogContent className="max-w-7xl max-h-[90vh]">
              <DynamicLandingPageOptimizer
                htmlContent={htmlContent}
                pageInfo={{
                  title: optimizerData.title,
                  audience: optimizerData.audience,
                  industry: optimizerData.industry,
                  campaign_type: optimizerData.campaign_type,
                  keywords: optimizerData.keywords,
                }}
                onApplyChanges={handleApplyOptimizations}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default LandingPageEditor;
