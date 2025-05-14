import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4">
      <div className="text-center space-y-6">
        <div className="mx-auto w-32 h-32 flex items-center justify-center animate-bounce-slow">
          {/* Beautiful 404 SVG illustration */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" fill="#f3f4f6" stroke="#a5b4fc" strokeWidth="4" />
            <text x="50%" y="54%" textAnchor="middle" fill="#6366f1" fontSize="36" fontWeight="bold" dy=".3em">404</text>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">Page Not Found</h1>
        <p className="text-lg text-muted-foreground">Sorry, the page you are looking for does not exist or has been moved.</p>
        <Button asChild size="lg" className="text-lg px-8 py-4 mt-4">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
