
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

    const { landingPageUrl, audienceType, industry, tone } = await req.json();

    if (!landingPageUrl) {
      throw new Error('No landing page URL provided');
    }

    // Craft a specialized prompt for marketing optimizations
    const systemPrompt = `You are an AI assistant specialized in digital marketing and landing page optimization. 
    Your task is to analyze the landing page content and generate marketing recommendations.`;
    
    const userPrompt = `Given the following inputs:

Landing Page URL: ${landingPageUrl}
Target Audience: ${audienceType || "Not specified"}
Industry: ${industry || "Not specified"}
Desired Tone: ${tone || "professional"}

Analyze the landing page content and generate:

High-Intent Keyword Suggestions:
- Categorized by funnel stages: Awareness, Consideration, Decision.
- Tailored for platforms: Google Search, Display, Facebook, LinkedIn.

Ad Copy Variations:
- Google Search Ads: 3 headlines and 2 descriptions.
- Google Display Ads: 2 banner headlines and 2 short descriptions.
- Facebook/Instagram Ads: 2 primary texts and 2 headline & CTA pairs.
- LinkedIn Ads: 2 InMail intros, bodies, and CTA lines.

A/B Testing Recommendations:
- Suggestions on headlines, CTAs, or visuals to test.
- Based on best practices and marketing trends.

Ensure the content aligns with the specified tone and is optimized for the respective platforms. Include emojis where appropriate for social media platforms to enhance engagement.`;

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
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    const result = data.choices?.[0]?.message?.content || "No marketing suggestions available at this time";

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-ai-marketing function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
