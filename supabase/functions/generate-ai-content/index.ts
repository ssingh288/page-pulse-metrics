
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

    const { prompt, mode, keywords = [] } = await req.json();

    if (!prompt) {
      throw new Error('No prompt provided');
    }

    // Customize system message based on the mode
    let systemMessage = 'You are an AI assistant specialized in content generation.';
    
    if (mode === 'landing_page_content') {
      systemMessage = 'You are an AI assistant specialized in creating high-converting landing page content. You create compelling headlines, persuasive body copy, effective calls to action, and structure content for maximum impact. Your content is optimized for both user experience and conversion. If keywords are provided, make sure to incorporate them naturally throughout the content.';
    } else if (mode === 'page_optimization') {
      systemMessage = 'You are an AI assistant specialized in landing page optimization. You analyze landing pages and provide structured recommendations for improving conversion rates, user engagement, and SEO performance.';
    } else if (mode === 'ad_generation') {
      systemMessage = 'You are an AI assistant specialized in creating platform-specific ad content based on landing pages. You create optimized ad variations for different platforms maintaining brand consistency while leveraging platform-specific best practices.';
    } else if (mode === 'keyword_optimization') {
      systemMessage = 'You are an AI assistant specialized in keyword optimization. Analyze the provided content and keywords, and suggest optimized keywords with traffic estimates, difficulty scores, and relevance. Return a well-structured JSON response with keyword suggestions, traffic data, and optimized content recommendations.';
    }
    
    // Enhance prompt with keywords if they're provided
    let enhancedPrompt = prompt;
    if (keywords && keywords.length > 0) {
      enhancedPrompt += `\n\nPlease incorporate these keywords naturally in the content: ${keywords.join(', ')}`;
      
      // For landing page content, also suggest additional relevant keywords
      if (mode === 'landing_page_content' || mode === 'keyword_optimization') {
        enhancedPrompt += `\n\nAlso, suggest 5-7 additional relevant keywords or phrases that could enhance the content's SEO performance.`;
      }
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
          { role: 'user', content: enhancedPrompt }
        ],
        temperature: 0.7,
        max_tokens: mode === 'keyword_optimization' ? 2500 : 1500,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    const content = data.choices?.[0]?.message?.content || "No content available at this time";

    // Process response based on mode
    if (mode === 'landing_page_content') {
      // Extract additional keywords if they exist in the response
      let keywordSuggestions: string[] = [];
      
      // Try to extract a keywords section if it exists
      const keywordsMatch = content.match(/keywords?:?\s*([\s\S]*?)(?:\n\n|$)/i);
      if (keywordsMatch && keywordsMatch[1]) {
        // Extract keywords, handling various formats (comma-separated, bullet points)
        keywordSuggestions = keywordsMatch[1]
          .split(/[,•\-\n]/) // Split by commas, bullets, or new lines
          .map((k: string) => k.trim())
          .filter((k: string) => k.length > 0);
      }
      
      return new Response(
        JSON.stringify({ 
          content,
          keywordSuggestions
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (mode === 'keyword_optimization') {
      // For keyword optimization, try to parse as JSON if possible
      try {
        const parsedContent = JSON.parse(content);
        return new Response(
          JSON.stringify({ result: parsedContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        // If it's not valid JSON, return structured content
        const keywordData = {
          suggestedKeywords: extractKeywords(content),
          optimizedContent: content,
          recommendations: extractRecommendations(content)
        };
        
        return new Response(
          JSON.stringify({ result: keywordData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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

// Helper function to extract keywords with metrics from content
function extractKeywords(content: string): Array<{keyword: string, traffic: string, difficulty: string, relevance: string}> {
  const keywords = [];
  
  // Look for patterns like "keyword: high traffic (80%), medium difficulty (50%)"
  const keywordRegex = /([a-zA-Z0-9 -]+)(?::\s*([a-zA-Z]+)\s*traffic\s*\(?(\d+%?)?\)?)?(?:,\s*([a-zA-Z]+)\s*difficulty\s*\(?(\d+%?)?\)?)?/g;
  let match;
  
  while ((match = keywordRegex.exec(content)) !== null) {
    if (match[1]) {
      keywords.push({
        keyword: match[1].trim(),
        traffic: match[3] || determineScore(match[2] || "medium"),
        difficulty: match[5] || determineScore(match[4] || "medium"),
        relevance: match[2] || "medium"
      });
    }
  }
  
  // If no structured keywords found, extract any bullet points or numbered items as keywords
  if (keywords.length === 0) {
    const bulletPointRegex = /(?:^|\n)(?:[-•*]|\d+\.)\s*([^\n]+)/g;
    while ((match = bulletPointRegex.exec(content)) !== null) {
      if (match[1]) {
        keywords.push({
          keyword: match[1].trim(),
          traffic: determineScore("medium"),
          difficulty: determineScore("medium"),
          relevance: "medium"
        });
      }
    }
  }
  
  return keywords;
}

// Helper function to extract recommendations from content
function extractRecommendations(content: string): string[] {
  const recommendations = [];
  
  // Look for sections labeled as recommendations, tips, suggestions
  const sections = content.split(/\n\s*(?:#{1,3}|Recommendations?|Tips?|Suggestions?|How to optimize):/i);
  
  if (sections.length > 1) {
    // Take the content after the heading
    const recommendationSection = sections[1].split(/\n\s*(?:#{1,3})/)[0];
    
    // Split by bullet points or numbered items
    const bulletPoints = recommendationSection.match(/(?:^|\n)(?:[-•*]|\d+\.)\s*([^\n]+)/g);
    if (bulletPoints) {
      bulletPoints.forEach(point => {
        recommendations.push(point.replace(/^(?:[-•*]|\d+\.)\s*/, '').trim());
      });
    } else {
      // If no bullet points, just use paragraphs
      const paragraphs = recommendationSection.split(/\n\n+/);
      paragraphs.forEach(para => {
        const cleaned = para.trim();
        if (cleaned.length > 10) {
          recommendations.push(cleaned);
        }
      });
    }
  }
  
  // If no structured recommendations found, just return empty array
  return recommendations;
}

// Helper function to convert text ratings to numeric scores
function determineScore(rating: string): string {
  switch(rating.toLowerCase()) {
    case "very high":
    case "high":
      return "85%";
    case "medium high":
    case "medium-high":
      return "70%";
    case "medium":
      return "50%";
    case "medium low":
    case "medium-low":
      return "30%";
    case "low":
    case "very low":
      return "15%";
    default:
      return "50%";
  }
}
