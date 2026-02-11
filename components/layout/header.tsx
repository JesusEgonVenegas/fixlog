"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wrench, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    setMobileOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Wrench className="h-5 w-5" />
          FixLog
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/problems">Problems</Link>
          </Button>
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {user?.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-1 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </>
              )}
            </>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t px-4 py-3 sm:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            asChild
            onClick={() => setMobileOpen(false)}
          >
            <Link href="/problems">Problems</Link>
          </Button>
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <span className="px-3 py-1 text-sm text-muted-foreground">
                    {user?.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    asChild
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="justify-start"
                    asChild
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/register">Sign up</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  );
}
