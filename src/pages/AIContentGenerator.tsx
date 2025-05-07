
import Layout from "@/components/layout/Layout";
import AiContentGenerator from "@/components/AiContentGenerator";

const AIContentGeneratorPage = () => {
  return (
    <Layout title="AI Content Generator">
      <div className="container max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Content Generator</h1>
            <p className="text-muted-foreground">
              Use AI to optimize your landing page content for better conversions
            </p>
          </div>
          
          <AiContentGenerator />
          
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <h3 className="font-medium mb-2">Tips for effective content generation:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Be specific about the target audience and goal of your content</li>
              <li>Include relevant keywords you want to focus on</li>
              <li>For best results, provide context about your product or service</li>
              <li>Try different variations to find what works best</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIContentGeneratorPage;
