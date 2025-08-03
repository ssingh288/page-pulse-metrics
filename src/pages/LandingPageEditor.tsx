
import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";

const LANDING_PAGE_CSS = `
  body { margin: 0; }
  .center-title { text-align: center; font-size: 2rem; font-weight: bold; margin: 2rem 0; }
  /* Add more of your published page styles here */
`;

const LandingPageEditor = () => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [originalHtml, setOriginalHtml] = useState("");

  useEffect(() => {
    let editor: any;
    const loadPage = async () => {
      // Fetch HTML from Supabase
      const { data, error } = await supabase
        .from("landing_pages")
        .select("html_content")
        .eq("id", id)
        .single();
      const html = data?.html_content || "<h1 class='center-title'>Edit your landing page</h1>";
      setOriginalHtml(html);
      // Initialize GrapesJS
      editor = grapesjs.init({
        container: containerRef.current,
        fromElement: false,
        height: "100vh",
        width: "auto",
        storageManager: false,
        components: html,
        style: LANDING_PAGE_CSS, // for any extra tweaks
        canvas: {
          styles: [
            '/src/index.css', // This is correct for your setup!
          ],
          scripts: []
        }
      });
      editorRef.current = editor;
    };
    loadPage();
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [id]);

  // Save handler
  const handleSave = async (asDraft = false) => {
    const html = editorRef.current.getHtml();
    // Always generate slug from title (fetch title from DB)
    const { data: pageData, error: pageError } = await supabase
      .from("landing_pages")
      .select("title")
      .eq("id", id)
      .single();
    if (pageError || !pageData?.title) {
      alert("Error fetching page title for slug generation.");
      return;
    }
    const slug = pageData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
    // Save HTML, slug, and is_draft
    const { data, error } = await supabase
      .from("landing_pages")
      .update({ html_content: html, is_draft: asDraft ? true : false, slug })
      .eq("id", id)
      .select("slug, is_draft, id, html_content")
      .single();
    console.log("[Editor Save] Updated HTML:", html);
    console.log("[Editor Save] Updated slug:", slug);
    console.log("[Editor Save] Supabase update result:", data, error);
    if (error) {
      alert("Error saving page: " + error.message);
      return;
    }
    if (!asDraft && data?.slug && data.is_draft === false) {
      // Delete all other published rows with the same slug except this one
      await supabase
        .from("landing_pages")
        .delete()
        .eq("slug", data.slug)
        .eq("is_draft", false)
        .not("id", "eq", data.id);
      navigate('/create-page?tab=preview'); // Go back to Preview tab after saving
    } else if (asDraft) {
      alert("Draft saved!");
      navigate('/create-page?tab=preview'); // Go back to Preview tab after saving draft
    } else {
      alert("Error: Could not get published slug after saving.");
    }
  };

  // Reset styles handler
  const handleResetStyles = () => {
    if (editorRef.current && originalHtml) {
      editorRef.current.setComponents(originalHtml);
    }
  };

  return (
    <div>
      <div ref={containerRef} />
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, display: 'flex', gap: 8 }}>
        <button onClick={handleResetStyles} className="bg-gray-300 text-black px-4 py-2 rounded shadow">Reset Styles</button>
        <button onClick={() => handleSave(true)} className="bg-gray-500 text-white px-4 py-2 rounded shadow">Save as Draft</button>
        <button onClick={() => handleSave(false)} className="bg-primary text-white px-4 py-2 rounded shadow">Save</button>
      </div>
    </div>
  );
};

export default LandingPageEditor;
