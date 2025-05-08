
// Define theme type for landing page styling
export interface ThemeOption {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  buttonStyle: string;
  layoutStyle: string;
  accentColor: string;
  name: string;
}

// This function generates content for a landing page
export function generateLandingPageContent(
  title: string,
  audience: string,
  industry: string,
  campaignType: string,
  keywords: string[]
) {
  // Generate theme options
  const themeOptions = [
    {
      name: "Professional",
      primaryColor: "#1a56db",
      secondaryColor: "#f0f4f8",
      accentColor: "#10b981",
      fontFamily: "'Inter', sans-serif",
      buttonStyle: "rounded-lg bg-primary text-white hover:bg-primary-700",
      layoutStyle: "clean"
    },
    {
      name: "Vibrant",
      primaryColor: "#6d28d9",
      secondaryColor: "#ede9fe",
      accentColor: "#ec4899",
      fontFamily: "'Poppins', sans-serif",
      buttonStyle: "rounded-full bg-gradient-to-r from-primary to-accent text-white",
      layoutStyle: "modern"
    },
    {
      name: "Minimal",
      primaryColor: "#262626",
      secondaryColor: "#f5f5f5",
      accentColor: "#22c55e",
      fontFamily: "'Roboto', sans-serif",
      buttonStyle: "border border-primary bg-white text-primary hover:bg-primary hover:text-white",
      layoutStyle: "minimal"
    },
    {
      name: "Bold",
      primaryColor: "#be123c",
      secondaryColor: "#fecdd3",
      accentColor: "#f59e0b",
      fontFamily: "'Montserrat', sans-serif",
      buttonStyle: "rounded-none bg-primary text-white shadow-lg hover:translate-y-[-2px]",
      layoutStyle: "impact"
    }
  ];

  // Generate content based on inputs
  const headline = `${title} | Perfect for ${industry} ${campaignType}`;
  
  // Generate subheadline based on campaign type
  let subheadline = "";
  
  switch (campaignType) {
    case "Lead Generation":
      subheadline = `Get exclusive ${industry} insights and resources for ${audience}`;
      break;
    case "Product Launch":
      subheadline = `Introducing the next generation solution for ${audience} in the ${industry} industry`;
      break;
    case "Webinar Registration":
      subheadline = `Join our expert-led webinar on maximizing success in the ${industry} space`;
      break;
    case "Event Promotion":
      subheadline = `Don't miss this exclusive ${industry} event tailored for ${audience}`;
      break;
    case "Newsletter Signup":
      subheadline = `Stay updated with the latest ${industry} trends, delivered directly to your inbox`;
      break;
    default:
      subheadline = `The perfect solution for ${audience} in the ${industry} space`;
  }

  // Generate feature points
  const features = [
    `Tailored specifically for ${audience}`,
    `Industry-leading ${industry} solutions`,
    `Optimized for ${campaignType.toLowerCase()} campaigns`,
    `Seamless integration with existing systems`,
    `Enhanced performance metrics and analytics`
  ];

  // Generate call to action based on campaign type
  let cta = "";
  
  switch (campaignType) {
    case "Lead Generation":
      cta = "Get Your Free Consultation";
      break;
    case "Product Launch":
      cta = "Be First To Access";
      break;
    case "Webinar Registration":
      cta = "Reserve Your Spot Now";
      break;
    case "Event Promotion":
      cta = "Register Today";
      break;
    case "Newsletter Signup":
      cta = "Subscribe Now";
      break;
    case "Sale/Discount Promotion":
      cta = "Claim Your Discount";
      break;
    default:
      cta = "Learn More";
  }

  // Generate testimonial
  const testimonial = {
    quote: `"This ${industry} solution transformed our approach to ${campaignType.toLowerCase()}. The results exceeded our expectations."`,
    author: "Satisfied Customer",
    company: `Leading ${industry} Company`
  };

  // Generate FAQ items
  const faqItems = [
    {
      question: `How is this solution specifically tailored for ${industry}?`,
      answer: `Our solution has been designed from the ground up with ${industry} businesses in mind, addressing the unique challenges and opportunities in this space.`
    },
    {
      question: "What kind of results can I expect?",
      answer: "Our clients typically see significant improvements in engagement, conversion rates, and overall campaign performance within the first month."
    },
    {
      question: "Is there ongoing support available?",
      answer: "Yes, we provide comprehensive support to ensure you get the most out of our platform, including regular updates and dedicated customer success managers."
    }
  ];

  // Generate benefits based on keywords and audience
  const benefits = keywords.map(keyword => 
    `Optimize ${keyword} performance for ${audience}`
  );

  // Add some keyword suggestions based on the provided ones
  const keywordSuggestions = keywords.length > 0 
    ? keywords.map(kw => `optimized ${kw}`)
    : [`${industry} solutions`, `${campaignType} optimization`, `${industry} for ${audience}`];

  // Combine all content into a structured object
  const generatedContent = {
    headline,
    subheadline,
    features,
    benefits: benefits.length > 0 ? benefits : features,
    cta,
    testimonial,
    faqItems,
    keywordSuggestions
  };

  return { 
    content: generatedContent, 
    themeOptions 
  };
}

// This function generates enhanced HTML with specified theme and content
export function generateEnhancedHtml(
  title: string,
  audience: string,
  keywords: string[],
  theme: ThemeOption,
  content: any,
  mediaType: string = "Image",
  layoutStyle: string = "Image Top, Content Below"
) {
  // Generate an image placeholder URL based on keywords
  const imageKeyword = keywords.length > 0 ? keywords[0] : audience;
  const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(imageKeyword)}`;
  const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-office-workers-having-a-business-meeting-42087-large.mp4";

  // Start building the HTML
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <meta name="description" content="${content.subheadline}">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@400;500;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        :root {
          --primary-color: ${theme.primaryColor};
          --secondary-color: ${theme.secondaryColor};
          --accent-color: ${theme.accentColor};
        }
        body {
          font-family: ${theme.fontFamily};
          color: #333;
          line-height: 1.6;
        }
        .bg-primary {
          background-color: var(--primary-color);
        }
        .bg-secondary {
          background-color: var(--secondary-color);
        }
        .bg-accent {
          background-color: var(--accent-color);
        }
        .text-primary {
          color: var(--primary-color);
        }
        .text-accent {
          color: var(--accent-color);
        }
        .btn {
          ${theme.buttonStyle};
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body class="min-h-screen">
  `;

  // Add header
  html += `
    <header class="bg-primary text-white py-4">
      <div class="container flex justify-between items-center">
        <h2 class="text-xl font-bold">Logo</h2>
        <nav>
          <ul class="flex space-x-4">
            <li><a href="#features" class="hover:underline">Features</a></li>
            <li><a href="#testimonials" class="hover:underline">Testimonials</a></li>
            <li><a href="#faq" class="hover:underline">FAQ</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;

  // Add hero section based on layout style
  if (layoutStyle === "Image Top, Content Below") {
    html += `
      <section class="py-16 bg-secondary">
        <div class="container text-center space-y-6">
          ${mediaType.includes("Image") ? 
            `<div class="mx-auto max-w-3xl rounded-lg overflow-hidden shadow-xl mb-8">
              <img src="${imageUrl}" alt="${title}" class="w-full h-auto">
            </div>` : ''}
          ${mediaType.includes("Video") ? 
            `<div class="mx-auto max-w-3xl rounded-lg overflow-hidden shadow-xl mb-8">
              <video controls class="w-full h-auto">
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>` : ''}
          <h1 class="text-4xl md:text-5xl font-bold text-primary">${content.headline}</h1>
          <p class="text-xl max-w-2xl mx-auto">${content.subheadline}</p>
          <div>
            <a href="#signup" class="btn inline-block">${content.cta}</a>
          </div>
        </div>
      </section>
    `;
  } else if (layoutStyle === "Content Top, Image Below") {
    html += `
      <section class="py-16 bg-secondary">
        <div class="container text-center space-y-6">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">${content.headline}</h1>
          <p class="text-xl max-w-2xl mx-auto">${content.subheadline}</p>
          <div>
            <a href="#signup" class="btn inline-block">${content.cta}</a>
          </div>
          ${mediaType.includes("Image") ? 
            `<div class="mx-auto max-w-3xl rounded-lg overflow-hidden shadow-xl mt-8">
              <img src="${imageUrl}" alt="${title}" class="w-full h-auto">
            </div>` : ''}
          ${mediaType.includes("Video") ? 
            `<div class="mx-auto max-w-3xl rounded-lg overflow-hidden shadow-xl mt-8">
              <video controls class="w-full h-auto">
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>` : ''}
        </div>
      </section>
    `;
  } else if (layoutStyle === "Content Left, Image Right") {
    html += `
      <section class="py-16 bg-secondary">
        <div class="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold text-primary">${content.headline}</h1>
            <p class="text-xl">${content.subheadline}</p>
            <div>
              <a href="#signup" class="btn inline-block">${content.cta}</a>
            </div>
          </div>
          <div>
            ${mediaType.includes("Image") ? 
              `<div class="rounded-lg overflow-hidden shadow-xl">
                <img src="${imageUrl}" alt="${title}" class="w-full h-auto">
              </div>` : ''}
            ${mediaType.includes("Video") ? 
              `<div class="rounded-lg overflow-hidden shadow-xl mt-4">
                <video controls class="w-full h-auto">
                  <source src="${videoUrl}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>` : ''}
          </div>
        </div>
      </section>
    `;
  } else if (layoutStyle === "Image Left, Content Right") {
    html += `
      <section class="py-16 bg-secondary">
        <div class="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            ${mediaType.includes("Image") ? 
              `<div class="rounded-lg overflow-hidden shadow-xl">
                <img src="${imageUrl}" alt="${title}" class="w-full h-auto">
              </div>` : ''}
            ${mediaType.includes("Video") ? 
              `<div class="rounded-lg overflow-hidden shadow-xl mt-4">
                <video controls class="w-full h-auto">
                  <source src="${videoUrl}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>` : ''}
          </div>
          <div class="space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold text-primary">${content.headline}</h1>
            <p class="text-xl">${content.subheadline}</p>
            <div>
              <a href="#signup" class="btn inline-block">${content.cta}</a>
            </div>
          </div>
        </div>
      </section>
    `;
  } else if (layoutStyle === "Full-Width Image Banner") {
    html += `
      <section class="relative">
        ${mediaType.includes("Image") ? 
          `<div class="w-full h-[500px] overflow-hidden">
            <img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div class="text-white text-center space-y-6 max-w-3xl px-4">
                <h1 class="text-4xl md:text-5xl font-bold">${content.headline}</h1>
                <p class="text-xl">${content.subheadline}</p>
                <div>
                  <a href="#signup" class="btn inline-block">${content.cta}</a>
                </div>
              </div>
            </div>
          </div>` : ''}
        ${mediaType.includes("Video") && !mediaType.includes("Image") ? 
          `<div class="w-full h-[500px] overflow-hidden">
            <video autoplay muted loop class="w-full h-full object-cover">
              <source src="${videoUrl}" type="video/mp4">
            </video>
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div class="text-white text-center space-y-6 max-w-3xl px-4">
                <h1 class="text-4xl md:text-5xl font-bold">${content.headline}</h1>
                <p class="text-xl">${content.subheadline}</p>
                <div>
                  <a href="#signup" class="btn inline-block">${content.cta}</a>
                </div>
              </div>
            </div>
          </div>` : ''}
      </section>
    `;
  }

  // Add features section
  html += `
    <section id="features" class="py-16">
      <div class="container">
        <h2 class="text-3xl font-bold text-center mb-12 text-primary">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${content.features.map((feature: string, index: number) => `
            <div class="text-center p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary mb-4">
                ${index + 1}
              </div>
              <h3 class="text-xl font-bold mb-2">${feature}</h3>
              <p>Enhance your ${industry} experience with our cutting-edge solutions.</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Add testimonial section
  html += `
    <section id="testimonials" class="py-16 bg-secondary">
      <div class="container">
        <h2 class="text-3xl font-bold text-center mb-12 text-primary">What Our Clients Say</h2>
        <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div class="text-2xl italic mb-4">${content.testimonial.quote}</div>
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full bg-gray-300"></div>
            <div class="ml-4">
              <div class="font-bold">${content.testimonial.author}</div>
              <div class="text-sm text-gray-600">${content.testimonial.company}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Add FAQ section
  html += `
    <section id="faq" class="py-16">
      <div class="container">
        <h2 class="text-3xl font-bold text-center mb-12 text-primary">Frequently Asked Questions</h2>
        <div class="max-w-3xl mx-auto space-y-6">
          ${content.faqItems.map((item: any) => `
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-bold mb-2">${item.question}</h3>
              <p>${item.answer}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Add signup/CTA section
  html += `
    <section id="signup" class="py-16 bg-primary text-white">
      <div class="container text-center space-y-6">
        <h2 class="text-3xl font-bold">Ready to Get Started?</h2>
        <p class="text-xl max-w-2xl mx-auto">Join thousands of satisfied ${audience} who have transformed their ${industry} approach.</p>
        <form class="max-w-md mx-auto">
          <div class="flex flex-col md:flex-row gap-4">
            <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-3 rounded text-black" required />
            <button type="submit" class="px-6 py-3 bg-accent text-white font-bold rounded hover:bg-opacity-90">${content.cta}</button>
          </div>
        </form>
        <p class="text-sm opacity-75">By signing up, you agree to our Terms and Privacy Policy.</p>
      </div>
    </section>
  `;

  // Add footer
  html += `
    <footer class="py-8 bg-gray-800 text-white">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">About Us</h3>
            <p>We are dedicated to providing the best ${industry} solutions for ${audience}.</p>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a href="#features" class="hover:underline">Features</a></li>
              <li><a href="#testimonials" class="hover:underline">Testimonials</a></li>
              <li><a href="#faq" class="hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Contact</h3>
            <p>Email: info@example.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; ${new Date().getFullYear()} ${title}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;

  // Close the HTML
  html += `
    </body>
    </html>
  `;

  return html;
}
