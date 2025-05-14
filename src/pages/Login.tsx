
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  
  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    
    try {
      setIsResetting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-md mb-8">
        <Card className="shadow-xl border-0 bg-white/90">
          <CardHeader className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow mb-2">
              <span className="font-bold text-xl text-primary-foreground">PP</span>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-primary mb-1">PagePulse.ai</CardTitle>
            <CardDescription className="text-base text-muted-foreground mb-2 text-center">
              {showForgotPassword
                ? "Enter your email to reset your password"
                : "Welcome back! Sign in to your account to access your dashboard and AI-powered landing pages."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showForgotPassword ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={isResetting}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isResetting || !resetEmail.trim()}
                >
                  {isResetting ? "Sending..." : "Send Reset Email"}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="w-full text-sm text-muted-foreground"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to login
                </Button>
              </form>
            ) : (
              <>
                <LoginForm />
                <div className="flex justify-between items-center mt-2">
                  <Link to="/" className="text-sm text-primary hover:underline">Back to Home</Link>
                  <Link to="/register" className="text-sm text-primary hover:underline">Create Account</Link>
                </div>
                <div className="text-right mt-2">
                  <Button 
                    variant="link" 
                    className="text-xs text-muted-foreground hover:text-primary p-0"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
