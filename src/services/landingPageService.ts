
import { LandingPageFormValues } from "@/components/landing-page/LandingPageForm";
import { ThemeOption } from "@/utils/landingPageGenerator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LandingPageData {
  title: string;
  audience: string;
  industry: string;
  campaign_type: string;
  initial_keywords: string[];
  html_content: string;
  metadata?: string; // To store JSON stringified metadata
  is_draft?: boolean;
  generated_content?: string;
}

export interface LandingPageFormData {
  title: string;
  audience: string;
  industry: string;
  campaign_type: string;
  keywords: string;
}

// Fix for circular reference by using Record instead of "any"
export interface PageMetadata {
  generatedContent: Record<string, unknown>; // Using Record to avoid circular reference
  themeOptions: ThemeOption[];
  selectedThemeIndex: number;
  mediaType?: string;
  layoutStyle?: string;
}

export async function checkForExistingDraft(userId: string) {
  try {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('user_id', userId)
      .eq('is_draft', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking for existing draft:", error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error("Error checking for existing draft:", error);
    return null;
  }
}

export async function saveLandingPageDraft(
  userId: string,
  formValues: LandingPageFormValues,
  existingDraftId: string | null,
  htmlContent: string = "",
  metadata: PageMetadata | null = null
) {
  try {
    // Process keywords into an array
    const keywordsArray = formValues.keywords
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
      
    const landingPageData = {
      title: formValues.title,
      audience: formValues.audience,
      industry: formValues.industry,
      campaign_type: formValues.campaign_type,
      initial_keywords: keywordsArray,
      html_content: htmlContent,
      is_draft: true,
      user_id: userId,
      updated_at: new Date().toISOString(),
      metadata: metadata ? JSON.stringify(metadata) : null
    };
    
    let result;
    
    if (existingDraftId) {
      // Update existing draft
      const { data, error } = await supabase
        .from('landing_pages')
        .update(landingPageData)
        .eq('id', existingDraftId)
        .eq('user_id', userId)
        .select('id')
        .single();
        
      if (error) throw error;
      
      result = { success: true, id: data.id };
    } else {
      // Create new draft
      const { data, error } = await supabase
        .from('landing_pages')
        .insert({
          ...landingPageData,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      result = { success: true, id: data.id };
    }
    
    return result;
  } catch (error) {
    console.error("Error saving landing page draft:", error);
    return { success: false, error: error.message };
  }
}

export async function publishLandingPage(
  userId: string,
  formValues: LandingPageFormValues,
  existingPageId: string | null,
  htmlContent: string,
  generatedContent: Record<string, unknown>
) {
  try {
    // Process keywords into an array
    const keywordsArray = formValues.keywords
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
      
    const landingPageData = {
      title: formValues.title,
      audience: formValues.audience,
      industry: formValues.industry,
      campaign_type: formValues.campaign_type,
      initial_keywords: keywordsArray,
      html_content: htmlContent,
      is_draft: false,
      user_id: userId,
      updated_at: new Date().toISOString(),
      generated_content: typeof generatedContent === 'string' 
        ? generatedContent 
        : JSON.stringify(generatedContent)
    };
    
    let result;
    
    if (existingPageId) {
      // Update existing page
      const { data, error } = await supabase
        .from('landing_pages')
        .update(landingPageData)
        .eq('id', existingPageId)
        .eq('user_id', userId)
        .select('id')
        .single();
        
      if (error) throw error;
      
      result = { success: true, id: data.id };
    } else {
      // Create new page
      const { data, error } = await supabase
        .from('landing_pages')
        .insert({
          ...landingPageData,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      result = { success: true, id: data.id };
    }
    
    return result;
  } catch (error) {
    console.error("Error publishing landing page:", error);
    return { success: false, error: error.message };
  }
}
