
import { RegisterForm } from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md mb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-xl text-primary-foreground">O</span>
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold">OptimizeAI</h1>
          <p className="mt-2 text-muted-foreground">
            Create an account to get started
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
