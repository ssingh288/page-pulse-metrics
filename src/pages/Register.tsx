import { useEffect } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
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
              Create your free account to start building and optimizing landing pages with AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="flex justify-between items-center mt-2">
              <Link to="/" className="text-sm text-primary hover:underline">Back to Home</Link>
              <Link to="/login" className="text-sm text-primary hover:underline">Already have an account?</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
