import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const companyLogos = [
  // Placeholder SVGs for company logos
  (
    <svg key="1" width="80" height="32" viewBox="0 0 80 32" fill="none"><rect width="80" height="32" rx="8" fill="#E5E7EB"/><text x="40" y="20" textAnchor="middle" fill="#6B7280" fontSize="16">Logo</text></svg>
  ),
  (
    <svg key="2" width="80" height="32" viewBox="0 0 80 32" fill="none"><rect width="80" height="32" rx="8" fill="#E5E7EB"/><text x="40" y="20" textAnchor="middle" fill="#6B7280" fontSize="16">Logo</text></svg>
  ),
  (
    <svg key="3" width="80" height="32" viewBox="0 0 80 32" fill="none"><rect width="80" height="32" rx="8" fill="#E5E7EB"/><text x="40" y="20" textAnchor="middle" fill="#6B7280" fontSize="16">Logo</text></svg>
  ),
  (
    <svg key="4" width="80" height="32" viewBox="0 0 80 32" fill="none"><rect width="80" height="32" rx="8" fill="#E5E7EB"/><text x="40" y="20" textAnchor="middle" fill="#6B7280" fontSize="16">Logo</text></svg>
  ),
];

const testimonials = [
  {
    name: "Jane Doe",
    title: "Growth Marketer",
    quote: "PagePulse.ai helped us double our conversion rate in just two weeks! The AI suggestions are spot on.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "John Smith",
    title: "Startup Founder",
    quote: "I created a high-converting landing page in minutes. The real-time metrics and optimization are game changers.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Lisa Wong",
    title: "E-commerce Owner",
    quote: "The best landing page tool I've ever used. The AI-driven insights are incredibly valuable.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const howItWorks = [
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="#F3F4F6"/><path d="M20 12v16M12 20h16" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Create",
    desc: "Input your campaign type, target audience, industry, and keywords. Our AI will generate a complete landing page.",
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="#F3F4F6"/><circle cx="20" cy="20" r="8" stroke="#6366F1" strokeWidth="2"/><path d="M20 12v8l6 3" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Track",
    desc: "Monitor real-time metrics like visitors, clicks, scroll depth, time on page, and bounce rate.",
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="#F3F4F6"/><path d="M16 24l4-8 4 8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Optimize",
    desc: "Receive AI-powered suggestions to improve your page based on performance data and apply them with one click.",
  },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-indigo-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow">
              <span className="font-bold text-lg text-primary-foreground">PP</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-primary">PagePulse.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-primary hover:underline">Login</Link>
            <Button asChild size="lg">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-20 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-white/60 to-indigo-200 animate-pulse opacity-60" />
          </div>
          <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              Create High-Converting Landing Pages with AI
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              PagePulse.ai automatically generates, optimizes, and improves your landing pages based on real-time performance data and AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" asChild className="text-lg px-8 py-4">
                <Link to="/register">Start for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4">
                <Link to="/login">See a Demo</Link>
              </Button>
            </div>
            {/* Explainer Video Placeholder */}
            <div className="mx-auto max-w-2xl aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-indigo-200 bg-white/80 flex items-center justify-center mb-8">
              <span className="text-muted-foreground text-lg">[ Explainer Video Coming Soon ]</span>
            </div>
            {/* Trust Logos */}
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-80 mb-2">
              {companyLogos}
            </div>
            <div className="text-xs text-muted-foreground mt-2">Trusted by top marketers and startups</div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white/80">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((step, i) => (
                <Card key={i} className="transition-transform hover:scale-105 hover:shadow-lg">
                  <CardHeader className="flex flex-col items-center">
                    <div className="mb-4">{step.icon}</div>
                    <CardTitle className="text-xl font-bold mb-2 text-center">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-center">{step.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <Card key={i} className="flex flex-col items-center p-6 shadow-md border-0 bg-white/90">
                  <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4 border-2 border-indigo-200 object-cover" />
                  <CardContent className="flex-1 flex flex-col items-center">
                    <CardDescription className="text-lg italic text-center mb-4">“{t.quote}”</CardDescription>
                    <div className="font-bold text-indigo-700">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.title}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-10 bg-white/90 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="font-bold text-xs text-primary-foreground">PP</span>
              </div>
              <span className="text-lg font-bold">PagePulse.ai</span>
            </div>
            <div className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} PagePulse.ai. All rights reserved.</div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">Dashboard</Link>
            <Link to="/register" className="text-sm text-muted-foreground hover:text-primary">Get Started</Link>
            <a href="mailto:support@pagepulse.ai" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
          </div>
          <form className="flex items-center gap-2">
            <input type="email" placeholder="Subscribe to updates" className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white" />
            <Button size="sm" type="submit">Subscribe</Button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default Home;
