import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  padding?: number | string;
  style?: CSSProperties;
  className?: string;
}

export function Panel({ children, padding = 22, style, className, ...rest }: PanelProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: "var(--bg-panel, #12140f)",
        border: "1px solid var(--border-panel, rgba(255,255,255,0.07))",
        borderRadius: "14px",
        padding,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
