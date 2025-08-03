import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface LandingPageViewProps {
  isDraft?: boolean;
}

const LandingPageView = ({ isDraft }: LandingPageViewProps) => {
  const params = useParams();
  const slug = params.slug as string | undefined;
  const id = params.id as string | undefined;
  const [html, setHtml] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      let data, error;
      if (isDraft && id) {
        // Fetch by id, show draft
        ({ data, error } = await supabase
          .from("landing_pages")
          .select("html_content")
          .eq("id", id)
          .single());
      } else if (slug) {
        // Fetch by slug, show published
        ({ data, error } = await supabase
          .from("landing_pages")
          .select("html_content")
          .eq("slug", slug)
          .eq("is_draft", false)
          .single());
      }
      if (error || !data) {
        setNotFound(true);
        setHtml(null);
      } else {
        setHtml(data.html_content);
        setNotFound(false);
      }
      setLoading(false);
    };
    if ((isDraft && id) || slug) fetchPage();
  }, [slug, id, isDraft]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (notFound) return <div className="p-8 text-center text-red-500 text-xl font-bold">404 - Page Not Found</div>;
  if (!html || html.trim() === "") {
    return <div className="p-8 text-center text-gray-500 text-lg">This landing page has no content yet.</div>;
  }
  return (
    <div className="min-h-screen bg-white">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

// Export default (published) and draft version
export default LandingPageView;
export const DraftLandingPageView = () => <LandingPageView isDraft />; 