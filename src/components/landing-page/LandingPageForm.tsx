
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ChevronRight } from "lucide-react";
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
import { Save } from "lucide-react";

// Form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  campaign_type: z.string().min(1, "Please select a campaign type"),
  industry: z.string().min(1, "Please select an industry"),
  audience: z.string().min(10, "Please describe your target audience"),
  keywords: z.string().min(3, "Please enter at least one keyword")
});

// Constants for select options
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

const MEDIA_TYPE_OPTIONS = [
  "Image",
  "Video",
  "Image and Video",
  "None"
];

const LAYOUT_OPTIONS = [
  "Image Top, Content Below",
  "Content Top, Image Below",
  "Content Left, Image Right",
  "Image Left, Content Right",
  "Full-Width Image Banner"
];

// Simple type for form values
export type LandingPageFormValues = {
  title: string;
  campaign_type: string;
  industry: string;
  audience: string;
  keywords: string;
};

interface LandingPageFormProps {
  initialValues?: LandingPageFormValues;
  onSubmit: (values: LandingPageFormValues) => Promise<void>;
  isGenerating: boolean;
  lastSaved: Date | null;
  autoSaving: boolean;
  mediaType: string;
  setMediaType: (value: string) => void;
  layoutStyle: string;
  setLayoutStyle: (value: string) => void;
}

export function LandingPageForm({
  initialValues,
  onSubmit,
  isGenerating,
  lastSaved,
  autoSaving,
  mediaType,
  setMediaType,
  layoutStyle,
  setLayoutStyle
}: LandingPageFormProps) {
  const form = useForm<LandingPageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      campaign_type: "",
      industry: "",
      audience: "",
      keywords: ""
    },
  });

  return (
    <Card className="shadow-lg border-primary/10 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">Create Your Landing Page</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Fill in the details below to generate a high-converting landing page
            </CardDescription>
          </div>
          {lastSaved && (
            <div className="text-xs text-muted-foreground flex items-center bg-background/80 px-2 py-1 rounded-full shadow-sm">
              {autoSaving ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin text-primary" />
                  <span>Auto-saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-1 text-primary" />
                  <span>Saved: {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Page Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Summer Sale Landing Page" 
                      {...field}
                      className="h-11 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="campaign_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Campaign Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
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
                    <FormLabel className="text-base font-medium">Industry</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="text-base font-medium">Media Type</FormLabel>
                <Select
                  onValueChange={setMediaType}
                  defaultValue={mediaType}
                  value={mediaType}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Media Types</SelectLabel>
                      {MEDIA_TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
              
              <FormItem>
                <FormLabel className="text-base font-medium">Layout Style</FormLabel>
                <Select
                  onValueChange={setLayoutStyle}
                  defaultValue={layoutStyle}
                  value={layoutStyle}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select layout style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Layout Styles</SelectLabel>
                      {LAYOUT_OPTIONS.map((style) => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Target Audience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your target audience (e.g. Small business owners aged 30-45 looking for accounting software)"
                      className="min-h-[120px] text-base resize-none"
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
                  <FormLabel className="text-base font-medium">Keywords</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter keywords separated by commas (e.g. digital marketing, SEO, content strategy)"
                      className="h-11 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="border-t bg-gradient-to-r from-accent/5 to-primary/5 pt-4">
            <Button 
              type="submit" 
              disabled={isGenerating} 
              className="w-full h-12 text-base shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Page...
                </>
              ) : (
                <>
                  Create Landing Page
                  <ChevronRight className="ml-1 h-5 w-5" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
