
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThemeOption } from "@/utils/landingPageGenerator";

// Define metadata type for landing page without circular references
export interface PageMetadata {
  generatedContent?: any; // Using any instead of unknown to avoid deep instantiation
  themeOptions?: ThemeOption[];
  selectedThemeIndex?: number;
  mediaType?: string;
  layoutStyle?: string;
}

// Define data schema for landing pages
export interface LandingPageData {
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

// Type for simple form values
export interface LandingPageFormData {
  title: string;
  campaign_type: string;
  industry: string;
  audience: string;
  keywords: string;
}

/**
 * Check for existing drafts for a user
 */
export async function checkForExistingDraft(userId: string) {
  try {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'draft')
      .order('updated_at', { ascending: false })
      .limit(1);
      
    if (error) {
      throw error;
    }
    
    return data && data.length > 0 ? data[0] as LandingPageData : null;
  } catch (error: any) {
    console.error("Error checking for drafts:", error);
    return null;
  }
}

/**
 * Save or update a draft landing page
 */
export async function saveLandingPageDraft(
  userId: string,
  formValues: LandingPageFormData,
  draftId: string | null,
  previewHtml: string | null,
  metadata: PageMetadata
) {
  try {
    // Process keywords into an array
    const keywordsArray = formValues.keywords
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    
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
      
      return { success: true, id: draftId };
    } else {
      // Create new draft
      const { data, error } = await supabase
        .from('landing_pages')
        .insert([{
          user_id: userId,
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
      
      return { success: true, id: data?.[0]?.id || null };
    }
  } catch (error: any) {
    console.error("Error saving draft:", error);
    return { success: false, id: draftId, error };
  }
}

/**
 * Save a landing page as published
 */
export async function publishLandingPage(
  userId: string,
  formValues: LandingPageFormData,
  draftId: string | null,
  previewHtml: string,
  generatedContent: any // Changed from unknown to any
) {
  try {
    // Process keywords into an array
    const keywordsArray = formValues.keywords
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);

    // Add suggested keywords
    const allKeywords = [...keywordsArray];
    if (typeof generatedContent === 'object' && generatedContent !== null && 'keywordSuggestions' in generatedContent) {
      const suggestions = generatedContent.keywordSuggestions as string[];
      allKeywords.push(...suggestions);
    }

    let pageId;

    // Check if we're updating a draft or creating a new page
    if (draftId) {
      // Update existing draft to published
      const { error } = await supabase
        .from('landing_pages')
        .update({
          title: formValues.title,
          campaign_type: formValues.campaign_type,
          industry: formValues.industry,
          audience: formValues.audience,
          initial_keywords: allKeywords,
          html_content: previewHtml,
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', draftId);
        
      if (error) throw error;
      
      pageId = draftId;
    } else {
      // Create new published page
      const { data, error } = await supabase
        .from('landing_pages')
        .insert([{
          user_id: userId,
          title: formValues.title,
          campaign_type: formValues.campaign_type,
          industry: formValues.industry,
          audience: formValues.audience,
          initial_keywords: allKeywords,
          html_content: previewHtml,
          status: 'published'
        }])
        .select();
        
      if (error) throw error;
      
      pageId = data?.[0]?.id;
    }
    
    if (pageId) {
      // Process keywords for the page
      for (const keyword of allKeywords) {
        await supabase.from('keywords').insert({
          page_id: pageId,
          keyword: keyword,
          volume: Math.floor(Math.random() * 5000),
          cpc: parseFloat((Math.random() * 5).toFixed(2))
        });
      }
      
      return { success: true, id: pageId };
    }
    
    return { success: false, error: "Failed to create or update page" };
  } catch (error: any) {
    console.error("Error publishing page:", error);
    return { success: false, error };
  }
}
