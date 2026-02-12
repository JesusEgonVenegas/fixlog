"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <PageContainer>
      <div className="mx-auto max-w-md pt-16">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
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
                            <span className={passed ? "text-green-500" : "text-muted-foreground"}>
                              {passed ? "\u2713" : "\u2022"}
                            </span>
                            <span className={passed ? "text-green-500" : "text-muted-foreground"}>
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
  );
}
