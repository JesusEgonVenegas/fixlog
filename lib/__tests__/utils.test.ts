import { describe, it, expect } from "vitest";
import { cn, stripMarkdown, validatePassword } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("handles Tailwind conflicts by keeping the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("stripMarkdown", () => {
  it("removes headings", () => {
    expect(stripMarkdown("# Hello")).toBe("Hello");
    expect(stripMarkdown("### Deep heading")).toBe("Deep heading");
  });

  it("removes bold and italic", () => {
    expect(stripMarkdown("**bold** and *italic*")).toBe("bold and italic");
  });

  it("removes fenced code blocks", () => {
    expect(stripMarkdown("before\n```js\ncode\n```\nafter")).toBe(
      "before after"
    );
  });

  it("removes inline code", () => {
    expect(stripMarkdown("use `console.log`")).toBe("use console.log");
  });

  it("removes links but keeps text", () => {
    expect(stripMarkdown("[click here](https://example.com)")).toBe(
      "click here"
    );
  });

  it("removes images but keeps alt text", () => {
    expect(stripMarkdown("![alt text](image.png)")).toBe("alt text");
  });

  it("removes list markers", () => {
    expect(stripMarkdown("- item one\n- item two")).toBe("item one item two");
  });

  it("removes blockquotes", () => {
    expect(stripMarkdown("> quoted text")).toBe("quoted text");
  });

  it("handles mixed content", () => {
    const input = "# Title\n\n**bold** and [link](url)\n\n> quote";
    const result = stripMarkdown(input);
    expect(result).toBe("Title bold and link quote");
  });
});

describe("validatePassword", () => {
  it("rejects passwords shorter than 8 characters", () => {
    expect(validatePassword("Ab1")).toContain("At least 8 characters");
  });

  it("rejects passwords without uppercase", () => {
    expect(validatePassword("abcdefg1")).toContain(
      "At least one uppercase letter"
    );
  });

  it("rejects passwords without lowercase", () => {
    expect(validatePassword("ABCDEFG1")).toContain(
      "At least one lowercase letter"
    );
  });

  it("rejects passwords without a number", () => {
    expect(validatePassword("Abcdefgh")).toContain("At least one number");
  });

  it("returns empty array for a valid password", () => {
    expect(validatePassword("Abcdefg1")).toEqual([]);
  });

  it("returns all failures at once", () => {
    const failures = validatePassword("");
    expect(failures).toHaveLength(4);
  });
});
