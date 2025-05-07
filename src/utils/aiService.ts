
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
    toast.error('Failed to generate AI suggestions. Please check your OpenAI API key setup.');
    
    // Return fallback content with explanation about OpenAI API key
    return `**AI Optimization Suggestions (Sample)**\n\n⚠️ **Note:** These are sample suggestions. To get real AI-powered suggestions, please:\n\n1. Visit [OpenAI Platform](https://platform.openai.com/account/billing/overview)\n2. Add a payment method to your account\n3. Ensure your API key has sufficient credits\n\n---\n\n### Headline Improvements:\n- Make your headline more specific: "Increase Your Conversion Rate by 27% in 30 Days"\n- Add social proof: "Join 10,000+ Businesses That Boosted Sales with Our Solution"\n- Create urgency: "Limited Time Offer: Transform Your Marketing Results Today"\n\n### Call-to-Action Optimization:\n- Replace generic button text like "Submit" with action-oriented text: "Start My Free Trial"\n- Add benefit-driven microcopy below CTA buttons: "No credit card required"\n- Test button colors that create more contrast with surrounding elements\n\n### Content Enhancement:\n- Break up long paragraphs into shorter, more digestible chunks\n- Add bullet points to highlight key benefits and features\n- Incorporate customer testimonials closer to decision points\n\n### SEO Recommendations:\n- Focus on these high-intent keywords: "affordable marketing automation", "best lead generation tools", "marketing ROI calculator"\n- Improve meta description to include primary keywords and a clear value proposition\n- Add schema markup for better rich snippet opportunities\n\n### A/B Testing Ideas:\n- Test a video explainer against your current hero section\n- Compare a long-form page with a shorter, more focused version\n- Experiment with different social proof formats (logos vs. testimonials vs. case study statistics)`;
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
