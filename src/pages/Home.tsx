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

const keyFeatures = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#EEF2FF"/><path d="M16 10v12M10 16h12" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "1-Click AI Landing Pages",
    desc: "Instantly generate high-converting landing pages tailored to your business and audience.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#F0FDFA"/><path d="M16 8v16M8 16h16" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Real-Time Metrics",
    desc: "Track visitors, engagement, conversions, and more with live analytics.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FEF9C3"/><path d="M16 8l8 8-8 8-8-8 8-8z" stroke="#F59E42" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "AI Optimization",
    desc: "Get actionable AI suggestions to improve your page and ad performance.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FDF2F8"/><path d="M16 8v16M8 16h16" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Ad Generator",
    desc: "Create and preview ads for Facebook, Instagram, LinkedIn, Google, WhatsApp, and more.",
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
      {/* Logo on top left */}
      <div className="absolute top-0 left-0 px-4 pt-4 z-30 flex items-center">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow">
          <span className="font-bold text-lg text-primary-foreground">PP</span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-white ml-2">PagePulse.ai</span>
      </div>
      {/* Login/Get Started on top right */}
      <div className="absolute top-0 right-0 px-4 pt-4 z-30 flex gap-2">
        <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white bg-transparent font-semibold px-4 py-2" style={{ borderColor: '#fff' }}>
          <a href="/login">Login</a>
        </Button>
        <Button asChild className="bg-[#ff2d7a] hover:bg-[#e0266c] text-white font-semibold px-4 py-2 border-0">
          <a href="/register">Get Started</a>
        </Button>
      </div>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden bg-[#2d174c] pb-0">
          {/* Headline spanning both columns */}
          <div className="w-full flex flex-col items-center justify-center mt-12 mb-4 px-4">
            <h1 className="text-center text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
              Smarter Landing Pages. Higher Conversions.
            </h1>
            <div className="w-full flex justify-center">
              <span className="block text-center text-4xl md:text-5xl font-extrabold italic text-white mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Zero Guesswork!
              </span>
            </div>
          </div>

          {/* Main hero content - two columns below headline */}
          <div className="relative z-10 w-full flex flex-col md:flex-row items-start justify-center pb-8 px-4 gap-12 max-w-7xl mx-auto">
            {/* Left: Subheadline, bullets, buttons */}
            <div className="flex-1 flex flex-col items-start text-left max-w-2xl mt-0">
              <p className="text-lg md:text-xl mb-8 text-white/90 font-medium max-w-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                PagePulse.ai is a specialist AI tool designed exclusively for landing page optimization. Unlike SEO tools that drive traffic, we focus on what really matters: <span className="font-semibold text-white">conversion</span>.<br /><br />
                Whether you're running a lead gen campaign, launching a new product, or scaling ads, PagePulse helps you:
              </p>
              <ul className="text-left mb-10 max-w-xl space-y-4 text-lg md:text-xl font-normal text-white">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-400">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#00b386"/><path d="M7 13.5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span>Auto-generate landing pages based on your audience, industry, and campaign goals</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-400">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#00b386"/><path d="M7 13.5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span>Track real-time performance: scroll depth, button clicks, bounce rate & more</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-400">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#00b386"/><path d="M7 13.5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span>Get AI-powered suggestions instantly to improve copy, layout, and keywords</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-400">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#00b386"/><path d="M7 13.5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span>Continuously optimize for click-through and conversion rates, not just traffic</span>
                </li>
              </ul>
              {/* See Pricing and Request Demo buttons, left-aligned below bullets */}
              <div className="flex flex-row gap-4 mt-2 justify-start w-full">
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white bg-transparent font-semibold px-6 py-2" style={{ borderColor: '#fff' }}>
                  <a href="/pricing">See Pricing</a>
                </Button>
                <Button asChild className="bg-[#ff2d7a] hover:bg-[#e0266c] text-white font-semibold px-6 py-2 border-0">
                  <a href="/register">Request Demo</a>
                </Button>
              </div>
            </div>
            {/* Right: Images - person + floating cards, right aligned */}
            <div className="flex-1 flex flex-col items-center md:items-end justify-center w-full mt-0 gap-6 relative min-h-[400px]">
              {/* Person image (centered in right column) */}
              <div className="relative flex items-center justify-center w-full min-h-[400px]">
                <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&q=80" alt="Person" className="rounded-2xl shadow-xl w-64 h-80 object-cover z-10" />
                {/* Floating cards - absolutely positioned around the person */}
                <div className="absolute left-0 top-8 w-40 bg-white/95 rounded-xl shadow-lg p-4 flex flex-col items-start gap-2 border border-gray-100 z-20">
                  <span className="text-xs font-bold text-[#a259ff]">Insights</span>
                  <span className="text-xs text-gray-700">Drop off <span className="font-bold text-yellow-500">89%</span></span>
                  <span className="text-xs text-gray-700">Time Spent <span className="font-bold text-yellow-500">34s</span></span>
                </div>
                <div className="absolute right-0 top-0 w-56 bg-white/95 rounded-xl shadow-lg p-4 border border-gray-100 flex flex-col gap-2 z-20">
                  <span className="text-xs font-bold text-[#ff2d7a]">Test</span>
                  <div className="bg-gray-50 rounded p-2 text-xs text-gray-700">Form A/B Test</div>
                  <span className="text-xs text-green-600 font-bold">+37% Form Submissions</span>
                </div>
                <div className="absolute right-8 bottom-0 w-48 bg-white/95 rounded-xl shadow-lg p-4 border border-gray-100 flex flex-col gap-2 z-20">
                  <span className="text-xs font-bold text-[#00b386]">Personalize</span>
                  <div className="bg-gray-50 rounded p-2 text-xs text-gray-700">Extra 15 days free!</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-12 bg-white/90">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {keyFeatures.map((f, i) => (
                <Card key={i} className="flex flex-col items-center p-6 shadow border-0 bg-white/95">
                  <div className="mb-4">{f.icon}</div>
                  <CardTitle className="text-lg font-bold mb-2 text-center">{f.title}</CardTitle>
                  <CardContent className="flex-1 flex flex-col items-center">
                    <CardDescription className="text-base text-center">{f.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
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

        {/* Request Free Trial Card */}
        <section className="py-16 bg-white/80">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <Card className="max-w-lg w-full p-8 shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center mb-2">Request a Free Trial</CardTitle>
                <CardDescription className="text-center mb-4">Try PagePulse.ai free for 14 days. No credit card required. We'll reach out with your access link!</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4">
                  <input type="text" placeholder="Your Name" className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" required />
                  <input type="email" placeholder="Your Email" className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" required />
                  <input type="text" placeholder="Business Name" className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" required />
                  <Button type="submit" size="lg" className="mt-2">Request Free Trial</Button>
                </form>
              </CardContent>
            </Card>
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
