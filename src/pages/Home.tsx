
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-xs text-primary-foreground">PP</span>
            </div>
            <span className="text-xl font-bold">PagePulse.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-primary hover:underline">
              Login
            </Link>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Create High-Converting Landing Pages with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              PagePulse.ai automatically generates, optimizes, and improves your landing pages
              based on real-time performance data and AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/register">Start for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">See a Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Create</h3>
                <p className="text-muted-foreground">
                  Input your campaign type, target audience, industry, and keywords.
                  Our AI will generate a complete landing page.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Track</h3>
                <p className="text-muted-foreground">
                  Monitor real-time metrics like visitors, clicks, scroll depth, 
                  time on page, and bounce rate.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Optimize</h3>
                <p className="text-muted-foreground">
                  Receive AI-powered suggestions to improve your page based on 
                  performance data and apply them with one click.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PagePulse.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
