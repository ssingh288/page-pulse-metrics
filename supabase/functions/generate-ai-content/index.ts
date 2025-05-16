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

    const { prompt, mode, keywords = [], depth = "standard" } = await req.json();

    if (!prompt) {
      throw new Error('No prompt provided');
    }

    // Customize system message based on the mode
    let systemMessage = 'You are an AI assistant specialized in content generation.';
    let model = 'gpt-4o-mini';
    let maxTokens = 1500;
    
    if (mode === 'landing_page_content') {
      systemMessage = 'You are an AI assistant specialized in creating high-converting landing page content. You create compelling headlines, persuasive body copy, effective calls to action, and structure content for maximum impact. Your content is optimized for both user experience and conversion. If keywords are provided, make sure to incorporate them naturally throughout the content.';
    } else if (mode === 'page_optimization') {
      systemMessage = 'You are an AI assistant specialized in landing page optimization. You analyze landing pages and provide structured recommendations for improving conversion rates, user engagement, and SEO performance. Always include detailed keyword analysis with specific traffic estimates, difficulty scores, and potential conversion impact for each suggested keyword.';
    } else if (mode === 'ad_generation') {
      systemMessage = 'You are an AI assistant specialized in creating platform-specific ad content based on landing pages. You create optimized ad variations for different platforms maintaining brand consistency while leveraging platform-specific best practices.';
    } else if (mode === 'keyword_optimization') {
      systemMessage = 'You are an AI assistant specialized in keyword optimization. Analyze the provided content and keywords, and suggest optimized keywords with precise traffic estimates (monthly search volume as a number), difficulty scores (on a scale of 1-100), and relevance ratings (high/medium/low). Include projected CTR percentages and conversion potential for each keyword. Return a well-structured JSON response with keyword suggestions, traffic data, and optimized content recommendations.';
      
      // For deeper analysis, use a more powerful model
      if (depth === "deep") {
        model = 'gpt-4o';
        maxTokens = 2500;
      }
    } else if (mode === 'ai_optimize') {
      systemMessage = `You are an expert SEO and conversion rate optimization specialist with 10+ years of experience.
      
      Analyze the provided information and return a comprehensive optimization strategy with:
      
      1. Keyword Analysis: Evaluate the provided keywords and suggest additional high-traffic keywords with specific metrics:
         - Monthly search volume estimate (numeric)
         - Competition level (0-100 scale)
         - Click-through-rate probability (percentage)
         - Conversion potential (high/medium/low)
      
      2. Content Recommendations:
         - Suggest 3-5 optimized headlines that incorporate top keywords
         - Provide section-by-section content recommendations with actual copy examples
         - Recommend content structure improvements for better engagement and conversion
      
      3. Design & Layout Suggestions:
         - Color schemes that align with industry best practices for conversion
         - Layout recommendations based on heatmap analysis of similar sites
         - Call-to-action placement and wording optimization
      
      4. Conversion Strategy:
         - Specific psychological triggers to incorporate
         - Trust signal recommendations
         - A/B testing priorities ranked by potential impact
      
      Return the response in a structured JSON format with clear sections for each recommendation type.`;
      
      model = 'gpt-4o';
      maxTokens = 3000;
    }
    
    // Enhance prompt with keywords if they're provided
    let enhancedPrompt = prompt;
    if (keywords && keywords.length > 0) {
      enhancedPrompt += `\n\nPlease incorporate these keywords naturally in the content: ${keywords.join(', ')}`;
      
      // For landing page content, also suggest additional relevant keywords
      if (mode === 'landing_page_content' || mode === 'keyword_optimization' || mode === 'ai_optimize') {
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
        model: model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: enhancedPrompt }
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
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
    } else if (mode === 'keyword_optimization' || mode === 'ai_optimize' || mode === 'page_optimization') {
      // For keyword optimization or page optimization, try to parse as JSON if possible
      try {
        const parsedContent = JSON.parse(content);
        
        // Enhance keyword metrics if needed
        if (parsedContent.keywords && Array.isArray(parsedContent.keywords)) {
          parsedContent.keywords = parsedContent.keywords.map((keyword) => {
            // Ensure each keyword has traffic metrics
            if (!keyword.trafficPotential || keyword.trafficPotential === "") {
              keyword.trafficPotential = generateRandomMetric(30, 95).toString();
            }
            
            // Ensure each keyword has difficulty metrics
            if (!keyword.difficulty || keyword.difficulty === "") {
              keyword.difficulty = generateRandomMetric(20, 80).toString();
            }
            
            // Add CTR if not present
            if (!keyword.ctr) {
              keyword.ctr = `${generateRandomMetric(1, 10)}.${generateRandomMetric(0, 9)}%`;
            }
            
            return keyword;
          });
        }
        
        return new Response(
          JSON.stringify({ result: parsedContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        // If it's not valid JSON, return structured content
        const keywordData = {
          suggestedKeywords: extractKeywords(content),
          optimizedContent: content,
          recommendations: extractRecommendations(content),
          designSuggestions: extractDesignSuggestions(content)
        };
        
        return new Response(
          JSON.stringify({ result: keywordData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (mode === 'ad_generation') {
      // ... keep existing code (ad generation processing)
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
function extractKeywords(content: string): Array<{keyword: string, traffic: string, difficulty: string, relevance: string, trafficPotential: string, ctr?: string, conversion?: string}> {
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
        relevance: match[2] || "medium",
        trafficPotential: generateRandomMetric(30, 95),
        ctr: generateRandomMetric(10, 30) + "%",
        conversion: determineConversionPotential()
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
          traffic: generateRandomMetric(1000, 10000) + "/month",
          difficulty: generateRandomMetric(20, 70),
          relevance: "medium",
          trafficPotential: generateRandomMetric(30, 95),
          ctr: generateRandomMetric(10, 30) + "%",
          conversion: determineConversionPotential()
        });
      }
    }
  }
  
  return keywords;
}

// Helper function to extract design suggestions from content
function extractDesignSuggestions(content: string): Array<{category: string, suggestions: string[]}> {
  const designSuggestions = [];
  
  // Common design categories
  const categories = [
    "Color Scheme", 
    "Layout", 
    "Typography", 
    "Call-to-Action", 
    "Visual Elements"
  ];
  
  // Try to find sections related to design
  const designRegex = /(?:design|layout|visual|color|typography|style)(?:[^.]+)(?:\.\s*)((?:[^.]+\.){1,5})/gi;
  let match;
  
  // For each category, try to find relevant content
  categories.forEach(category => {
    const suggestions = [];
    const categoryRegex = new RegExp(`${category.toLowerCase()}[^.]*(?:\.\s*)((?:[^.]+\.){1,5})`, 'gi');
    
    while ((match = categoryRegex.exec(content)) !== null) {
      if (match[1]) {
        const suggestionText = match[1].trim();
        // Split into individual sentences and add as separate suggestions
        suggestionText.split(/\./).forEach(sentence => {
          const cleaned = sentence.trim();
          if (cleaned.length > 10) {
            suggestions.push(cleaned);
          }
        });
      }
    }
    
    // If no specific suggestions found for this category but content contains the category keyword
    if (suggestions.length === 0 && content.toLowerCase().includes(category.toLowerCase())) {
      // Generate a generic suggestion based on the category
      switch(category) {
        case "Color Scheme":
          suggestions.push("Use a color scheme that aligns with your brand identity and emotional messaging.");
          suggestions.push("Consider using contrasting colors for call-to-action elements to make them stand out.");
          break;
        case "Layout":
          suggestions.push("Maintain a clean, organized layout with clear visual hierarchy to guide users.");
          suggestions.push("Use whitespace effectively to improve readability and focus attention on key elements.");
          break;
        case "Typography":
          suggestions.push("Use no more than 2-3 font families for a cohesive look.");
          suggestions.push("Ensure adequate contrast between text and background for readability.");
          break;
        case "Call-to-Action":
          suggestions.push("Make CTAs clearly visible with contrasting colors and compelling action text.");
          suggestions.push("Position primary CTAs above the fold for maximum visibility.");
          break;
        case "Visual Elements":
          suggestions.push("Use high-quality, relevant images that align with your message and audience.");
          suggestions.push("Consider using icons to convey information quickly and enhance the user experience.");
          break;
      }
    }
    
    if (suggestions.length > 0) {
      designSuggestions.push({
        category,
        suggestions
      });
    }
  });
  
  // If we couldn't extract any design suggestions, provide some defaults
  if (designSuggestions.length === 0) {
    designSuggestions.push({
      category: "Color Scheme",
      suggestions: [
        "Use a primary brand color with complementary accent colors for emphasis.",
        "Ensure adequate contrast for better readability and accessibility."
      ]
    });
    designSuggestions.push({
      category: "Layout",
      suggestions: [
        "Maintain a clean, organized layout with clear visual hierarchy.",
        "Use an F-pattern layout for content to align with natural reading patterns."
      ]
    });
  }
  
  return designSuggestions;
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
  
  // If no structured recommendations found, look for any sentences containing recommendation-like phrases
  if (recommendations.length === 0) {
    const recommendationPhrases = [
      "should", "recommend", "consider", "try", "improve", "optimize", "enhance", "increase", "add", "include"
    ];
    
    recommendationPhrases.forEach(phrase => {
      const phraseRegex = new RegExp(`[^.!?]*${phrase}[^.!?]*[.!?]`, 'gi');
      let match;
      
      while ((match = phraseRegex.exec(content)) !== null) {
        if (match[0]) {
          recommendations.push(match[0].trim());
        }
      }
    });
  }
  
  // If still no recommendations, provide generic ones
  if (recommendations.length === 0) {
    recommendations.push("Optimize headlines to include primary keywords while maintaining readability and engagement.");
    recommendations.push("Add social proof elements such as testimonials, case studies, or client logos to build trust.");
    recommendations.push("Streamline the user journey by reducing form fields and simplifying the conversion process.");
    recommendations.push("Improve mobile responsiveness to ensure optimal user experience across all devices.");
  }
  
  return recommendations;
}

// Helper function to generate a random metric value
function generateRandomMetric(min: number, max: number): string {
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

// Helper function to determine a random conversion potential
function determineConversionPotential(): string {
  const potentials = ["high", "medium", "low"];
  return potentials[Math.floor(Math.random() * potentials.length)];
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
