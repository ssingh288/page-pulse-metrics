import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const AIContentGeneratorPage = () => {
  const navigate = useNavigate();
  
  // Redirect to landing page creator since this feature is now unified
  useEffect(() => {
    navigate('/create-landing');
  }, [navigate]);
  
  return (
    <Layout title="Redirecting...">
      <div className="container max-w-4xl">
        <div className="space-y-6 text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <h1 className="text-3xl font-bold mb-2">Redirecting to Landing Page Creator</h1>
          <p className="text-muted-foreground">
            The AI Content Generator has been integrated into our Landing Page Creator for a more streamlined experience.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AIContentGeneratorPage;
