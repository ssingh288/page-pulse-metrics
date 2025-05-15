import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types for structured responses
export interface PageOptimizationSuggestion {
  headline?: {
    original: string;
    suggested: string;
    reason: string;
  };
  cta?: {
    original: string;
    suggested: string;
    reason: string;
  };
  content?: Array<{
    section: string;
    original: string;
    suggested: string;
    reason: string;
  }>;
  keywords?: Array<{
    keyword: string;
    relevance: "high" | "medium" | "low";
    trafficPotential: string; // Changed from number to string to match usage
    difficulty: string; // Changed from number to string to match usage
  }>;
  structure?: Array<{
    suggestion: string;
    reason: string;
  }>;
  trafficEstimate?: {
    current: string;
    potential: string;
    confidence: "high" | "medium" | "low";
  };
  colors?: string[];
}

export interface AdSuggestion {
  facebook?: {
    headline: string;
    primary_text: string;
    description: string;
    cta: string;
    status?: string;
  };
  instagram?: {
    caption: string;
    hashtags: string;
    status?: string;
  };
  twitter?: {
    tweet_copy: string;
    hashtags: string;
    status?: string;
  };
  linkedin?: {
    headline: string;
    description: string;
    cta: string;
  };
  google?: {
    headline1: string;
    headline2: string;
    headline3: string;
    description1: string;
    description2: string;
  };
}

/**
 * Generates AI content suggestions for landing page optimization
 * @param prompt The user's prompt or landing page content to analyze
 * @returns Promise containing the generated suggestions
 */
export const generateAiSuggestions = async (prompt: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-ai-content', {
      body: { prompt, mode: "general" }
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

/**
 * Generates structured optimization suggestions for a landing page
 * @param pageContent The HTML content of the landing page
 * @param pageInfo Additional information about the page (title, audience, etc.)
 * @returns Promise containing structured optimization suggestions
 */
export const generatePageOptimizations = async (
  pageContent: string,
  pageInfo: {
    title: string;
    audience: string;
    industry: string;
    campaign_type: string;
    keywords: string[];
  }
): Promise<PageOptimizationSuggestion> => {
  try {
    const prompt = `
    I need optimization suggestions for this landing page:

    Title: ${pageInfo.title}
    Target Audience: ${pageInfo.audience}
    Industry: ${pageInfo.industry}
    Campaign Type: ${pageInfo.campaign_type}
    Keywords: ${pageInfo.keywords.join(', ')}
    
    Page Content:
    ${pageContent}
    
    Please provide detailed optimization suggestions to improve conversion rates, user engagement, and SEO performance.
    `;

    const { data, error } = await supabase.functions.invoke('generate-ai-content', {
      body: { prompt, mode: "page_optimization" }
    });

    if (error) throw new Error(error.message);
    if (!data || !data.result) throw new Error('No optimization data received');
    
    return data.result as PageOptimizationSuggestion;
  } catch (error) {
    console.error('Error generating page optimizations:', error);
    toast.error('Failed to generate page optimizations. Please check your OpenAI API key setup.');
    
    // Return fallback sample data
    return {
      headline: { 
        original: "Your original headline", 
        suggested: "Boost Your Conversion Rate by 250% With Our Proven Strategy", 
        reason: "More specific, includes a metric to build credibility" 
      },
      cta: { 
        original: "Submit", 
        suggested: "Start My Free Trial", 
        reason: "Action-oriented, personal, and emphasizes the free aspect" 
      },
      content: [
        { 
          section: "Hero section", 
          original: "Your current content", 
          suggested: "Join 10,000+ businesses that increased their conversion rates using our platform", 
          reason: "Adds social proof and specific benefits" 
        }
      ],
      keywords: [
        { keyword: "conversion rate optimization", relevance: "high", trafficPotential: "85", difficulty: "43" },
        { keyword: "landing page optimization", relevance: "high", trafficPotential: "72", difficulty: "38" },
        { keyword: "improve website conversions", relevance: "medium", trafficPotential: "65", difficulty: "30" }
      ],
      structure: [
        { suggestion: "Move testimonials above the fold", reason: "Social proof early in the user journey increases trust" },
        { suggestion: "Add progress indicators to forms", reason: "Reduces form abandonment by 28%" }
      ],
      trafficEstimate: { current: "2.5%", potential: "8.7%", confidence: "medium" }
    };
  }
};

/**
 * Generates platform-specific ad suggestions based on landing page content
 * @param pageContent The HTML content of the landing page
 * @param pageInfo Additional information about the page
 * @returns Promise containing structured ad suggestions for different platforms
 */
export const generateAdSuggestions = async (
  pageContent: string,
  pageInfo: {
    title: string;
    audience: string;
    industry: string;
    campaign_type: string;
    keywords: string[];
  }
): Promise<AdSuggestion> => {
  try {
    const prompt = `
    Create platform-specific ad variations for this landing page:

    Title: ${pageInfo.title}
    Target Audience: ${pageInfo.audience}
    Industry: ${pageInfo.industry}
    Campaign Type: ${pageInfo.campaign_type}
    Keywords: ${pageInfo.keywords.join(', ')}
    
    Page Content:
    ${pageContent}
    
    Please create optimal ad content for Facebook, Instagram, LinkedIn, Twitter and Google ads.
    `;

    const { data, error } = await supabase.functions.invoke('generate-ai-content', {
      body: { prompt, mode: "ad_generation" }
    });

    if (error) throw new Error(error.message);
    if (!data || !data.result) throw new Error('No ad data received');
    
    return data.result as AdSuggestion;
  } catch (error) {
    console.error('Error generating ad suggestions:', error);
    toast.error('Failed to generate ad suggestions. Please check your OpenAI API key setup.');
    
    // Return fallback sample data
    return {
      facebook: {
        headline: "Double Your Conversions in 30 Days",
        primary_text: "Our proven strategy has helped 10,000+ businesses increase their conversion rates. Try it free for 14 days!",
        description: "Our proven strategy has helped 10,000+ businesses increase their conversion rates. Try it free for 14 days!",
        cta: "Start Free Trial",
      },
      instagram: {
        caption: "Transform your business results with our conversion optimization platform! 📈 #ConversionRate #MarketingTips #GrowthHacking",
        hashtags: "#ConversionRate #MarketingTips #GrowthHacking",
        status: "approved"
      },
      twitter: {
        tweet_copy: "Stop guessing what works. Our platform increased conversion rates by an average of 250% for 10,000+ businesses. See how:",
        hashtags: "#ConversionRate #MarketingTips",
        status: "approved"
      },
      linkedin: {
        headline: "Increase Your ROI with Data-Driven Conversion Optimization",
        description: "Join industry leaders who've seen an average 250% increase in conversion rates using our enterprise platform.",
        cta: "Request Demo",
      },
      google: {
        headline1: "Boost Conversion Rates 250%",
        headline2: "Data-Driven Optimization",
        headline3: "Start Free 14-Day Trial",
        description1: "Join 10,000+ businesses using our proven platform to increase their website conversions.",
        description2: "No credit card required. See results in your first week or your money back.",
      }
    };
  }
};

/**
 * Applies AI suggestions to HTML content
 * @param htmlContent Current HTML content
 * @param suggestions Optimization suggestions to apply
 * @returns Updated HTML content with suggestions applied
 */
export const applyOptimizationsToHTML = (
  htmlContent: string,
  suggestions: PageOptimizationSuggestion
): string => {
  let updatedHTML = htmlContent;
  
  // Apply headline changes if available
  if (suggestions.headline && suggestions.headline.original && suggestions.headline.suggested) {
    updatedHTML = updatedHTML.replace(
      new RegExp(escapeRegExp(suggestions.headline.original), 'g'),
      suggestions.headline.suggested
    );
  }
  
  // Apply CTA changes if available
  if (suggestions.cta && suggestions.cta.original && suggestions.cta.suggested) {
    updatedHTML = updatedHTML.replace(
      new RegExp(escapeRegExp(suggestions.cta.original), 'g'),
      suggestions.cta.suggested
    );
  }
  
  // Apply content changes if available
  if (suggestions.content && suggestions.content.length > 0) {
    suggestions.content.forEach(contentChange => {
      if (contentChange.original && contentChange.suggested) {
        updatedHTML = updatedHTML.replace(
          new RegExp(escapeRegExp(contentChange.original), 'g'),
          contentChange.suggested
        );
      }
    });
  }
  
  return updatedHTML;
};

// Helper function to escape special characters in strings for use in RegExp
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
