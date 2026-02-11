import Link from "next/link";
import { Search, Tags, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";

const features = [
  {
    icon: Search,
    title: "Fuzzy Search",
    description:
      "Find any fix instantly with smart fuzzy search across titles, descriptions, and solutions.",
  },
  {
    icon: Tags,
    title: "Tag & Organize",
    description:
      "Categorize problems with tags like 'nginx', 'docker', or 'linux' for quick filtering.",
  },
  {
    icon: Zap,
    title: "Quick Capture",
    description:
      "Record problems and solutions fast so you can get back to what you were doing.",
  },
];

const demoProblem = [
  {
    title: "NGINX returns 502 Bad Gateway after deploy",
    tags: ["nginx", "deployment", "node.js"],
    preview:
      "PM2 ecosystem config had the wrong port. Updated ecosystem.config.js to use PORT=3000...",
  },
  {
    title: "Docker container OOM killed in production",
    tags: ["docker", "java", "memory"],
    preview:
      "Set JVM heap to 70% of container memory with -XX:MaxRAMPercentage=70.0...",
  },
  {
    title: "SSH connection drops after idle timeout",
    tags: ["ssh", "linux", "networking"],
    preview:
      "Added ServerAliveInterval 60 and ServerAliveCountMax 3 to ~/.ssh/config...",
  },
];

export default function Home() {
  return (
    <>
      <section className="py-20 md:py-32">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Never lose a fix{" "}
              <span className="text-muted-foreground">again</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A dedicated home for the problems you solve, the diagnoses you
              make, and the fixes you discover. Search your personal knowledge
              base in seconds.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/problems?demo=true">View Demo</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="border-t bg-muted/50 py-16">
        <PageContainer>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="py-16">
        <PageContainer>
          <h2 className="mb-8 text-center text-2xl font-bold">
            Your fixes, organized
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {demoProblem.map((p) => (
              <Card key={p.title}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base leading-snug">
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {p.preview}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>
    </>
  );
}
