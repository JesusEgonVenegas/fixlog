"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function LandingCTA() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button size="lg" disabled>Get Started</Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/problems?demo=true">View Demo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      {isAuthenticated ? (
        <Button size="lg" asChild>
          <Link href="/problems">Go to Problems</Link>
        </Button>
      ) : (
        <Button size="lg" asChild>
          <Link href="/register">Get Started</Link>
        </Button>
      )}
      <Button variant="outline" size="lg" asChild>
        <Link href="/problems?demo=true">View Demo</Link>
      </Button>
    </div>
  );
}
