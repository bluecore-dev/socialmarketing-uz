import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to extract localized content from backend JSONB objects
export function useLocalized(content: any, lang: string, fallback: string = "") {
  if (!content) return fallback;
  return content[lang] || content["uz"] || content["en"] || content["ru"] || fallback;
}
