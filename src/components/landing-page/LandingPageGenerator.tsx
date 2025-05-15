import { generateLandingPageContent, generateEnhancedHtml, ThemeOption } from "@/utils/landingPageGenerator";
import { LandingPageFormData } from "@/services/landingPageService";
import { supabase } from "@/integrations/supabase/client";

interface GenerateLandingPageProps {
  formValues: LandingPageFormData;
  onSuccess: (html: string, content: any, themes: ThemeOption[]) => void;
  onError: (error: Error) => void;
}

/**
 * Generate landing page content based on form values
 */
export function generateLandingPageFromValues({
  formValues,
  onSuccess,
  onError
}: GenerateLandingPageProps) {
  try {
    // Process keywords into an array
    const keywordsArray = formValues.keywords
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);

    // Generate enhanced content using utility
    const { content, themeOptions } = generateLandingPageContent(
      formValues.title, 
      formValues.audience, 
      formValues.industry, 
      formValues.campaign_type,
      keywordsArray
    );
    
    // Generate HTML with the first theme option
    const enhancedHtml = generateEnhancedHtml(
      formValues.title,
      formValues.audience,
      keywordsArray,
      themeOptions[0],
      content
    );
    
    onSuccess(enhancedHtml, content, themeOptions);
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Failed to generate landing page'));
  }
}

/**
 * Regenerate high-quality content with AI but keep the same theme
 */
export async function regenerateContent(
  formValues: LandingPageFormData,
  currentThemeIndex: number,
  themeOptions: ThemeOption[],
  onSuccess: (html: string, content: any) => void,
  onError: (error: Error) => void
) {
  try {
    if (themeOptions.length === 0) {
      onError(new Error('No theme options available'));
      return;
    }
    
    // Process keywords into an array
    const keywordsArray = formValues.keywords
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    
    // Try to use Supabase Edge Function if available for AI-powered content generation
    try {
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-content', {
        body: { 
          prompt: `Generate high-quality landing page content for:
            Title: ${formValues.title}
            Target Audience: ${formValues.audience}
            Industry: ${formValues.industry}
            Campaign Type: ${formValues.campaign_type}`,
          mode: "landing_page_content",
          keywords: keywordsArray
        }
      });

      if (aiError) {
        console.error('AI content generation error:', aiError);
        // Fall back to standard content generation
        fallbackContentGeneration();
        return;
      }

      if (aiData && aiData.content) {
        // If AI content was successfully generated
        const enhancedHtml = generateEnhancedHtml(
          formValues.title,
          formValues.audience,
          keywordsArray,
          themeOptions[currentThemeIndex],
          aiData.content
        );
        
        onSuccess(enhancedHtml, aiData);
        return;
      }
    } catch (e) {
      console.error('Error with AI content generation:', e);
      // Fall back to standard content generation
      fallbackContentGeneration();
    }
    
    function fallbackContentGeneration() {
      // Generate new content using the standard method
      const { content } = generateLandingPageContent(
        formValues.title, 
        formValues.audience, 
        formValues.industry, 
        formValues.campaign_type,
        keywordsArray
      );
      
      // Generate HTML with the same theme but new content
      const enhancedHtml = generateEnhancedHtml(
        formValues.title,
        formValues.audience,
        keywordsArray,
        themeOptions[currentThemeIndex],
        content
      );
      
      onSuccess(enhancedHtml, content);
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Failed to regenerate content'));
  }
}

/**
 * Generate HTML with the next theme option
 */
export function generateWithNextTheme(
  formValues: LandingPageFormData,
  currentThemeIndex: number,
  themeOptions: ThemeOption[],
  generatedContent: any,
  onSuccess: (html: string, newThemeIndex: number) => void,
  onError: (error: Error) => void
) {
  try {
    if (themeOptions.length === 0) {
      onError(new Error('No theme options available'));
      return;
    }
    
    // Rotate to the next theme option
    const nextThemeIndex = (currentThemeIndex + 1) % themeOptions.length;
    
    // Process keywords into an array
    const keywordsArray = formValues.keywords
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    
    // Generate HTML with the next theme option but same content
    const enhancedHtml = generateEnhancedHtml(
      formValues.title,
      formValues.audience,
      keywordsArray,
      themeOptions[nextThemeIndex],
      generatedContent
    );
    
    onSuccess(enhancedHtml, nextThemeIndex);
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Failed to regenerate theme'));
  }
}
