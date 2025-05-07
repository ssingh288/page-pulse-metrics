
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Generates AI content suggestions for landing page optimization
 * @param prompt The user's prompt or landing page content to analyze
 * @returns Promise containing the generated suggestions
 */
export const generateAiSuggestions = async (prompt: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-ai-content', {
      body: { prompt }
    });

    if (error) throw new Error(error.message);
    if (!data || !data.result) throw new Error('No suggestions received');
    
    return data.result;
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    toast.error('Failed to generate AI suggestions');
    return 'Unable to generate suggestions at this time. Please try again later.';
  }
};

/**
 * Generates AI-optimized content for various landing page elements
 * @param pageContent Current page content
 * @param elementType The type of element to optimize (headline, button, etc.)
 * @returns Promise containing the optimized content
 */
export const generateOptimizedContent = async (
  pageContent: string, 
  elementType: 'headline' | 'button' | 'paragraph' | 'cta' | 'general'
): Promise<string> => {
  const promptMap = {
    headline: `Optimize this headline for better conversions: "${pageContent}"`,
    button: `Suggest better button text for this CTA: "${pageContent}"`,
    paragraph: `Rewrite this paragraph to be more engaging and persuasive: "${pageContent}"`,
    cta: `Optimize this call-to-action for better conversion: "${pageContent}"`,
    general: `Analyze this landing page content and suggest improvements: "${pageContent}"`
  };

  return generateAiSuggestions(promptMap[elementType]);
};

/**
 * Marketing optimization parameters
 */
interface MarketingOptimizationParams {
  landingPageUrl: string;
  audienceType: string;
  industry: string;
  tone: string;
}

/**
 * Generates comprehensive marketing optimizations for a landing page
 * @param params Marketing optimization parameters
 * @returns Promise containing the marketing optimization suggestions
 */
export const generateMarketingOptimizations = async (
  params: MarketingOptimizationParams
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-ai-marketing', {
      body: params
    });

    if (error) throw new Error(error.message);
    if (!data || !data.result) throw new Error('No marketing suggestions received');
    
    return data.result;
  } catch (error) {
    console.error('Error generating marketing optimizations:', error);
    toast.error('Failed to generate marketing optimizations');
    return 'Unable to generate marketing suggestions at this time. Please try again later.';
  }
};
