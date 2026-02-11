import { Problem } from "@/types";

export const mockProblems: Problem[] = [
  // --- Tech ---
  {
    id: "1",
    title: "NGINX returns 502 Bad Gateway after deploy",
    description:
      "After deploying a new version of the Node.js app, NGINX started returning 502 errors on every request. The app process was running but NGINX couldn't reach it.",
    solution: `The PM2 ecosystem config had the wrong port. The app was listening on **3001** but NGINX was proxying to **3000**.

\`\`\`nginx
# /etc/nginx/sites-available/myapp
upstream backend {
    server 127.0.0.1:3000;
}
\`\`\`

Fixed \`ecosystem.config.js\`:

\`\`\`js
module.exports = {
  apps: [{
    name: "myapp",
    script: "dist/index.js",
    env: { PORT: 3000 }  // was 3001
  }]
};
\`\`\`

Then reloaded: \`pm2 reload all && sudo nginx -t && sudo systemctl reload nginx\``,
    tags: ["nginx", "deployment", "node.js", "pm2"],
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-01-15T10:30:00Z",
    userId: "user-1",
  },
  {
    id: "2",
    title: "Docker container OOM killed in production",
    description:
      "Java Spring Boot container kept getting killed by the OOM killer. `dmesg` showed memory cgroup limit reached. Container had a 512MB limit but the JVM was allocating more.",
    solution: `Set JVM heap to 70% of container memory and enabled container support:

\`\`\`dockerfile
ENV JAVA_OPTS="-XX:MaxRAMPercentage=70.0 -XX:+UseContainerSupport"
\`\`\`

Also bumped the container limit to **1GB** for this service since 512MB was too tight even with the fix:

\`\`\`yaml
resources:
  limits:
    memory: "1Gi"
  requests:
    memory: "512Mi"
\`\`\``,
    tags: ["docker", "java", "memory", "kubernetes"],
    createdAt: "2026-01-20T14:15:00Z",
    updatedAt: "2026-01-20T14:15:00Z",
    userId: "user-1",
  },
  {
    id: "3",
    title: "React useEffect runs twice in development",
    description:
      "My `useEffect` that fetches data fires twice on component mount in Next.js dev mode. This causes double API calls and sometimes race conditions with stale data.",
    solution: `This is expected in React 18+ **Strict Mode** — it intentionally double-invokes effects in development to surface missing cleanups.

The fix is to add a cleanup function with an abort controller:

\`\`\`tsx
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/data", { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name !== "AbortError") throw err;
    });

  return () => controller.abort();
}, []);
\`\`\`

This only happens in dev — production runs the effect once.`,
    tags: ["react", "hooks", "next.js"],
    createdAt: "2026-01-25T09:00:00Z",
    updatedAt: "2026-01-25T09:00:00Z",
    userId: "user-1",
  },
  {
    id: "4",
    title: "PostgreSQL slow query on large table join",
    description:
      "A report query joining `users` and `orders` tables (10M+ rows) was taking over 30 seconds. `EXPLAIN ANALYZE` showed sequential scans on both tables.",
    solution: `Added a composite index on the columns used in the join and WHERE clause:

\`\`\`sql
CREATE INDEX idx_orders_user_date
ON orders (user_id, created_at DESC);
\`\`\`

Also rewrote the query to use a CTE for date filtering **before** the join:

\`\`\`sql
WITH recent_orders AS (
  SELECT * FROM orders
  WHERE created_at >= NOW() - INTERVAL '30 days'
)
SELECT u.name, COUNT(*) as order_count
FROM users u
JOIN recent_orders o ON o.user_id = u.id
GROUP BY u.name;
\`\`\`

Query went from **30s to 200ms**.`,
    tags: ["postgresql", "performance", "sql"],
    createdAt: "2026-02-01T11:45:00Z",
    updatedAt: "2026-02-01T11:45:00Z",
    userId: "user-1",
  },
  // --- Household ---
  {
    id: "5",
    title: "Washing machine error code F21 — won't drain",
    description:
      "Whirlpool front-load washer stopped mid-cycle with F21 error. Water sitting in the drum. Machine won't start a new cycle.",
    solution: `F21 means **long drain** — the pump can't empty the water fast enough.

1. Opened the small access panel at the bottom-front of the machine
2. Put towels down and slowly unscrewed the drain filter cap
3. Found a sock and a bunch of coins jamming the pump impeller
4. Cleaned the filter, screwed it back in
5. Ran a drain-and-spin cycle to confirm — drained perfectly

**Tip:** Check pockets before washing and clean this filter every few months.`,
    tags: ["appliance", "washing-machine", "repair"],
    createdAt: "2026-02-02T08:30:00Z",
    updatedAt: "2026-02-02T08:30:00Z",
    userId: "user-1",
  },
  {
    id: "6",
    title: "Refrigerator not cooling but freezer works fine",
    description:
      "Fridge compartment was around 50°F (should be 37°F). Freezer was working normally. Checked the thermostat — it was set correctly.",
    solution: `The **evaporator fan** in the freezer compartment was iced over and couldn't circulate cold air into the fridge section.

Steps:
1. Unplugged the fridge for 24 hours with doors open (full defrost)
2. Heard the fan start spinning again after plugging back in
3. Temperature dropped to 37°F within 6 hours

**Root cause:** The defrost drain at the back of the freezer was clogged with ice, preventing the auto-defrost cycle from working. Cleared it with warm water and a turkey baster. Haven't had the issue since.`,
    tags: ["appliance", "refrigerator", "repair"],
    createdAt: "2026-02-03T14:00:00Z",
    updatedAt: "2026-02-03T14:00:00Z",
    userId: "user-1",
  },
  // --- Car ---
  {
    id: "7",
    title: "Check engine light — code P0420 (catalytic converter)",
    description:
      "Check engine light came on in my 2018 Honda Civic. OBD2 scanner showed P0420: \"Catalyst System Efficiency Below Threshold (Bank 1)\". Car runs fine otherwise.",
    solution: `Before replacing the catalytic converter ($1000+), tried the cheaper fixes first:

1. **Checked for exhaust leaks** — found none
2. **Replaced the downstream O2 sensor** ($45 part, 15 min job) — this was it!

The sensor was reading incorrectly and making the ECU think the cat was failing. Cleared the code with the OBD2 scanner, drove 100+ miles — light hasn't come back.

**Lesson:** P0420 doesn't always mean a bad cat. The downstream O2 sensor is the first thing to check and the cheapest fix.`,
    tags: ["car", "check-engine", "honda", "diagnostics"],
    createdAt: "2026-02-04T10:15:00Z",
    updatedAt: "2026-02-04T10:15:00Z",
    userId: "user-1",
  },
  {
    id: "8",
    title: "Car battery dies overnight — parasitic draw",
    description:
      "Battery kept dying overnight. New battery, alternator tested fine. Something was draining the battery when the car was off.",
    solution: `Found the parasitic draw using a multimeter:

1. Disconnected the negative battery cable
2. Set multimeter to **DC amps** (20A range)
3. Connected meter in series between the negative cable and battery post
4. Reading: **350mA** (should be under 50mA)
5. Started pulling fuses one by one — draw dropped to 30mA when I pulled the **trunk light fuse**

The trunk light switch was stuck and the light stayed on 24/7. Replaced the switch ($8 part). Draw is now 25mA — battery holds charge perfectly.`,
    tags: ["car", "battery", "electrical", "diagnostics"],
    createdAt: "2026-02-05T16:30:00Z",
    updatedAt: "2026-02-05T16:30:00Z",
    userId: "user-1",
  },
  // --- Home repair ---
  {
    id: "9",
    title: "Squeaky door hinge that WD-40 didn't fix",
    description:
      "Bedroom door squeaked loudly every time it opened. Tried WD-40 multiple times — it would fix it for a day then the squeak came back worse.",
    solution: `WD-40 is a **solvent**, not a lubricant — it displaces existing grease and evaporates.

The actual fix:
1. Tapped out the hinge pins with a nail and hammer (tap from the bottom)
2. Cleaned the pins and hinge barrels with steel wool
3. Applied **white lithium grease** to each pin
4. Tapped pins back in

Dead silent for 6+ months now. White lithium grease stays put unlike WD-40.`,
    tags: ["home-repair", "door", "maintenance"],
    createdAt: "2026-02-06T11:00:00Z",
    updatedAt: "2026-02-06T11:00:00Z",
    userId: "user-1",
  },
  // --- Cooking ---
  {
    id: "10",
    title: "Sourdough bread too dense and gummy inside",
    description:
      "My sourdough loaves kept coming out dense with a gummy, undercooked crumb. Good oven spring and nice crust but the inside was heavy and wet.",
    solution: `Two problems, both related to **underproofing** and **underbaking**:

**Proofing fix:**
- Was bulk fermenting for 4 hours at room temp — not enough for my starter
- Switched to the **poke test**: dough is ready when a floured finger poke springs back slowly and leaves a slight indent
- Ended up needing ~6 hours at 72°F

**Baking fix:**
- Was pulling the bread at 200°F internal temp — too low for sourdough
- Now bake until internal temp hits **210°F**
- Also added 20 min with the lid off for better crust

The crumb is now open and airy with no gummy spots.`,
    tags: ["cooking", "sourdough", "baking"],
    createdAt: "2026-02-07T09:45:00Z",
    updatedAt: "2026-02-07T09:45:00Z",
    userId: "user-1",
  },
  // --- Math/School ---
  {
    id: "11",
    title: "Quadratic equation with complex roots — kept getting stuck",
    description:
      "Was solving x² + 2x + 5 = 0 and kept getting a negative discriminant. Didn't know how to proceed when b² - 4ac < 0.",
    solution: `A negative discriminant means the roots are **complex numbers** (no real solutions).

For **x² + 2x + 5 = 0** where a=1, b=2, c=5:

- Discriminant: b² - 4ac = 4 - 20 = **-16**
- √(-16) = 4i (where i = √-1)

Using the quadratic formula:
- x = (-b ± √(b²-4ac)) / 2a
- x = (-2 ± 4i) / 2
- **x = -1 + 2i** and **x = -1 - 2i**

Quick check: both roots are conjugates (same real part, opposite imaginary part) — which is always the case for quadratics with real coefficients.`,
    tags: ["math", "algebra", "complex-numbers"],
    createdAt: "2026-02-08T15:20:00Z",
    updatedAt: "2026-02-08T15:20:00Z",
    userId: "user-1",
  },
];

export function getAllTags(problems: Problem[]): string[] {
  const tagSet = new Set<string>();
  problems.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
