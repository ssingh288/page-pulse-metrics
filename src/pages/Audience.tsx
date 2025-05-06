
import Layout from "@/components/layout/Layout";

const Audience = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audience Insights</h2>
          <p className="text-muted-foreground mt-2">
            Understand your audience demographics and behavior
          </p>
        </div>

        <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
          <div className="text-center">
            <h3 className="text-lg font-medium">Audience Insights Feature Coming Soon</h3>
            <p className="text-muted-foreground mt-2">
              This feature will be available in the next update
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Audience;
