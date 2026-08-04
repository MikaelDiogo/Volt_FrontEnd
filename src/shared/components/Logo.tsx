import type { CSSProperties } from "react";
import { useMantineColorScheme } from "@mantine/core";
import logoWhite from "@/assets/volt_logo_white.png";
import logoBlue from "@/assets/volt_logo_blue.png";
import markWhite from "@/assets/volt_V_white.png";
import markBlue from "@/assets/volt_V_blue.png";

interface LogoProps {
  height?: number;
  style?: CSSProperties;
  /** "full" renders the whole wordmark; "mark" renders just the "V" glyph,
   * for compact spaces like the collapsed sidebar. */
  variant?: "full" | "mark";
}

export function Logo({ height = 32, style, variant = "full" }: LogoProps) {
  const { colorScheme } = useMantineColorScheme();
  const isLight = colorScheme === "light";
  const src = variant === "mark" ? (isLight ? markBlue : markWhite) : isLight ? logoBlue : logoWhite;

  return (
    <img
      src={src}
      alt={variant === "mark" ? "Volt" : "Volt Soluções Tecnológicas"}
      style={{ height, width: "auto", objectFit: "contain", display: "block", ...style }}
    />
  );
}
