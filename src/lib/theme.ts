import type { CSSProperties } from "react";
import type { TenantTheme } from "@/db/schema";

const VAR_BY_KEY: Record<keyof TenantTheme, string> = {
  bg: "--bg",
  surface: "--surface",
  ink: "--ink",
  ink2: "--ink-2",
  ink3: "--ink-3",
  ink4: "--ink-4",
  line: "--line",
  lineStrong: "--line-strong",
  brand: "--brand",
};

/**
 * Tenant colours override the defaults in globals.css by being set on <html>.
 * Anything left blank keeps the stock palette.
 */
export function themeStyle(theme: TenantTheme | null | undefined): CSSProperties {
  if (!theme) return {};
  const style: Record<string, string> = {};
  for (const [key, cssVar] of Object.entries(VAR_BY_KEY)) {
    const value = theme[key as keyof TenantTheme];
    if (value) style[cssVar] = value;
  }
  return style as CSSProperties;
}

/** Translucent header/nav background derived from the tenant background colour. */
export function chromeBackground(theme: TenantTheme | null | undefined) {
  const hex = theme?.bg ?? "#f7f4ec";
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return "rgba(247, 244, 236, 0.85)";
  const int = parseInt(match[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, 0.85)`;
}
