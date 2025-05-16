
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Search, 
  MousePointerClick, 
  MessageSquare, 
  BarChart4,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AIInsights = () => {
  return (
    <Layout title="AI Optimization Insights">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">AI Optimization Insights</h1>
            <p className="text-muted-foreground">
              Detailed analysis and recommendations for your landing page
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/create-page">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Creator
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* SEO Insights */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                SEO Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="border-b pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Header Structure</h3>
                    <Badge>High Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Optimized H1, H2, and H3 tags with strategic keyword placement to improve search engine visibility.
                  </p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Keyword Density</h3>
                    <Badge variant="outline">Medium Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Balanced keyword distribution throughout the content to avoid over-optimization while maintaining relevance.
                  </p>
                </li>
                <li>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Meta Content</h3>
                    <Badge variant="outline">Medium Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Added descriptive meta tags and structured data to enhance search engine understanding of page content.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Conversion Insights */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MousePointerClick className="h-5 w-5 text-primary" />
                Conversion Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="border-b pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Call-to-Action</h3>
                    <Badge>High Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Strategically placed CTAs with action-oriented text to guide users through the conversion funnel.
                  </p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Visual Hierarchy</h3>
                    <Badge variant="outline">Medium Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Improved the visual flow to draw attention to key conversion elements and reduce distractions.
                  </p>
                </li>
                <li>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Form Optimization</h3>
                    <Badge>High Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simplified form fields and added trust indicators to reduce friction and increase completion rates.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Content Insights */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Content Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="border-b pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Persuasive Copy</h3>
                    <Badge>High Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enhanced content with benefit-focused messaging that addresses user pain points and offers solutions.
                  </p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Social Proof</h3>
                    <Badge variant="outline">Medium Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Added testimonials, reviews, and trust indicators to build credibility and reduce purchase anxiety.
                  </p>
                </li>
                <li>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Readability</h3>
                    <Badge variant="outline">Medium Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Improved paragraph structure, sentence length, and content flow for better comprehension and engagement.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* UX Insights */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart4 className="h-5 w-5 text-primary" />
                UX Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="border-b pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Page Structure</h3>
                    <Badge>High Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reorganized content sections to create a more intuitive flow that guides users through the value proposition.
                  </p>
                </li>
                <li className="border-b pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Mobile Optimization</h3>
                    <Badge>High Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enhanced responsive design elements to ensure optimal viewing and interaction experience on all devices.
                  </p>
                </li>
                <li>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Load Time</h3>
                    <Badge variant="outline">Medium Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Optimized page assets and structure to reduce loading time and improve the overall user experience.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Expert Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Based on our analysis, we recommend focusing on the following areas to further improve your landing page performance:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <span className="font-medium">A/B Testing:</span> Test different versions of your headline and primary CTA to identify the highest-converting variants.
                </li>
                <li>
                  <span className="font-medium">Visual Content:</span> Add more high-quality images or videos that demonstrate your product benefits in action.
                </li>
                <li>
                  <span className="font-medium">Social Proof:</span> Include additional customer testimonials with specific results and outcomes to build credibility.
                </li>
                <li>
                  <span className="font-medium">Mobile Experience:</span> Further refine the mobile layout to ensure easy navigation and clear CTAs on smaller screens.
                </li>
                <li>
                  <span className="font-medium">Performance:</span> Continue monitoring page speed and make adjustments to keep loading times under 3 seconds.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIInsights;
