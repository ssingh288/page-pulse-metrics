
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

    // Customize system message based on the mode
    let systemMessage = 'You are an AI assistant specialized in content generation.';
    
    if (mode === 'landing_page_content') {
      systemMessage = 'You are an AI assistant specialized in creating high-converting landing page content. You create compelling headlines, persuasive body copy, effective calls to action, and structure content for maximum impact. Your content is optimized for both user experience and conversion.';
    } else if (mode === 'page_optimization') {
      systemMessage = 'You are an AI assistant specialized in landing page optimization. You analyze landing pages and provide structured recommendations for improving conversion rates, user engagement, and SEO performance.';
    } else if (mode === 'ad_generation') {
      systemMessage = 'You are an AI assistant specialized in creating platform-specific ad content based on landing pages. You create optimized ad variations for different platforms maintaining brand consistency while leveraging platform-specific best practices.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    const content = data.choices?.[0]?.message?.content || "No content available at this time";

    // Try to parse the response based on the mode
    if (mode === 'landing_page_content') {
      // For landing page content, return the generated content
      return new Response(
        JSON.stringify({ content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (mode === 'page_optimization' || mode === 'ad_generation') {
      // For structured data responses, try to parse the JSON
      try {
        const parsedContent = JSON.parse(content);
        return new Response(
          JSON.stringify({ result: parsedContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        // If parsing fails, return the raw content
        return new Response(
          JSON.stringify({ result: content }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Default response
    return new Response(
      JSON.stringify({ result: content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-ai-content function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
