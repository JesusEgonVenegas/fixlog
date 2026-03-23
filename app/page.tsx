import { Search, Tags, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { LandingCTA } from "@/components/landing-cta";
import { LivingNebula } from "@/components/ui/living-nebula";

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
    title: "Washing machine error code F21 — won't drain",
    tags: ["appliance", "washing-machine", "repair"],
    preview:
      "Found a sock and coins jamming the pump impeller. Cleaned the drain filter...",
  },
  {
    title: "Check engine light — code P0420",
    tags: ["car", "check-engine", "diagnostics"],
    preview:
      "Replaced the downstream O2 sensor ($45 part) instead of the catalytic converter...",
  },
];

export default function Home() {
  return (
    <>
      <LivingNebula />
      <section className="py-20 md:py-32">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
              Never lose a fix{" "}
              <span className="text-primary">again</span>
            </h1>
            <p className="mt-6 mx-auto max-w-lg text-xl text-muted-foreground">
              A dedicated home for the problems you solve, the diagnoses you
              make, and the fixes you discover. Search your personal knowledge
              base in seconds.
            </p>
            <LandingCTA />
          </div>
        </PageContainer>
      </section>

      <section className="border-y border-primary/10 bg-background/80 py-16 backdrop-blur-sm">
        <PageContainer>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/15">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="bg-background/80 py-16 backdrop-blur-sm">
        <PageContainer>
          <h2 className="mb-8 text-center text-2xl font-bold">
            Your fixes,{" "}
            <span className="text-primary">organized</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {demoProblem.map((p) => (
              <Card
                key={p.title}
                className="border-primary/10 transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
              >
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
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {t}
                      </span>
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
