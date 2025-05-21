
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdGenerator } from "@/components/ad-generator/AdGenerator";
import { LandingPageFormValues } from "@/components/landing-page/LandingPageForm";
import { toast } from "sonner";

const AdGeneratorPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [pageContent, setPageContent] = useState("");
  const [formValues, setFormValues] = useState<LandingPageFormValues>({
    title: "",
    description: "",
    audience: "",
    industry: "",
    campaign_type: "",
    keywords: "",
    template: "standard",
    features: []
  });

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        if (!id) {
          setLoading(false);
          return;
        }
        
        const { data: pageData, error: pageError } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('id', id)
          .single();
        
        if (pageError) throw pageError;
        
        if (pageData) {
          setPageContent(pageData.html_content || "");
          
          // Set form values from page data
          setFormValues({
            title: pageData.title || "",
            description: pageData.description || "",
            audience: pageData.audience || "",
            industry: pageData.industry || "",
            campaign_type: pageData.campaign_type || "",
            keywords: pageData.keywords || "",
            template: pageData.template || "standard",
            features: pageData.features || []
          });
        }
      } catch (error: any) {
        console.error("Error fetching page data:", error);
        toast.error("Failed to load page data");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [id]);

  if (loading) {
    return (
      <Layout title="Ad Generator">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Ad Generator">
      <div className="container mx-auto p-4">
        <AdGenerator 
          formValues={formValues} 
          pageContent={pageContent} 
        />
      </div>
    </Layout>
  );
};

export default AdGeneratorPage;
