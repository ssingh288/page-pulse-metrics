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
  whatsapp?: {
    message: string;
    status?: string;
  };
}

export interface ContentSynthesis {
  synthesizedContent: string;
  updatedKeywords: string[];
  conversionEstimate: {
    before: string;
    after: string;
    improvement: string;
  };
  keyImprovements: Array<{
    area: string;
    benefit: string;
  }>;
  seoScore: {
    before: string;
    after: string;
  };
}

export interface DesignOption {
  id: string;
  name: string;
  description: string;
  colorScheme: string[];
  layoutStructure: string;
  fontPairings: {
    heading: string;
    body: string;
  };
  cta: {
    style: string;
    color: string;
    position: string;
  };
  preview: string; // HTML preview snippet or description
  mobileOptimized: boolean;
  conversionFocus: string; // Which aspect is emphasized for conversion
}

export interface DesignOptions {
  options: DesignOption[];
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
      },
      whatsapp: {
        message: "Try our platform for instant results!",
        status: "approved"
      }
    };
  }
};

/**
 * Synthesizes multiple content suggestions into a single optimized version
 * @param pageContent The original HTML content of the landing page
 * @param suggestions Array of optimization suggestions to synthesize
 * @param pageInfo Additional information about the page
 * @returns Promise containing synthesized content
 */
export const synthesizeContentSuggestions = async (
  pageContent: string,
  suggestions: PageOptimizationSuggestion[],
  pageInfo: {
    title: string;
    audience: string;
    industry: string;
    campaign_type: string;
    keywords: string[];
  }
): Promise<ContentSynthesis> => {
  try {
    // Extract relevant information from suggestions
    const headlineSuggestions = suggestions.map(s => s.headline?.suggested).filter(Boolean);
    const ctaSuggestions = suggestions.map(s => s.cta?.suggested).filter(Boolean);
    const contentSuggestions = suggestions.flatMap(s => s.content?.map(c => c.suggested) || []);
    const allKeywords = suggestions.flatMap(s => s.keywords?.map(k => k.keyword) || []);
    
    // Extract unique keywords for improved targeting
    const uniqueKeywords = [...new Set(allKeywords)];
    
    const prompt = `
    I need you to synthesize multiple content optimization suggestions into a single, cohesive, optimized version of this page.
    
    Original Page Content:
    ${pageContent}
    
    Page Information:
    Title: ${pageInfo.title}
    Target Audience: ${pageInfo.audience}
    Industry: ${pageInfo.industry}
    Campaign Type: ${pageInfo.campaign_type}
    Current Keywords: ${pageInfo.keywords.join(', ')}
    
    Headline Suggestions:
    ${headlineSuggestions.join('\n')}
    
    CTA Suggestions:
    ${ctaSuggestions.join('\n')}
    
    Content Suggestions:
    ${contentSuggestions.join('\n\n')}
    
    Potential Keywords to Target:
    ${uniqueKeywords.join(', ')}
    
    Please create a synthesized version that combines the best elements from all suggestions while ensuring consistency, improved conversion potential, and SEO performance.
    `;

    const { data, error } = await supabase.functions.invoke('generate-ai-content', {
      body: { prompt, mode: "content_synthesis", keywords: pageInfo.keywords }
    });

    if (error) throw new Error(error.message);
    if (!data || !data.result) throw new Error('No synthesized content received');
    
    return data.result as ContentSynthesis;
  } catch (error) {
    console.error('Error synthesizing content:', error);
    toast.error('Failed to synthesize content suggestions');
    
    // Return fallback sample data
    return {
      synthesizedContent: pageContent,
      updatedKeywords: pageInfo.keywords,
      conversionEstimate: {
        before: "3.2%",
        after: "5.8%",
        improvement: "81%"
      },
      keyImprovements: [
        { area: "Headline", benefit: "Increased clarity and conversion focus" },
        { area: "CTA", benefit: "More compelling action triggers" },
        { area: "Content Structure", benefit: "Improved readability and engagement" }
      ],
      seoScore: {
        before: "65",
        after: "82"
      }
    };
  }
};

/**
 * Generates three distinct design options for a landing page
 * @param pageContent The HTML content of the landing page
 * @param pageInfo Additional information about the page
 * @returns Promise containing design options
 */
export const generateDesignOptions = async (
  pageContent: string,
  pageInfo: {
    title: string;
    audience: string;
    industry: string;
    campaign_type: string;
    keywords: string[];
  }
): Promise<DesignOptions> => {
  try {
    const prompt = `
    Create three distinct design options for this landing page:
    
    Title: ${pageInfo.title}
    Target Audience: ${pageInfo.audience}
    Industry: ${pageInfo.industry}
    Campaign Type: ${pageInfo.campaign_type}
    Keywords: ${pageInfo.keywords.join(', ')}
    
    Page Content:
    ${pageContent}
    
    For each design option, provide:
    1. A name and brief description
    2. Color scheme (provide hex codes)
    3. Layout structure
    4. Font pairings
    5. CTA design and positioning
    6. A brief HTML snippet or description of how the design would look
    7. Focus on mobile optimization
    8. Conversion-focused elements
    
    Make each option distinct in style but optimized for the target audience and campaign goals.
    `;

    const { data, error } = await supabase.functions.invoke('generate-ai-content', {
      body: { prompt, mode: "design_options" }
    });

    if (error) throw new Error(error.message);
    if (!data || !data.result) throw new Error('No design options received');
    
    return data.result as DesignOptions;
  } catch (error) {
    console.error('Error generating design options:', error);
    toast.error('Failed to generate design options');
    
    // Return fallback sample data
    return {
      options: [
        {
          id: "minimal",
          name: "Minimal Modern",
          description: "Clean, minimalist design with ample white space and strategic use of color to highlight key elements",
          colorScheme: ["#ffffff", "#f8f9fa", "#212529", "#0d6efd"],
          layoutStructure: "Single column with clear sections and minimal distractions",
          fontPairings: {
            heading: "Montserrat",
            body: "Open Sans"
          },
          cta: {
            style: "Simple rounded button with subtle hover effect",
            color: "#0d6efd",
            position: "After each major value proposition"
          },
          preview: "Minimalist design with focused attention on content and clear CTA buttons",
          mobileOptimized: true,
          conversionFocus: "Content clarity and streamlined user journey"
        },
        {
          id: "bold",
          name: "Bold Impact",
          description: "High-contrast design with bold typography and striking visuals to create immediate impact",
          colorScheme: ["#000000", "#ffffff", "#ff3366", "#2d2d2d"],
          layoutStructure: "Bold hero section with alternating content blocks",
          fontPairings: {
            heading: "Playfair Display",
            body: "Roboto"
          },
          cta: {
            style: "Large, high-contrast buttons with bold text",
            color: "#ff3366",
            position: "Prominent placement throughout the page"
          },
          preview: "Bold, attention-grabbing design with strong visual hierarchy",
          mobileOptimized: true,
          conversionFocus: "Visual impact and emotional response"
        },
        {
          id: "professional",
          name: "Professional Trust",
          description: "Sophisticated design that establishes credibility and trust with a professional aesthetic",
          colorScheme: ["#f8f9fa", "#e9ecef", "#343a40", "#007bff", "#28a745"],
          layoutStructure: "Multi-column layout with clear sections for different content types",
          fontPairings: {
            heading: "Merriweather",
            body: "Source Sans Pro"
          },
          cta: {
            style: "Professional buttons with subtle gradients and clear labels",
            color: "#007bff",
            position: "Strategically placed after trust indicators"
          },
          preview: "Professional layout with emphasis on credibility elements and social proof",
          mobileOptimized: true,
          conversionFocus: "Trust building and authority establishment"
        }
      ]
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

/**
 * Applies synthesized content to HTML content
 * @param htmlContent Current HTML content
 * @param synthesis Synthesized content and improvements
 * @returns Updated HTML content with synthesized improvements applied
 */
export const applySynthesizedContentToHTML = (
  htmlContent: string,
  synthesis: ContentSynthesis
): string => {
  // In a real implementation, this would need more sophisticated parsing and replacement
  // For now, we're returning the synthesized content directly
  return synthesis.synthesizedContent;
};

/**
 * Applies a design option to HTML content
 * @param htmlContent Current HTML content
 * @param design Design option to apply
 * @returns Updated HTML content with design changes applied
 */
export const applyDesignToHTML = (
  htmlContent: string,
  design: DesignOption
): string => {
  // In a real implementation, this would involve complex HTML/CSS transformations
  // For now, we're simulating it by adding some inline styles
  
  let updatedHTML = htmlContent;
  
  // Apply color scheme
  const primaryColor = design.colorScheme[0] || '#ffffff';
  const secondaryColor = design.colorScheme[1] || '#f8f9fa';
  const textColor = design.colorScheme[2] || '#212529';
  const accentColor = design.colorScheme[3] || '#0d6efd';
  
  // Add inline styles to simulate design changes
  updatedHTML = `
    <style>
      :root {
        --primary-color: ${primaryColor};
        --secondary-color: ${secondaryColor};
        --text-color: ${textColor};
        --accent-color: ${accentColor};
      }
      
      body {
        font-family: ${design.fontPairings.body}, sans-serif;
        color: var(--text-color);
        background-color: var(--primary-color);
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: ${design.fontPairings.heading}, serif;
      }
      
      .btn, button[type="submit"], a.button {
        background-color: var(--accent-color);
        border-color: var(--accent-color);
        color: white;
      }
    </style>
    ${updatedHTML}
  `;
  
  return updatedHTML;
};

// Helper function to escape special characters in strings for use in RegExp
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
