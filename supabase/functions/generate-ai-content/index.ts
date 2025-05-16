
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

    const { prompt, mode, keywords, depth } = await req.json();

    if (!prompt) {
      throw new Error('No prompt provided');
    }

    // Choose system prompt based on mode
    let systemPrompt = 'You are an AI assistant specialized in content generation.';
    let model = 'gpt-4o-mini'; // Default model (cheaper and faster)

    if (mode === 'page_optimization') {
      systemPrompt = 'You are an AI specialist in landing page conversion optimization and SEO.';
      model = 'gpt-4o'; // Use more capable model for in-depth analysis
    } else if (mode === 'ad_generation') {
      systemPrompt = 'You are an AI expert in digital marketing and ad creative optimization.';
    } else if (mode === 'ai_optimize') {
      systemPrompt = `You are a leading AI expert in landing page optimization, conversion rate optimization, and SEO. 
      You provide detailed, structured analysis and suggestions to improve web pages for better performance, higher conversion rates, and improved search engine rankings.`;
      model = 'gpt-4o'; // Use more capable model for in-depth analysis
    } else if (mode === 'content_synthesis') {
      systemPrompt = `You are a master content synthesizer with exceptional skills in combining multiple optimization ideas into one cohesive, highly effective strategy. 
      Your expertise is in taking various content suggestions and producing a unified, optimized version that captures the best elements from each.`;
      model = 'gpt-4o'; // Use more capable model for synthesis
    } else if (mode === 'design_options') {
      systemPrompt = `You are a UI/UX expert specializing in landing page design. 
      Create three distinct design options with different aesthetics, color schemes, and layouts, while maintaining brand consistency and conversion focus.`;
      model = 'gpt-4o'; // Use more capable model for design
    }

    // If depth is set to deep, use more capable model for more thorough analysis
    if (depth === 'deep') {
      model = 'gpt-4o';
    }

    // Craft response format based on mode
    let responseFormat = {};
    if (mode === 'page_optimization') {
      responseFormat = {
        type: "json_object"
      };
    } else if (mode === 'ad_generation') {
      responseFormat = {
        type: "json_object"
      };
    } else if (mode === 'ai_optimize') {
      responseFormat = {
        type: "json_object"
      };
    } else if (mode === 'content_synthesis') {
      responseFormat = {
        type: "json_object"
      };
    } else if (mode === 'design_options') {
      responseFormat = {
        type: "json_object"
      };
    }

    // Add keywords context if available
    let keywordsContext = '';
    if (keywords && Array.isArray(keywords) && keywords.length > 0) {
      keywordsContext = `\nCurrent Keywords: ${keywords.join(', ')}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt + keywordsContext },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    let result;
    try {
      // If responseFormat is specified, try to parse the content as JSON
      if (Object.keys(responseFormat).length > 0) {
        result = JSON.parse(data.choices[0].message.content);
      } else {
        result = data.choices[0].message.content;
      }
    } catch (error) {
      // If parsing fails, use the raw content
      result = data.choices[0].message.content;
    }

    return new Response(
      JSON.stringify({ result }),
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
