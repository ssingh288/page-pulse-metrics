
// This utility generates more intelligent landing page content using keyword analysis and industry knowledge

type ContentBlock = {
  type: 'headline' | 'subheadline' | 'paragraph' | 'features' | 'testimonials' | 'cta';
  content: string | string[];
};

type LandingPageContent = {
  headline: string;
  subheadline: string;
  paragraphs: string[];
  features: string[];
  testimonials: string[];
  cta: string;
  keywordSuggestions: string[];
};

type ThemeOptions = {
  colorScheme: string;
  layout: 'centered' | 'split' | 'zigzag';
  style: 'minimal' | 'bold' | 'gradient';
};

// Helper to generate paragraph content from keywords and audience
const generateParagraphFromKeywords = (
  title: string,
  audience: string,
  keywords: string[],
  industry: string,
  campaignType: string
): string[] => {
  // This would ideally connect to an AI API, but for now we'll use template-based generation
  const paragraphs: string[] = [];
  
  // Generate why paragraph
  const whyParagraph = `Are you looking to ${
    campaignType === 'Lead Generation' ? 'level up your skills' :
    campaignType === 'Product Launch' ? 'discover the next big thing' :
    campaignType === 'Webinar Registration' ? 'gain insider knowledge' :
    campaignType === 'Free Trial' ? 'experience the difference' :
    'take your next step'
  } in ${industry}? ${title} is specifically designed for ${audience} who want to excel in ${
    keywords.slice(0, 3).join(', ')
  } and more.`;
  
  paragraphs.push(whyParagraph);
  
  // Generate benefits paragraph
  const benefitsParagraph = `By joining this ${
    campaignType === 'Webinar Registration' || campaignType === 'Event Promotion' ? 'event' :
    campaignType === 'Product Launch' ? 'launch' :
    campaignType === 'Free Trial' ? 'trial' :
    'opportunity'
  }, you'll gain valuable insights into ${keywords.slice(0, 2).join(' and ')}, giving you the competitive edge in today's fast-paced ${industry} landscape. Don't miss this chance to join ${audience} who are already benefiting from our expertise.`;
  
  paragraphs.push(benefitsParagraph);
  
  // Generate urgency paragraph
  const urgencyParagraph = `${
    campaignType === 'Sale/Discount Promotion' ? 'Limited-time offer! ' :
    campaignType === 'Event Promotion' ? 'Spots are filling up fast! ' :
    campaignType === 'Webinar Registration' ? 'Reserve your virtual seat now! ' :
    'Don\'t wait! '
  }Join the ${keywords[0]} revolution today and see why industry leaders trust our ${
    campaignType === 'Product Launch' ? 'innovative products' :
    campaignType === 'Webinar Registration' ? 'expert webinars' :
    campaignType === 'Free Trial' ? 'powerful solutions' :
    'proven approach'
  }.`;
  
  paragraphs.push(urgencyParagraph);
  
  return paragraphs;
};

// Generate theme options based on industry and campaign type
const generateThemeOptions = (industry: string, campaignType: string): ThemeOptions[] => {
  const options: ThemeOptions[] = [];
  
  // Professional theme
  options.push({
    colorScheme: industry === 'Finance' || industry === 'Consulting' ? 'blue-gray' : 
                 industry === 'Healthcare' ? 'blue-green' :
                 industry === 'Technology' || industry === 'Software/SaaS' ? 'purple-blue' :
                 'blue-indigo',
    layout: 'centered',
    style: 'minimal'
  });
  
  // Bold theme
  options.push({
    colorScheme: campaignType === 'Sale/Discount Promotion' ? 'orange-red' :
                 campaignType === 'Event Promotion' ? 'purple-pink' :
                 industry === 'Marketing' ? 'pink-purple' :
                 'indigo-purple',
    layout: 'split',
    style: 'bold'
  });
  
  // Creative theme
  options.push({
    colorScheme: industry === 'Entertainment' ? 'pink-orange' :
                 industry === 'Education' ? 'blue-teal' :
                 industry === 'Food & Beverage' ? 'green-yellow' :
                 'gradient',
    layout: 'zigzag',
    style: 'gradient'
  });
  
  return options;
};

// Extract and suggest additional keywords
const suggestAdditionalKeywords = (
  title: string,
  industry: string,
  campaignType: string,
  keywords: string[]
): string[] => {
  const suggestions: Set<string> = new Set();
  
  // Add industry-specific keywords
  if (industry === 'Software/SaaS') {
    ['cloud', 'automation', 'integration', 'API', 'scalable', 'enterprise'].forEach(k => suggestions.add(k));
  } else if (industry === 'Education') {
    ['certification', 'workshop', 'hands-on', 'expert', 'practical', 'career'].forEach(k => suggestions.add(k));
  } else if (industry === 'Finance') {
    ['investment', 'savings', 'secure', 'growth', 'future', 'risk-free'].forEach(k => suggestions.add(k));
  }
  
  // Add campaign-specific keywords
  if (campaignType === 'Webinar Registration') {
    ['limited seats', 'exclusive access', 'live Q&A', 'expert panel', 'certificate'].forEach(k => suggestions.add(k));
  } else if (campaignType === 'Product Launch') {
    ['innovative', 'first-to-market', 'revolutionary', 'game-changer', 'exclusive'].forEach(k => suggestions.add(k));
  } else if (campaignType === 'Sale/Discount Promotion') {
    ['limited time', 'special offer', 'discount', 'save', 'bonus', 'free'].forEach(k => suggestions.add(k));
  }
  
  // Handle special cases based on title
  if (title.toLowerCase().includes('sql')) {
    ['database', 'query', 'FAANG', 'MAANG', 'data analysis', 'big data', 'interview prep'].forEach(k => suggestions.add(k));
  } else if (title.toLowerCase().includes('workshop')) {
    ['hands-on', 'interactive', 'practical', 'certificate', 'portfolio', 'career boost'].forEach(k => suggestions.add(k));
  }
  
  // Filter out existing keywords
  return [...suggestions].filter(k => !keywords.includes(k));
};

// Generate features and benefits based on campaign type and keywords
const generateFeatures = (campaignType: string, keywords: string[]): string[] => {
  const features: string[] = [];
  
  if (campaignType === 'Webinar Registration' || campaignType === 'Event Promotion') {
    features.push('Expert-led sessions with industry veterans');
    features.push('Interactive Q&A opportunities');
    features.push('Exclusive resources and materials');
    features.push('Networking with like-minded professionals');
  } else if (campaignType === 'Product Launch') {
    features.push('Cutting-edge technology with intuitive interface');
    features.push('Seamless integration with your existing workflow');
    features.push('24/7 dedicated customer support');
    features.push('Regular updates and improvements');
  } else if (campaignType === 'Lead Generation' || campaignType === 'Free Trial') {
    features.push('No credit card required to get started');
    features.push('Full access to all premium features');
    features.push('Personalized onboarding session');
    features.push('Risk-free guarantee');
  }
  
  // Add keyword-specific features
  keywords.slice(0, 3).forEach(keyword => {
    features.push(`Specialized ${keyword} focus for maximum results`);
  });
  
  return features.slice(0, 6); // Limit to 6 features
};

// Generate testimonials based on industry and audience
const generateTestimonials = (industry: string, audience: string): string[] => {
  return [
    `"This completely transformed how we approach our ${industry} strategy. Highly recommended for any ${audience} looking to grow." - Alex C., Marketing Director`,
    `"The insights we gained were invaluable. Our team is now better equipped to tackle ${industry} challenges." - Jamie L., Product Manager`,
    `"Worth every penny. If you're a ${audience}, you can't afford to miss this opportunity." - Taylor S., CEO`
  ];
};

// Generate CTA based on campaign type
const generateCTA = (campaignType: string): string => {
  switch (campaignType) {
    case 'Lead Generation':
      return 'Get Your Free Consultation Now';
    case 'Product Launch':
      return 'Be Among The First To Access';
    case 'Webinar Registration':
      return 'Secure Your Spot Now';
    case 'Event Promotion':
      return 'Register Today';
    case 'Newsletter Signup':
      return 'Join Our Community';
    case 'Sale/Discount Promotion':
      return 'Claim Your Discount';
    case 'Product Demo':
      return 'See It In Action';
    case 'Free Trial':
      return 'Start Your Free Trial';
    case 'Consultation Booking':
      return 'Book Your Session';
    case 'Case Study/Whitepaper Download':
      return 'Download Now';
    default:
      return 'Get Started';
  }
};

// Main function to generate landing page content
export const generateLandingPageContent = (
  title: string,
  audience: string,
  industry: string,
  campaignType: string,
  keywords: string[]
): {
  content: LandingPageContent;
  themeOptions: ThemeOptions[];
} => {
  // Generate additional keyword suggestions
  const keywordSuggestions = suggestAdditionalKeywords(title, industry, campaignType, keywords);
  
  // Generate paragraphs
  const paragraphs = generateParagraphFromKeywords(title, audience, [...keywords, ...keywordSuggestions.slice(0, 3)], industry, campaignType);
  
  // Generate features
  const features = generateFeatures(campaignType, [...keywords, ...keywordSuggestions]);
  
  // Generate testimonials
  const testimonials = generateTestimonials(industry, audience);
  
  // Generate CTA
  const cta = generateCTA(campaignType);
  
  // Generate theme options
  const themeOptions = generateThemeOptions(industry, campaignType);
  
  return {
    content: {
      headline: title,
      subheadline: `The ultimate solution for ${audience} in the ${industry} industry`,
      paragraphs,
      features,
      testimonials,
      cta,
      keywordSuggestions
    },
    themeOptions
  };
};

// Generate HTML content with theme
export const generateEnhancedHtml = (
  title: string, 
  audience: string, 
  keywords: string[], 
  theme: ThemeOptions,
  content: LandingPageContent
): string => {
  // Define color schemes
  const colorSchemes: Record<string, { primary: string, secondary: string, accent: string, text: string, background: string }> = {
    'blue-gray': { 
      primary: '#1e40af', 
      secondary: '#475569', 
      accent: '#3b82f6', 
      text: '#1e293b', 
      background: '#f8fafc' 
    },
    'blue-green': { 
      primary: '#0891b2', 
      secondary: '#115e59', 
      accent: '#06b6d4', 
      text: '#0f172a', 
      background: '#ecfeff' 
    },
    'purple-blue': { 
      primary: '#6366f1', 
      secondary: '#3730a3', 
      accent: '#818cf8', 
      text: '#1e1b4b', 
      background: '#eef2ff' 
    },
    'blue-indigo': { 
      primary: '#4f46e5', 
      secondary: '#1e40af', 
      accent: '#6366f1', 
      text: '#1e1b4b', 
      background: '#eef2ff' 
    },
    'orange-red': { 
      primary: '#ea580c', 
      secondary: '#b91c1c', 
      accent: '#f97316', 
      text: '#431407', 
      background: '#fff7ed' 
    },
    'purple-pink': { 
      primary: '#c026d3', 
      secondary: '#9d174d', 
      accent: '#e879f9', 
      text: '#701a75', 
      background: '#fdf4ff' 
    },
    'pink-purple': { 
      primary: '#db2777', 
      secondary: '#7e22ce', 
      accent: '#ec4899', 
      text: '#831843', 
      background: '#fdf2f8' 
    },
    'indigo-purple': { 
      primary: '#4f46e5', 
      secondary: '#7e22ce', 
      accent: '#818cf8', 
      text: '#312e81', 
      background: '#eef2ff' 
    },
    'pink-orange': { 
      primary: '#db2777', 
      secondary: '#ea580c', 
      accent: '#f472b6', 
      text: '#831843', 
      background: '#fff1f2' 
    },
    'blue-teal': { 
      primary: '#0284c7', 
      secondary: '#0f766e', 
      accent: '#22d3ee', 
      text: '#0c4a6e', 
      background: '#ecfeff' 
    },
    'green-yellow': { 
      primary: '#16a34a', 
      secondary: '#ca8a04', 
      accent: '#4ade80', 
      text: '#14532d', 
      background: '#f7fee7' 
    },
    'gradient': { 
      primary: '#6366f1', 
      secondary: '#8b5cf6', 
      accent: '#d946ef', 
      text: '#1e1b4b', 
      background: 'linear-gradient(135deg, #eef2ff 0%, #fdf4ff 100%)' 
    },
  };
  
  // Get colors from selected theme
  const colors = colorSchemes[theme.colorScheme] || colorSchemes['blue-indigo'];
  
  // Generate CSS based on theme
  const generateCss = () => {
    if (theme.style === 'minimal') {
      return `
        body { font-family: 'Inter', system-ui, sans-serif; line-height: 1.5; margin: 0; color: ${colors.text}; background: ${colors.background}; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        header { padding: 100px 0 80px; background-color: ${colors.background}; color: ${colors.text}; text-align: center; }
        h1 { font-size: 3rem; font-weight: 800; margin-bottom: 1rem; color: ${colors.primary}; }
        .subheader { font-size: 1.5rem; max-width: 800px; margin: 0 auto 2rem; color: ${colors.secondary}; }
        .cta-button { background: ${colors.primary}; color: white; border: none; padding: 16px 32px; font-size: 1.125rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .cta-button:hover { background: ${colors.accent}; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        section { padding: 80px 0; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
        .feature { padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background: white; transition: all 0.3s ease; }
        .feature:hover { transform: translateY(-5px); box-shadow: 0 12px 20px rgba(0,0,0,0.1); }
        .feature h3 { margin-top: 0; color: ${colors.primary}; }
        .testimonials { margin-top: 60px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .testimonial { padding: 24px; border-radius: 12px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-left: 4px solid ${colors.accent}; }
        .section-title { color: ${colors.primary}; text-align: center; margin-bottom: 40px; font-size: 2rem; }
        .highlight { color: ${colors.accent}; font-weight: 600; }
      `;
    } else if (theme.style === 'bold') {
      return `
        body { font-family: 'Montserrat', system-ui, sans-serif; line-height: 1.5; margin: 0; color: ${colors.text}; background: ${colors.background}; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        header { padding: 120px 0 100px; background: ${colors.primary}; color: white; text-align: center; position: relative; overflow: hidden; }
        header::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at top right, ${colors.accent}, transparent 60%); opacity: 0.6; }
        h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; position: relative; }
        .subheader { font-size: 1.5rem; max-width: 800px; margin: 0 auto 2.5rem; position: relative; }
        .cta-button { background: ${colors.secondary}; color: white; border: none; padding: 18px 36px; font-size: 1.25rem; border-radius: 50px; cursor: pointer; font-weight: 700; transition: all 0.3s; position: relative; overflow: hidden; }
        .cta-button:hover { background: ${colors.accent}; transform: translateY(-3px); box-shadow: 0 15px 25px -5px rgba(0,0,0,0.2); }
        .cta-button::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: rgba(255,255,255,0.1); transform: rotate(45deg); transition: all 0.5s; }
        .cta-button:hover::after { transform: rotate(45deg) translate(50%, 50%); }
        section { padding: 100px 0; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 60px; }
        .feature { padding: 32px; border-radius: 16px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.08); transition: all 0.3s ease; border-bottom: 5px solid ${colors.accent}; }
        .feature:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
        .feature h3 { margin-top: 0; color: ${colors.primary}; font-size: 1.5rem; }
        .testimonials { margin-top: 80px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .testimonial { padding: 32px; border-radius: 16px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.08); position: relative; }
        .testimonial::before { content: '"'; position: absolute; top: 20px; left: 20px; font-size: 5rem; color: ${colors.primary}; opacity: 0.1; font-family: serif; line-height: 0; }
        .section-title { color: ${colors.primary}; text-align: center; margin-bottom: 50px; font-size: 2.5rem; font-weight: 800; }
        .highlight { color: ${colors.accent}; font-weight: 700; }
        .alternate-section { background: #f9fafb; }
      `;
    } else { // gradient style
      return `
        body { font-family: 'Poppins', system-ui, sans-serif; line-height: 1.5; margin: 0; color: ${colors.text}; background: ${colors.background}; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        header { padding: 130px 0 110px; background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); color: white; text-align: center; position: relative; overflow: hidden; }
        header::after { content: ''; position: absolute; width: 150%; height: 150%; top: -50%; left: -25%; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%); transform: rotate(-15deg); }
        h1 { font-size: 4rem; font-weight: 800; margin-bottom: 1rem; position: relative; text-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .subheader { font-size: 1.75rem; max-width: 800px; margin: 0 auto 3rem; position: relative; opacity: 0.9; }
        .cta-button { background: linear-gradient(90deg, ${colors.accent} 0%, ${colors.secondary} 100%); color: white; border: none; padding: 20px 42px; font-size: 1.35rem; border-radius: 100px; cursor: pointer; font-weight: 700; transition: all 0.3s; position: relative; box-shadow: 0 15px 30px rgba(0,0,0,0.15); }
        .cta-button:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        section { padding: 120px 0; position: relative; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 50px; margin-top: 70px; }
        .feature { padding: 40px 30px; border-radius: 20px; background: white; box-shadow: 0 15px 50px rgba(0,0,0,0.08); transition: all 0.4s ease; position: relative; overflow: hidden; z-index: 1; }
        .feature::before { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 0; background: linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%); z-index: -1; transition: all 0.4s ease; }
        .feature:hover::before { height: 100%; }
        .feature:hover { transform: translateY(-15px); box-shadow: 0 30px 60px rgba(0,0,0,0.12); }
        .feature h3 { margin-top: 0; color: ${colors.primary}; font-size: 1.6rem; }
        .testimonials { margin-top: 90px; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px; }
        .testimonial { padding: 40px; border-radius: 20px; background: white; box-shadow: 0 15px 50px rgba(0,0,0,0.08); position: relative; }
        .testimonial::after { content: '"'; position: absolute; bottom: 20px; right: 20px; font-size: 8rem; color: ${colors.primary}; opacity: 0.07; font-family: serif; line-height: 0; }
        .section-title { color: ${colors.primary}; text-align: center; margin-bottom: 60px; font-size: 3rem; font-weight: 800; position: relative; }
        .section-title::after { content: ''; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 80px; height: 4px; background: ${colors.accent}; border-radius: 4px; }
        .highlight { color: ${colors.accent}; font-weight: 700; }
        .wave-divider { position: absolute; bottom: 0; left: 0; width: 100%; height: 150px; overflow: hidden; }
        .wave-divider svg { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; }
      `;
    }
  };

  // Generate layout based on theme
  const generateLayout = () => {
    if (theme.layout === 'centered') {
      return `
        <header>
          <div class="container">
            <h1>${content.headline}</h1>
            <p class="subheader">${content.subheadline}</p>
            <button class="cta-button">${content.cta}</button>
          </div>
        </header>
        
        <section>
          <div class="container">
            <h2 class="section-title">Why Choose Us</h2>
            ${content.paragraphs.map(p => `<p>${p}</p>`).join('')}
            
            <div class="features">
              ${content.features.map((feature, i) => `
                <div class="feature">
                  <h3>Key Benefit ${i + 1}</h3>
                  <p>${feature}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        
        <section class="alternate-section">
          <div class="container">
            <h2 class="section-title">What People Say</h2>
            <div class="testimonials">
              ${content.testimonials.map(testimonial => `
                <div class="testimonial">
                  <p>${testimonial}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        
        <section>
          <div class="container" style="text-align: center;">
            <h2 class="section-title">Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers today.</p>
            <button class="cta-button">${content.cta}</button>
          </div>
        </section>
      `;
    } else if (theme.layout === 'split') {
      return `
        <header>
          <div class="container">
            <h1>${content.headline}</h1>
            <p class="subheader">${content.subheadline}</p>
            <button class="cta-button">${content.cta}</button>
          </div>
        </header>
        
        <section>
          <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 60px; align-items: center;">
            <div>
              <h2 class="section-title" style="text-align: left;">Why It Matters</h2>
              ${content.paragraphs.map(p => `<p>${p}</p>`).join('')}
              <button class="cta-button" style="margin-top: 20px;">${content.cta}</button>
            </div>
            
            <div class="features" style="grid-template-columns: 1fr; margin-top: 0;">
              ${content.features.slice(0, 3).map((feature, i) => `
                <div class="feature">
                  <h3>Key Benefit ${i + 1}</h3>
                  <p>${feature}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        
        <section class="alternate-section">
          <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 60px; align-items: center;">
            <div class="features" style="grid-template-columns: 1fr; margin-top: 0;">
              ${content.features.slice(3).map((feature, i) => `
                <div class="feature">
                  <h3>Key Benefit ${i + 4}</h3>
                  <p>${feature}</p>
                </div>
              `).join('')}
            </div>
            
            <div>
              <h2 class="section-title" style="text-align: left;">What Sets Us Apart</h2>
              <p>We've helped countless ${audience} achieve their goals through our tried-and-tested approach. Here's what some of them have to say:</p>
              <div class="testimonials" style="grid-template-columns: 1fr;">
                ${content.testimonials.map(testimonial => `
                  <div class="testimonial">
                    <p>${testimonial}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <div class="container" style="text-align: center;">
            <h2 class="section-title">Take Action Today</h2>
            <p>Don't miss this opportunity to transform your results.</p>
            <button class="cta-button">${content.cta}</button>
          </div>
        </section>
      `;
    } else { // zigzag layout
      return `
        <header>
          <div class="container">
            <h1>${content.headline}</h1>
            <p class="subheader">${content.subheadline}</p>
            <button class="cta-button">${content.cta}</button>
          </div>
        </header>
        
        <section>
          <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 60px; align-items: center; margin-bottom: 100px;">
              <div>
                <h2 class="section-title" style="text-align: left;">The Opportunity</h2>
                ${content.paragraphs.slice(0, 1).map(p => `<p>${p}</p>`).join('')}
              </div>
              <div class="features" style="grid-template-columns: 1fr; margin-top: 0;">
                ${content.features.slice(0, 2).map((feature, i) => `
                  <div class="feature">
                    <h3>Key Benefit ${i + 1}</h3>
                    <p>${feature}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 60px; align-items: center; margin-bottom: 100px;">
              <div class="features" style="grid-template-columns: 1fr; margin-top: 0; order: 1;">
                ${content.features.slice(2, 4).map((feature, i) => `
                  <div class="feature">
                    <h3>Key Benefit ${i + 3}</h3>
                    <p>${feature}</p>
                  </div>
                `).join('')}
              </div>
              <div style="order: 2;">
                <h2 class="section-title" style="text-align: left;">Why It Works</h2>
                ${content.paragraphs.slice(1, 2).map(p => `<p>${p}</p>`).join('')}
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 60px; align-items: center;">
              <div>
                <h2 class="section-title" style="text-align: left;">Don't Miss Out</h2>
                ${content.paragraphs.slice(2).map(p => `<p>${p}</p>`).join('')}
                <button class="cta-button" style="margin-top: 20px;">${content.cta}</button>
              </div>
              <div>
                <h2 class="section-title" style="text-align: left;">Testimonials</h2>
                <div class="testimonials" style="grid-template-columns: 1fr;">
                  ${content.testimonials.map(testimonial => `
                    <div class="testimonial">
                      <p>${testimonial}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  };
  
  // Combine it all into HTML
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Montserrat:wght@400;600;700;800&family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          ${generateCss()}
          
          /* Responsive styles */
          @media (max-width: 768px) {
            h1 { font-size: 2.5rem; }
            .subheader { font-size: 1.25rem; }
            section { padding: 60px 0; }
            .container > div { grid-template-columns: 1fr !important; }
            .features { margin-top: 40px; }
          }
          
          /* Button for regeneration (hidden in actual landing page) */
          .regenerate-controls {
            display: none;
          }
        </style>
      </head>
      <body>
        ${generateLayout()}
        
        <footer>
          <div class="container" style="text-align: center; padding: 30px 0; color: #666;">
            &copy; ${new Date().getFullYear()} ${title}. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  `;
};
