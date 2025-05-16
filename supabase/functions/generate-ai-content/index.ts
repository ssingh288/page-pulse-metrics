
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
    }

    // If depth is set to deep, use more capable model for more thorough analysis
    if (depth === 'deep') {
      model = 'gpt-4o';
    }

    // Craft response format based on mode
    let responseFormat = {};
    if (mode === 'page_optimization') {
      responseFormat = {
        type: "json_object",
        schema: {
          type: "object",
          properties: {
            headline: {
              type: "object", 
              properties: {
                original: { type: "string" },
                suggested: { type: "string" },
                reason: { type: "string" }
              }
            },
            cta: {
              type: "object",
              properties: {
                original: { type: "string" },
                suggested: { type: "string" },
                reason: { type: "string" }
              }
            },
            content: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section: { type: "string" },
                  original: { type: "string" },
                  suggested: { type: "string" },
                  reason: { type: "string" }
                }
              }
            },
            keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  relevance: { type: "string", enum: ["high", "medium", "low"] },
                  trafficPotential: { type: "string" },
                  difficulty: { type: "string" }
                }
              }
            },
            structure: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  suggestion: { type: "string" },
                  reason: { type: "string" }
                }
              }
            },
            trafficEstimate: {
              type: "object",
              properties: {
                current: { type: "string" },
                potential: { type: "string" },
                confidence: { type: "string", enum: ["high", "medium", "low"] }
              }
            },
            colors: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      };
    } else if (mode === 'ad_generation') {
      responseFormat = {
        type: "json_object",
        schema: {
          type: "object",
          properties: {
            facebook: {
              type: "object",
              properties: {
                headline: { type: "string" },
                primary_text: { type: "string" },
                description: { type: "string" },
                cta: { type: "string" },
                status: { type: "string" }
              }
            },
            instagram: {
              type: "object",
              properties: {
                caption: { type: "string" },
                hashtags: { type: "string" },
                status: { type: "string" }
              }
            },
            twitter: {
              type: "object",
              properties: {
                tweet_copy: { type: "string" },
                hashtags: { type: "string" },
                status: { type: "string" }
              }
            },
            linkedin: {
              type: "object",
              properties: {
                headline: { type: "string" },
                description: { type: "string" },
                cta: { type: "string" }
              }
            },
            google: {
              type: "object",
              properties: {
                headline1: { type: "string" },
                headline2: { type: "string" },
                headline3: { type: "string" },
                description1: { type: "string" },
                description2: { type: "string" }
              }
            }
          }
        }
      };
    } else if (mode === 'ai_optimize') {
      responseFormat = {
        type: "json_object",
        schema: {
          type: "object",
          properties: {
            suggestedKeywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  traffic: { type: "string" },
                  difficulty: { type: "string" },
                  relevance: { type: "string" },
                  ctr: { type: "string" },
                  conversion: { type: "string" }
                }
              }
            },
            optimizedContent: { type: "string" },
            recommendations: { 
              type: "array",
              items: { type: "string" }
            },
            headlines: {
              type: "array",
              items: { type: "string" }
            },
            designSuggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  suggestions: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
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
        response_format: Object.keys(responseFormat).length > 0 ? responseFormat : undefined,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    let result;
    try {
      // If response_format is JSON, parse the content
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
