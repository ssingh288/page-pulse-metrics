
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { prompt, mode } = await req.json();

    if (!prompt) {
      throw new Error('No prompt provided');
    }

    let systemPrompt = "";
    let userPrompt = prompt;

    // Different system prompts based on the requested mode
    if (mode === "page_optimization") {
      systemPrompt = `You are an expert landing page optimization assistant. Analyze the provided landing page details and generate specific, actionable improvements in JSON format. Focus on headline improvements, call-to-action wording, layout suggestions, content enhancements, and SEO optimization.`;
      
      // Structure the response to be machine-readable
      userPrompt = `${prompt}\n\nProvide your analysis in the following JSON structure:
{
  "headline": { "original": "Current headline", "suggested": "Improved headline", "reason": "Why this is better" },
  "cta": { "original": "Current CTA", "suggested": "Improved CTA", "reason": "Why this is better" },
  "content": [
    { "section": "Section name", "original": "Current content", "suggested": "Improved content", "reason": "Why this is better" }
  ],
  "keywords": [
    { "keyword": "keyword phrase", "relevance": "high/medium/low", "trafficPotential": 85, "difficulty": 43 }
  ],
  "structure": [
    { "suggestion": "Specific layout change", "reason": "Why this would improve conversion" }
  ],
  "trafficEstimate": { "current": "estimated %", "potential": "potential % after changes", "confidence": "high/medium/low" }
}`;
    } 
    else if (mode === "ad_generation") {
      systemPrompt = `You are an expert digital marketing strategist specializing in creating engaging, high-converting ad copy across multiple platforms. Generate platform-specific ad variations based on the provided landing page content.`;
      
      userPrompt = `${prompt}\n\nCreate ad variations for multiple platforms in the following JSON structure:
{
  "facebook": [
    {
      "headline": "Primary headline",
      "description": "Ad copy that's engaging and relevant",
      "cta": "Call to action text",
      "imagePrompt": "Description for AI image generation that would work well with this ad"
    },
    {
      "headline": "Alternative headline",
      "description": "Alternative ad copy",
      "cta": "Call to action text",
      "imagePrompt": "Alternative image description"
    }
  ],
  "instagram": [
    {
      "caption": "Engaging Instagram caption with hashtags",
      "cta": "Call to action text",
      "imagePrompt": "Description for AI image generation optimized for Instagram"
    }
  ],
  "linkedin": [
    {
      "headline": "Professional headline for LinkedIn",
      "description": "Professional ad copy appropriate for LinkedIn audience",
      "cta": "Call to action text",
      "imagePrompt": "Description for professional image"
    }
  ],
  "twitter": [
    {
      "text": "Engaging tweet text under character limit",
      "cta": "Call to action text",
      "imagePrompt": "Description for image that would work with tweet"
    }
  ],
  "google": [
    {
      "headline1": "Primary headline (30 chars max)",
      "headline2": "Secondary headline (30 chars max)",
      "headline3": "Third headline (30 chars max)",
      "description1": "Description line 1 (90 chars max)",
      "description2": "Description line 2 (90 chars max)",
      "imagePrompt": "Description for display ad image"
    }
  ]
}`;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Using a modern model that's more capable and cost-effective
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('OpenAI API error:', data.error.message);
        throw new Error(`OpenAI API error: ${data.error.message}`);
      }

      const result = data.choices?.[0]?.message?.content || "{}";
      
      // Parse the result to ensure it's valid JSON before returning
      const parsedResult = JSON.parse(result);
      
      return new Response(
        JSON.stringify({ result: parsedResult }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error('OpenAI API call failed:', apiError);
      throw new Error(`OpenAI API call failed: ${apiError.message}`);
    }
  } catch (error) {
    console.error('Error in generate-ai-content function:', error);
    
    // Create a fallback response with sample data
    let fallbackResponse = {};
    
    if (req.json && req.json().mode === "page_optimization") {
      fallbackResponse = {
        headline: { 
          original: "Original headline", 
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
            original: "Generic description", 
            suggested: "Join 10,000+ businesses that increased their conversion rates using our platform", 
            reason: "Adds social proof and specific benefits" 
          }
        ],
        keywords: [
          { keyword: "conversion rate optimization", relevance: "high", trafficPotential: 85, difficulty: 43 },
          { keyword: "landing page optimization", relevance: "high", trafficPotential: 72, difficulty: 38 },
          { keyword: "improve website conversions", relevance: "medium", trafficPotential: 65, difficulty: 30 }
        ],
        structure: [
          { suggestion: "Move testimonials above the fold", reason: "Social proof early in the user journey increases trust" },
          { suggestion: "Add progress indicators to forms", reason: "Reduces form abandonment by 28%" }
        ],
        trafficEstimate: { current: "2.5%", potential: "8.7%", confidence: "medium" }
      };
    } else {
      fallbackResponse = {
        facebook: [
          {
            headline: "Double Your Conversions in 30 Days",
            description: "Our proven strategy has helped 10,000+ businesses increase their conversion rates. Try it free for 14 days!",
            cta: "Start Free Trial",
            imagePrompt: "Professional showing increased conversion metrics on a dashboard with a clear upward trend"
          }
        ],
        instagram: [
          {
            caption: "Transform your business results with our conversion optimization platform! 📈 #ConversionRate #MarketingTips #GrowthHacking",
            cta: "Learn More",
            imagePrompt: "Stylish, minimal design showing before/after conversion metrics with vibrant colors"
          }
        ],
        linkedin: [
          {
            headline: "Increase Your ROI with Data-Driven Conversion Optimization",
            description: "Join industry leaders who've seen an average 250% increase in conversion rates using our enterprise platform.",
            cta: "Request Demo",
            imagePrompt: "Professional business setting with analytics dashboard showing improved metrics"
          }
        ],
        twitter: [
          {
            text: "Stop guessing what works. Our platform increased conversion rates by an average of 250% for 10,000+ businesses. See how:",
            cta: "Learn More",
            imagePrompt: "Simple chart showing dramatic conversion improvement with brand colors"
          }
        ],
        google: [
          {
            headline1: "Boost Conversion Rates 250%",
            headline2: "Data-Driven Optimization",
            headline3: "Start Free 14-Day Trial",
            description1: "Join 10,000+ businesses using our proven platform to increase their website conversions.",
            description2: "No credit card required. See results in your first week or your money back.",
            imagePrompt: "Clean, professional banner showing conversion improvement metrics"
          }
        ]
      };
    }
    
    return new Response(
      JSON.stringify({ 
        result: fallbackResponse, 
        error: error.message,
        note: "⚠️ This is sample data. To get real AI-powered suggestions, please set up your OpenAI API key with sufficient credits."
      }),
      { 
        status: 200, // Return 200 even with fallback data
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
