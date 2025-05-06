
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const INDUSTRY_OPTIONS = [
  "E-commerce",
  "Software/SaaS",
  "Education",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Travel",
  "Marketing",
  "Fitness",
  "Food & Beverage",
  "Consulting",
  "Entertainment",
  "Manufacturing",
  "Non-profit",
  "Other"
];

const CAMPAIGN_TYPES = [
  "Lead Generation",
  "Product Launch",
  "Webinar Registration",
  "Event Promotion",
  "Newsletter Signup",
  "Sale/Discount Promotion",
  "Product Demo",
  "Free Trial",
  "Consultation Booking",
  "Case Study/Whitepaper Download",
  "Other"
];

// Create form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  campaign_type: z.string().min(1, "Please select a campaign type"),
  industry: z.string().min(1, "Please select an industry"),
  audience: z.string().min(10, "Please describe your target audience"),
  keywords: z.string().min(3, "Please enter at least one keyword")
});

const LandingPageCreator = () => {
  const [generatingPage, setGeneratingPage] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      campaign_type: "",
      industry: "",
      audience: "",
      keywords: ""
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) {
        toast.error("You must be logged in to create a page");
        return;
      }

      setGeneratingPage(true);

      // Process keywords into an array
      const keywordsArray = values.keywords
        .split(",")
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      // Create sample HTML content
      const sampleHtml = generateSampleHtml(values.title, values.audience, keywordsArray[0] || "");

      // Save to Supabase
      const { data, error } = await supabase
        .from('landing_pages')
        .insert([{
          user_id: user.id,
          title: values.title,
          campaign_type: values.campaign_type,
          industry: values.industry,
          audience: values.audience,
          initial_keywords: keywordsArray,
          html_content: sampleHtml
        }])
        .select();

      if (error) {
        throw error;
      }

      // Add initial keywords
      if (data && data[0]) {
        const pageId = data[0].id;
        
        // Process each keyword individually to avoid array insert issues
        for (const keyword of keywordsArray) {
          await supabase.from('keywords').insert({
            page_id: pageId,
            keyword: keyword,
            // Dummy data for now - convert string to number
            volume: Math.floor(Math.random() * 5000),
            cpc: parseFloat((Math.random() * 5).toFixed(2))
          });
        }
        
        toast.success("Landing page created successfully!");
        navigate(`/pages/${pageId}/edit`);
      }
    } catch (error: any) {
      toast.error(`Error creating page: ${error.message}`);
    } finally {
      setGeneratingPage(false);
    }
  };

  const generateSampleHtml = (title: string, audience: string, mainKeyword: string) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; margin: 0; color: #333; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
            header { padding: 80px 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-align: center; }
            h1 { font-size: 2.5rem; margin-bottom: 1rem; }
            .subheader { font-size: 1.25rem; max-width: 800px; margin: 0 auto 2rem; }
            .cta-button { background: #f59e0b; color: white; border: none; padding: 12px 24px; font-size: 1rem; border-radius: 4px; cursor: pointer; font-weight: 600; }
            section { padding: 60px 0; }
            .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
            .feature { padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .feature h3 { margin-top: 0; }
          </style>
        </head>
        <body>
          <header>
            <div class="container">
              <h1>${title}</h1>
              <p class="subheader">Perfect solution for ${audience} looking for ${mainKeyword}</p>
              <button class="cta-button">Get Started Now</button>
            </div>
          </header>
          <section>
            <div class="container">
              <h2>Why Choose Us</h2>
              <div class="features">
                <div class="feature">
                  <h3>Feature 1</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.</p>
                </div>
                <div class="feature">
                  <h3>Feature 2</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.</p>
                </div>
                <div class="feature">
                  <h3>Feature 3</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.</p>
                </div>
              </div>
            </div>
          </section>
          <footer>
            <div class="container" style="text-align: center; padding: 20px; color: #666;">
              &copy; ${new Date().getFullYear()} ${title}. All rights reserved.
            </div>
          </footer>
        </body>
      </html>
    `;
  };

  return (
    <Layout title="Create Landing Page">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Landing Page</CardTitle>
            <CardDescription>
              Fill in the details below to generate your AI-optimized landing page
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Summer Sale Landing Page" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="campaign_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select campaign type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Campaign Types</SelectLabel>
                              {CAMPAIGN_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Industries</SelectLabel>
                              {INDUSTRY_OPTIONS.map((industry) => (
                                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your target audience (e.g. Small business owners aged 30-45 looking for accounting software)"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter keywords separated by commas (e.g. digital marketing, SEO, content strategy)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={generatingPage} className="w-full">
                  {generatingPage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Landing Page"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

const generateSampleHtml = (title: string, audience: string, mainKeyword: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.5; margin: 0; color: #333; }
          .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          header { padding: 80px 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-align: center; }
          h1 { font-size: 2.5rem; margin-bottom: 1rem; }
          .subheader { font-size: 1.25rem; max-width: 800px; margin: 0 auto 2rem; }
          .cta-button { background: #f59e0b; color: white; border: none; padding: 12px 24px; font-size: 1rem; border-radius: 4px; cursor: pointer; font-weight: 600; }
          section { padding: 60px 0; }
          .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
          .feature { padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .feature h3 { margin-top: 0; }
        </style>
      </head>
      <body>
        <header>
          <div class="container">
            <h1>${title}</h1>
            <p class="subheader">Perfect solution for ${audience} looking for ${mainKeyword}</p>
            <button class="cta-button">Get Started Now</button>
          </div>
        </header>
        <section>
          <div class="container">
            <h2>Why Choose Us</h2>
            <div class="features">
              <div class="feature">
                <h3>Feature 1</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.</p>
              </div>
              <div class="feature">
                <h3>Feature 2</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.</p>
              </div>
              <div class="feature">
                <h3>Feature 3</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.</p>
              </div>
            </div>
          </div>
        </section>
        <footer>
          <div class="container" style="text-align: center; padding: 20px; color: #666;">
            &copy; ${new Date().getFullYear()} ${title}. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  `;
};

export default LandingPageCreator;
