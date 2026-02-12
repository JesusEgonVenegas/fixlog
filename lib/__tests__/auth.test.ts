import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
} from "@/lib/auth";

const store: Record<string, string> = {};

beforeEach(() => {
  for (const key in store) delete store[key];

  vi.stubGlobal("window", globalThis);
  vi.stubGlobal(
    "localStorage",
    {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    },
  );
});

describe("token helpers", () => {
  it("saves and retrieves a token", () => {
    saveToken("abc123");
    expect(getToken()).toBe("abc123");
  });

  it("returns null when no token is stored", () => {
    expect(getToken()).toBeNull();
  });

  it("removeToken clears both token and user", () => {
    saveToken("tok");
    saveUser({ id: "1", name: "A", email: "a@b.c" });
    removeToken();
    expect(getToken()).toBeNull();
    expect(getUser()).toBeNull();
  });
});

describe("user helpers", () => {
  it("saves and retrieves a user via JSON round-trip", () => {
    const user = { id: "1", name: "Alice", email: "alice@example.com" };
    saveUser(user);
    expect(getUser()).toEqual(user);
  });

  it("returns null for invalid JSON", () => {
    store["fixlog_user"] = "{bad json";
    expect(getUser()).toBeNull();
  });

  it("returns null when no user is stored", () => {
    expect(getUser()).toBeNull();
  });
});
