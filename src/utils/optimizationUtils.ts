
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageOptimizationSuggestion, AdSuggestion } from "@/utils/aiService";

/**
 * Applies optimization suggestions to a landing page
 */
export const applyOptimizationToPage = async (
  pageId: string,
  updatedHtml: string,
  suggestionId?: string
) => {
  try {
    // Update the landing page HTML
    const { error: updateError } = await supabase
      .from('landing_pages')
      .update({
        html_content: updatedHtml,
        updated_at: new Date().toISOString()
      })
      .eq('id', pageId);

    if (updateError) throw updateError;

    // If a suggestion ID was provided, mark it as applied
    if (suggestionId) {
      const { error: suggestionError } = await supabase
        .from('ai_suggestions')
        .update({
          status: 'applied',
          applied_at: new Date().toISOString()
        })
        .eq('id', suggestionId);

      if (suggestionError) {
        console.error("Error updating suggestion status:", suggestionError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error applying optimization:", error);
    return { success: false, error };
  }
};

/**
 * Republishes a landing page after optimization
 */
export const republishOptimizedPage = async (pageId: string) => {
  try {
    const { data, error } = await supabase
      .from('landing_pages')
      .update({
        published_at: new Date().toISOString()
      })
      .eq('id', pageId)
      .select('published_url')
      .single();

    if (error) throw error;

    return { success: true, publishedUrl: data.published_url };
  } catch (error) {
    console.error("Error republishing page:", error);
    return { success: false, error };
  }
};

/**
 * Saves optimization version history
 */
export const saveOptimizationHistory = async (
  pageId: string,
  userId: string,
  optimizationType: string,
  originalContent: string,
  optimizedContent: string
) => {
  try {
    // Use insert instead of from().insert() to avoid the type error
    const { error } = await supabase
      .from('optimization_history')
      .insert({
        page_id: pageId,
        user_id: userId,
        optimization_type: optimizationType,
        original_content: originalContent,
        optimized_content: optimizedContent
      });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error saving optimization history:", error);
    return { success: false, error };
  }
};

/**
 * Generate mock suggestions for demo purposes
 */
export const generateMockSuggestions = (pageContent: string, pageInfo: any): PageOptimizationSuggestion => {
  return {
    headline: {
      original: "20 hours of crash course on AI",
      suggested: "Master AI in Just 20 Hours: The Ultimate Tech Crash Course",
      reason: "More specific headline with stronger value proposition and keywords"
    },
    cta: {
      original: "Get Started Now",
      suggested: "Secure Your AI Training Spot",
      reason: "Creates urgency and specificity about the next action"
    },
    content: [
      {
        section: "Hero section",
        original: "Perfect solution for people in Tech, students looking for jobs in tech, non IT professionals wanting to upskill, etc.",
        suggested: "Ideal for tech professionals, job-seeking students, and non-IT professionals looking to boost their career with in-demand AI skills.",
        reason: "More specific about benefits and target audience"
      },
      {
        section: "Features",
        original: "Feature 1\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.",
        suggested: "Hands-on AI Projects\nBuild real-world AI applications with step-by-step guidance from industry experts.",
        reason: "Replaces placeholder text with specific course benefits"
      }
    ],
    keywords: [
      { keyword: "ai crash course", relevance: "high", trafficPotential: 85, difficulty: 43 },
      { keyword: "learn artificial intelligence fast", relevance: "high", trafficPotential: 72, difficulty: 38 },
      { keyword: "ai for beginners", relevance: "medium", trafficPotential: 65, difficulty: 30 }
    ],
    structure: [
      { suggestion: "Add testimonials section", reason: "Social proof increases conversion rates by up to 34%" },
      { suggestion: "Include a FAQ section", reason: "Addresses common objections and improves SEO" }
    ],
    trafficEstimate: { current: "2.5%", potential: "8.7%", confidence: "medium" },
    colors: ["#6366f1", "#8b5cf6", "#f59e0b", "#ffffff", "#333333"]
  };
};

/**
 * Generate mock ad suggestions for demo purposes
 */
export const generateMockAdSuggestions = (pageContent: string, pageInfo: any): AdSuggestion => {
  return {
    facebook: [
      {
        headline: "Master AI in Just 20 Hours",
        description: "Our crash course has helped 5,000+ professionals boost their career prospects with in-demand AI skills. Limited spots available!",
        cta: "Enroll Now",
        imagePrompt: "Professional in casual attire working on a laptop with AI visualizations on screen"
      },
      {
        headline: "AI Skills in High Demand",
        description: "Learn practical AI skills in just 20 hours. Perfect for busy professionals wanting to upskill quickly.",
        cta: "Reserve Your Spot",
        imagePrompt: "Split screen showing person before course (confused) and after (confident with AI dashboard)"
      }
    ],
    instagram: [
      {
        caption: "🚀 Transform your career in just 20 hours! Our AI crash course is perfect for tech professionals, students, and career-changers looking to master in-demand skills. Limited spots - link in bio! #AITraining #CareerBoost #TechSkills",
        cta: "Learn More",
        imagePrompt: "Aesthetic modern workspace with laptop showing AI interface, coffee cup, and plants - light gradient background"
      }
    ],
    linkedin: [
      {
        headline: "Accelerate Your Career with AI Skills",
        description: "Join 5,000+ professionals who've boosted their market value with our intensive 20-hour AI crash course. Practical, hands-on learning for immediate application.",
        cta: "Invest In Your Future",
        imagePrompt: "Professional business setting with diverse group learning AI concepts with instructor"
      }
    ],
    twitter: [
      {
        text: "Want to add AI skills to your resume but don't have months to spare? Our 20-hour crash course is designed for busy professionals. Next cohort starts soon! #AISkills #CareerAdvancement",
        cta: "Register Now",
        imagePrompt: "Simple graphic showing career growth chart with AI skills highlighted"
      }
    ],
    google: [
      {
        headline1: "AI Skills in 20 Hours",
        headline2: "Expert-Led Crash Course",
        headline3: "Next Cohort Starting Soon",
        description1: "Learn practical, job-ready AI skills designed for tech professionals and career-changers.",
        description2: "5,000+ graduates. Hands-on projects. Career support. Register today.",
        imagePrompt: "Professional banner showing 'AI Crash Course' with modern tech elements"
      }
    ]
  };
};
