import { Problem } from "@/types";

export const mockProblems: Problem[] = [
  {
    id: "1",
    title: "NGINX returns 502 Bad Gateway after deploy",
    description:
      "After deploying a new version of the Node.js app, NGINX started returning 502 errors. The app was running but on a different port than NGINX expected.",
    solution:
      "The PM2 ecosystem config had the wrong port. Updated ecosystem.config.js to use PORT=3000 and restarted with `pm2 reload all`. Also added a health check endpoint.",
    tags: ["nginx", "deployment", "node.js", "pm2"],
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-01-15T10:30:00Z",
    userId: "user-1",
  },
  {
    id: "2",
    title: "Docker container OOM killed in production",
    description:
      "Java Spring Boot container kept getting killed by the OOM killer. `dmesg` showed memory cgroup limit reached. Container had 512MB limit.",
    solution:
      "Set JVM heap to 70% of container memory with `-XX:MaxRAMPercentage=70.0`. Also added `-XX:+UseContainerSupport` flag. Bumped container limit to 1GB for this service.",
    tags: ["docker", "java", "memory", "kubernetes"],
    createdAt: "2026-01-20T14:15:00Z",
    updatedAt: "2026-01-20T14:15:00Z",
    userId: "user-1",
  },
  {
    id: "3",
    title: "SSH connection drops after idle timeout",
    description:
      "SSH sessions to remote servers kept dropping after a few minutes of inactivity. Had to reconnect constantly during debugging sessions.",
    solution:
      "Added `ServerAliveInterval 60` and `ServerAliveCountMax 3` to `~/.ssh/config`. Also set `TCPKeepAlive yes`. For the server side, updated `/etc/ssh/sshd_config` with `ClientAliveInterval 120`.",
    tags: ["ssh", "linux", "networking"],
    createdAt: "2026-01-22T09:00:00Z",
    updatedAt: "2026-01-22T09:00:00Z",
    userId: "user-1",
  },
  {
    id: "4",
    title: "PostgreSQL slow query on large table join",
    description:
      "A report query joining users and orders tables (10M+ rows) was taking over 30 seconds. EXPLAIN showed sequential scans on both tables.",
    solution:
      "Added a composite index on orders(user_id, created_at). Also rewrote the query to use a CTE for the date filtering before the join. Query went from 30s to 200ms.",
    tags: ["postgresql", "performance", "sql", "indexing"],
    createdAt: "2026-02-01T11:45:00Z",
    updatedAt: "2026-02-01T11:45:00Z",
    userId: "user-1",
  },
  {
    id: "5",
    title: "Git merge conflict in package-lock.json",
    description:
      "Every branch merge resulted in massive conflicts in package-lock.json. Manual resolution was error-prone and time-consuming.",
    solution:
      "Added `.gitattributes` with `package-lock.json merge=ours` and configured the merge driver. On conflicts, just run `npm install` to regenerate the lockfile. Also set up a pre-commit hook to validate it.",
    tags: ["git", "npm", "workflow"],
    createdAt: "2026-02-03T16:20:00Z",
    updatedAt: "2026-02-03T16:20:00Z",
    userId: "user-1",
  },
  {
    id: "6",
    title: "Arch Linux pacman keyring issues after long update gap",
    description:
      "Running `pacman -Syu` after not updating for 3 months failed with PGP signature errors. Keys were expired or unknown.",
    solution:
      "Ran `pacman-key --init && pacman-key --populate archlinux` followed by `pacman -Sy archlinux-keyring` before the full system update. For future, set up a weekly timer to keep keyring fresh.",
    tags: ["arch-linux", "pacman", "gpg"],
    createdAt: "2026-02-05T08:10:00Z",
    updatedAt: "2026-02-05T08:10:00Z",
    userId: "user-1",
  },
  {
    id: "7",
    title: "TypeScript paths not resolving in Jest tests",
    description:
      "Jest tests failed with 'Cannot find module @/lib/utils'. The path aliases worked fine in Next.js but Jest didn't understand them.",
    solution:
      "Added `moduleNameMapper` in `jest.config.ts` to map `@/(.*)` to `<rootDir>/$1`. Also needed `ts-jest` configured with the correct tsconfig. Alternatively, could use `pathsToModuleNameMapper` from ts-jest.",
    tags: ["typescript", "jest", "testing", "next.js"],
    createdAt: "2026-02-07T13:30:00Z",
    updatedAt: "2026-02-07T13:30:00Z",
    userId: "user-1",
  },
  {
    id: "8",
    title: "Systemd service fails to start after reboot",
    description:
      "Custom systemd service for a Python web app wouldn't start after reboot. `journalctl -u myapp` showed the database wasn't ready yet when the service tried to connect.",
    solution:
      "Added `After=postgresql.service` and `Requires=postgresql.service` to the unit file. Also added `Restart=on-failure` with `RestartSec=5` as a safety net. Ran `systemctl daemon-reload` and enabled the service.",
    tags: ["systemd", "linux", "postgresql", "python"],
    createdAt: "2026-02-09T17:00:00Z",
    updatedAt: "2026-02-09T17:00:00Z",
    userId: "user-1",
  },
  {
    id: "9",
    title: "CORS errors when calling API from React dev server",
    description:
      "Fetch requests from localhost:3000 to the API at localhost:5000 were blocked by CORS policy. Browser console showed 'No Access-Control-Allow-Origin header'.",
    solution:
      "Added CORS middleware to the .NET API: `builder.Services.AddCors()` and `app.UseCors(p => p.WithOrigins(\"http://localhost:3000\").AllowAnyHeader().AllowAnyMethod())`. Put `UseCors()` before `UseAuthorization()`.",
    tags: ["cors", "react", ".net", "api"],
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
    userId: "user-1",
  },
  {
    id: "10",
    title: "Bluetooth headphones no audio on Linux",
    description:
      "Bluetooth headphones paired successfully but no audio output. PulseAudio showed the device but selecting it produced silence. `bluetoothctl info` showed the device connected.",
    solution:
      "Installed `pulseaudio-bluetooth` and `bluez-utils`. Restarted PulseAudio with `pulseaudio -k && pulseaudio --start`. The A2DP profile wasn't loading - fixed by adding `Enable=Source,Sink,Media,Socket` to `/etc/bluetooth/audio.conf`.",
    tags: ["bluetooth", "linux", "audio", "pulseaudio"],
    createdAt: "2026-02-10T15:30:00Z",
    updatedAt: "2026-02-10T15:30:00Z",
    userId: "user-1",
  },
];

export function getAllTags(problems: Problem[]): string[] {
  const tagSet = new Set<string>();
  problems.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
