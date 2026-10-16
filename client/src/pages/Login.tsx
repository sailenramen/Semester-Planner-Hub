import { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = isRegister
      ? await register(name.trim(), email.trim(), password)
      : await login(email.trim(), password);
    setSubmitting(false);
    // On success AuthContext sets the user and the app replaces this page.
    if (!result.success) {
      setError(result.error || "Something went wrong");
    }
  };

  const switchMode = () => {
    setError(null);
    setMode(isRegister ? "signin" : "register");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background" data-testid="login-page">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{isRegister ? "Create account" : "Sign in"}</CardTitle>
          <CardDescription>
            {isRegister ? "Start tracking your semester." : "Welcome back to your study planner."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-name"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
                minLength={isRegister ? 6 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
              />
              {isRegister && <p className="text-xs text-muted-foreground">At least 6 characters.</p>}
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert" data-testid="login-error">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={submitting} data-testid="button-submit-auth">
              {submitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
            </Button>
          </form>
          <button
            type="button"
            onClick={switchMode}
            className="mt-4 w-full text-sm text-muted-foreground hover:underline"
            data-testid="button-switch-auth-mode"
          >
            {isRegister ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
