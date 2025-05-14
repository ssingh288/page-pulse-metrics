import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import LandingPageCreator from "./pages/LandingPageCreator";
import LandingPages from "./pages/LandingPages";
import LandingPageEditor from "./pages/LandingPageEditor";
import PageMetrics from "./pages/PageMetrics";
import KeywordsManager from "./pages/KeywordsManager";
import Media from "./pages/Media";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import AIOptimizer from "./pages/AIOptimizer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/pages" element={<ProtectedRoute><LandingPages /></ProtectedRoute>} />
              <Route path="/create-page" element={<ProtectedRoute><LandingPageCreator /></ProtectedRoute>} />
              <Route path="/pages/:id/edit" element={<ProtectedRoute><LandingPageEditor /></ProtectedRoute>} />
              <Route path="/pages/:id/metrics" element={<ProtectedRoute><PageMetrics /></ProtectedRoute>} />
              <Route path="/pages/:id/keywords" element={<ProtectedRoute><KeywordsManager /></ProtectedRoute>} />
              <Route path="/pages/:id/ai-optimize" element={<ProtectedRoute><AIOptimizer /></ProtectedRoute>} />
              <Route path="/media" element={<ProtectedRoute><Media /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
