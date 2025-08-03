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
    const slug = generateSlug(formValues.title);
    // Check for existing draft by user and slug
    const { data: existing, error: findError } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('user_id', userId)
      .eq('slug', slug)
      .eq('is_draft', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    let draftIdToUse = existingDraftId;
    if (existing && existing.id) draftIdToUse = existing.id;
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
      metadata: metadata ? JSON.stringify(metadata) : null,
      slug,
    };
    let result;
    if (draftIdToUse) {
      // Update existing draft
      const { data, error } = await supabase
        .from('landing_pages')
        .update(landingPageData)
        .eq('id', draftIdToUse)
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

// Utility to generate a slug from a title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
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
    const slug = generateSlug(formValues.title);
    // Find the latest draft or published page for this user and slug
    const { data: existing, error: findError } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('user_id', userId)
      .eq('slug', slug)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
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
        : JSON.stringify(generatedContent),
      slug,
    };
    let result;
    if (existing && existing.id) {
      // Update existing draft or published page
      const { data, error } = await supabase
        .from('landing_pages')
        .update(landingPageData)
        .eq('id', existing.id)
        .eq('user_id', userId)
        .select('id, slug')
        .single();
      if (error) throw error;
      result = { success: true, id: data.id, slug: data.slug };
      // Cleanup: delete any other drafts for this user and slug
      await supabase
        .from('landing_pages')
        .delete()
        .eq('user_id', userId)
        .eq('slug', slug)
        .eq('is_draft', true)
        .not('id', 'eq', data.id);
    } else {
      // Create new published page (should not happen if draft logic is correct)
      const { data, error } = await supabase
        .from('landing_pages')
        .insert({
          ...landingPageData,
          created_at: new Date().toISOString()
        })
        .select('id, slug')
        .single();
      if (error) throw error;
      result = { success: true, id: data.id, slug: data.slug };
    }
    return result;
  } catch (error) {
    console.error("Error publishing landing page:", error);
    return { success: false, error: error.message };
  }
}
