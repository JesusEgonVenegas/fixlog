import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")       // fenced code blocks
    .replace(/`([^`]+)`/g, "$1")           // inline code
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")  // links
    .replace(/^#{1,6}\s+/gm, "")           // headings
    .replace(/(\*\*|__)(.*?)\1/g, "$2")    // bold
    .replace(/(\*|_)(.*?)\1/g, "$2")       // italic
    .replace(/~~(.*?)~~/g, "$1")           // strikethrough
    .replace(/^\s*[-*+]\s+/gm, "")        // unordered list markers
    .replace(/^\s*\d+\.\s+/gm, "")        // ordered list markers
    .replace(/^>\s+/gm, "")               // blockquotes
    .replace(/\n{2,}/g, " ")              // collapse multiple newlines
    .replace(/\n/g, " ")                  // remaining newlines
    .trim();
}
