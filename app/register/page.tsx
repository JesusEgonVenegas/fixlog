"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { useAuth } from "@/hooks/use-auth";
import { validatePassword } from "@/lib/utils";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (validatePassword(password).length > 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      toast.success("Account created successfully");
      router.push("/problems");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-[calc(100vh-56px)]"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.22 0.05 168 / 0.3), transparent)",
      }}
    >
      <PageContainer>
        <div className="mx-auto max-w-md pt-16">
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2 text-lg font-bold tracking-wide">
                <Wrench className="h-5 w-5 text-primary" />
                FixLog
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
              <CardDescription>
                Sign up for FixLog to start tracking your fixes.
              </CardDescription>
            </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {password && (() => {
                  const failing = validatePassword(password);
                  return (
                    <ul className="space-y-1 text-sm">
                      {[
                        "At least 8 characters",
                        "At least one uppercase letter",
                        "At least one lowercase letter",
                        "At least one number",
                      ].map((rule) => {
                        const passed = !failing.includes(rule);
                        return (
                          <li key={rule} className="flex items-center gap-2">
                            <span className={passed ? "text-primary" : "text-muted-foreground"}>
                              {passed ? "✓" : "•"}
                            </span>
                            <span className={passed ? "text-primary" : "text-muted-foreground"}>
                              {rule}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  );
                })()}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
