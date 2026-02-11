"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";

export function MarkdownRenderer({ content }: { content: string }) {
  const { resolvedTheme } = useTheme();
  const syntaxTheme = resolvedTheme === "dark" ? oneDark : oneLight;

  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const inline = !match && !className;
      if (inline) {
        return (
          <code
            className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <SyntaxHighlighter
          style={syntaxTheme}
          language={match?.[1] ?? "text"}
          PreTag="div"
          customStyle={{ borderRadius: "0.5rem", fontSize: "0.85em" }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    },
    h1: ({ children }) => (
      <h1 className="mb-3 mt-6 text-xl font-bold first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-2 mt-5 text-lg font-semibold first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }) => (
      <ul className="mb-3 ml-5 list-disc space-y-1 last:mb-0">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-3 ml-5 list-decimal space-y-1 last:mb-0">
        {children}
      </ol>
    ),
    li: ({ children }) => <li>{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="mb-3 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground last:mb-0">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="mb-3 overflow-x-auto last:mb-0">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-border bg-muted px-3 py-1.5 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-3 py-1.5">{children}</td>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-primary underline underline-offset-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="my-4 border-border" />,
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
  };

  return (
    <div className="text-sm leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
