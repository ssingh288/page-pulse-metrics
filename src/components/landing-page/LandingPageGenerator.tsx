
import { generateLandingPageContent, generateEnhancedHtml, ThemeOption } from "@/utils/landingPageGenerator";
import { LandingPageFormData } from "@/services/landingPageService";

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
 * Regenerate content but keep the same theme
 */
export function regenerateContent(
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
    
    // Generate new content
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
