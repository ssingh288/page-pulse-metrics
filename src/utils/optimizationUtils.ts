
import { supabase } from "@/integrations/supabase/client";
import { PageOptimizationSuggestion, AdSuggestion } from "./aiService";

// Apply optimization to a landing page
export const applyOptimizationToPage = async (
  pageId: string, 
  updatedHtml: string, 
  suggestionId?: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Update the landing page with optimized HTML
    const { error } = await supabase
      .from("landing_pages")
      .update({ 
        html_content: updatedHtml,
        updated_at: new Date().toISOString()
      })
      .eq("id", pageId);

    if (error) throw error;

    // If we have a specific suggestion ID, mark it as applied
    if (suggestionId) {
      const { error: suggestionError } = await supabase
        .from("ai_suggestions")
        .update({ 
          status: "applied",
          applied_at: new Date().toISOString()
        })
        .eq("id", suggestionId);

      if (suggestionError) throw suggestionError;
    }

    // Log the optimization for analytics
    // Note: 'optimization_history' table must exist in the database
    // If this table doesn't exist, comment out or remove this section
    try {
      await supabase
        .from("optimization_history")
        .insert({
          page_id: pageId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          optimization_type: suggestionId ? "single_suggestion" : "full_optimization",
          original_content: "", // We don't store the full content for privacy/storage reasons
          optimized_content: "" // We don't store the full content for privacy/storage reasons
        });
    } catch (historyError) {
      // Just log the error but don't fail the overall operation
      console.error("Failed to log optimization history:", historyError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error applying optimization:", error);
    return { success: false, error };
  }
};

// Republish a landing page after optimization
export const republishOptimizedPage = async (
  pageId: string
): Promise<{ success: boolean; publishedUrl?: string; error?: any }> => {
  try {
    // In a real app, this would regenerate the published version
    // For demo purposes, we'll just update the published_at timestamp

    // First, get the existing published URL if any
    const { data: pageData, error: fetchError } = await supabase
      .from("landing_pages")
      .select("published_url")
      .eq("id", pageId)
      .single();

    if (fetchError) throw fetchError;

    // If no published URL exists, create one
    let publishedUrl = pageData?.published_url;
    if (!publishedUrl) {
      publishedUrl = `https://pagepulse-${pageId.substring(0, 8)}.example.com`;
    }

    // Update the page with new published date and URL
    const { error } = await supabase
      .from("landing_pages")
      .update({
        published_at: new Date().toISOString(),
        published_url: publishedUrl
      })
      .eq("id", pageId);

    if (error) throw error;

    return { success: true, publishedUrl };
  } catch (error) {
    console.error("Error republishing page:", error);
    return { success: false, error };
  }
};

// Get immediate optimization with traffic reach estimate
export const getImmediateOptimization = (
  htmlContent: string, 
  pageInfo: { 
    title: string; 
    audience: string; 
    industry: string; 
    campaign_type: string; 
    keywords: string[];
  }
): { 
  optimizedHtml: string; 
  trafficReachEstimate: { 
    before: string; 
    after: string; 
    improvement: string; 
    confidence: string;
  } 
} => {
  // This function would normally call an AI service for optimization
  // For demo purposes, we'll simulate optimization by enhancing the HTML
  
  const optimizedHtml = enhanceHtmlContent(htmlContent, pageInfo);
  
  // Generate a traffic reach estimate
  const trafficReachEstimate = {
    before: "35%",
    after: "67%",
    improvement: "91%",
    confidence: "high"
  };
  
  return {
    optimizedHtml,
    trafficReachEstimate
  };
};

// Helper function to enhance HTML content for demo purposes
function enhanceHtmlContent(htmlContent: string, pageInfo: any): string {
  if (!htmlContent) return '';
  
  // Add optimization meta tag for demo
  let optimizedHtml = htmlContent.replace('</head>', 
    `<meta name="ai-optimized" content="true">
     <meta name="optimization-date" content="${new Date().toISOString()}">
     </head>`);
  
  // Enhance title and headlines based on industry and audience
  const titleRegex = /<h1[^>]*>(.*?)<\/h1>/g;
  optimizedHtml = optimizedHtml.replace(titleRegex, (match, title) => {
    return match.replace(title, `${pageInfo.industry} Excellence: Transform Your ${pageInfo.audience}'s Experience Today!`);
  });
  
  // Enhance CTA buttons for better conversion
  const ctaRegex = /<button[^>]*>(.*?)<\/button>/g;
  optimizedHtml = optimizedHtml.replace(ctaRegex, (match, buttonText) => {
    if (buttonText.toLowerCase().includes('sign') || 
        buttonText.toLowerCase().includes('submit') || 
        buttonText.toLowerCase().includes('start')) {
      return match.replace(buttonText, `Start Your ${pageInfo.industry} Journey`);
    }
    return match;
  });
  
  // Add social proof and testimonials section if not present
  if (!optimizedHtml.includes('testimonial') && !optimizedHtml.includes('Testimonial')) {
    const testimonialSection = `
      <section class="testimonials py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-4">What Our Clients Say</h2>
          <div class="row">
            <div class="col-md-4">
              <div class="card mb-4">
                <div class="card-body">
                  <p class="card-text">"This ${pageInfo.industry} solution transformed our business. We saw a 45% increase in conversion rates within the first month."</p>
                  <footer class="blockquote-footer">John D., CEO at ${pageInfo.audience} Solutions</footer>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4">
                <div class="card-body">
                  <p class="card-text">"The team's expertise in ${pageInfo.industry} helped us navigate complex challenges and achieve remarkable results."</p>
                  <footer class="blockquote-footer">Sarah M., Director at Global ${pageInfo.audience}</footer>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4">
                <div class="card-body">
                  <p class="card-text">"I can't recommend this ${pageInfo.campaign_type} solution enough. It's been a game-changer for our organization."</p>
                  <footer class="blockquote-footer">Michael T., ${pageInfo.audience} Specialist</footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    
    optimizedHtml = optimizedHtml.replace('</body>', `${testimonialSection}\n</body>`);
  }
  
  return optimizedHtml;
}

// Mock data generation for the demo
export const generateMockSuggestions = (
  htmlContent: string, 
  pageInfo: { 
    title: string; 
    audience: string; 
    industry: string; 
    campaign_type: string; 
    keywords: string[];
  }
): PageOptimizationSuggestion => {
  // Create mock optimization suggestions based on the page info
  const baseTitle = pageInfo?.title || "Landing Page";
  const industry = pageInfo?.industry || "Technology";
  const audience = pageInfo?.audience || "Professionals";
  
  return {
    headline: {
      original: baseTitle,
      suggested: `${industry} Excellence: Transform Your ${audience}'s Experience Today!`,
      reason: "More compelling headline that creates urgency and speaks directly to the target audience."
    },
    cta: {
      original: "Sign Up Now",
      suggested: `Start Your ${industry} Journey`,
      reason: "Personalized call-to-action that aligns with the industry focus and creates a sense of beginning a valuable journey."
    },
    content: [
      {
        section: "Introduction",
        original: "Welcome to our landing page.",
        suggested: `Welcome to the future of ${industry}. Designed specifically for ${audience} who demand excellence.`,
        reason: "More engaging introduction that highlights industry relevance and speaks to the target audience."
      },
      {
        section: "Benefits",
        original: "We offer many benefits.",
        suggested: `Transform your ${audience} experience with our proven ${industry} solutions. Increase efficiency by 45% and reduce costs by 30%.`,
        reason: "Added specific metrics and benefits that appeal to the target audience in this industry."
      }
    ],
    keywords: [
      {
        keyword: `${industry} solutions`,
        relevance: "high",
        trafficPotential: "15,000/month",
        difficulty: "35",
      },
      {
        keyword: `${industry} for ${audience}`,
        relevance: "high",
        trafficPotential: "8,200/month",
        difficulty: "42",
      },
      {
        keyword: "increase efficiency",
        relevance: "medium",
        trafficPotential: "5,400/month",
        difficulty: "28",
      }
    ],
    structure: [
      {
        suggestion: "Add testimonials section",
        reason: `Adding social proof from other ${audience} will increase conversion rates by approximately 15%.`
      },
      {
        suggestion: "Include FAQ section",
        reason: `${audience} typically have common questions about ${industry} services that should be addressed proactively.`
      }
    ],
    colors: ["#1a73e8", "#34a853", "#fbbc05", "#ea4335", "#ffffff"],
    trafficEstimate: {
      current: "35%",
      potential: "65%",
      confidence: "high"
    }
  };
};

// Generate mock ad suggestions
export const generateMockAdSuggestions = (
  htmlContent: string, 
  pageInfo: { 
    title: string; 
    audience: string; 
    industry: string; 
    campaign_type: string; 
    keywords: string[];
  }
): AdSuggestion => {
  // Create mock ad suggestions based on the page info
  const baseTitle = pageInfo?.title || "Landing Page";
  const industry = pageInfo?.industry || "Technology";
  const audience = pageInfo?.audience || "Professionals";
  
  return {
    facebook: {
      headline: `${industry} Excellence for ${audience}`,
      primary_text: `Transform how your business approaches ${industry}. Our solution helps ${audience} increase efficiency by 45% and reduce costs.\n\nJoin thousands of satisfied clients who've revolutionized their approach.`,
      description: `Specialized ${industry} solutions designed for modern ${audience}.`,
      cta: "Learn More",
      status: "approved"
    },
    instagram: {
      caption: `Ready to transform your ${industry} approach? Our solutions are designed specifically for ${audience} like you.\n\nTap the link in bio to learn how we can help you increase efficiency and stay ahead of the competition.`,
      hashtags: `#${industry} #${audience}Tips #Innovation #BusinessGrowth #Efficiency`,
      status: "pending"
    },
    twitter: {
      tweet_copy: `Transform your ${industry} strategy! Our solution helps ${audience} increase efficiency by 45%. Limited time offer - click to learn more!`,
      hashtags: `#${industry}Tips #${audience} #Innovation`,
      status: "approved"
    }
  };
};
