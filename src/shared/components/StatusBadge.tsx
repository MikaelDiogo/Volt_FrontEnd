import type { CSSProperties } from "react";

interface StatusStyle {
  bg: string;
  color: string;
  label?: string;
}

const DEFAULT_STYLE: StatusStyle = { bg: "rgba(255,255,255,0.08)", color: "#a9b3ac" };

// Portuguese-label statuses (as shown in the mockup) and equivalent
// ServiceOrderStatus enum values are both supported via normalized-key lookup.
const STATUS_MAP: Record<string, StatusStyle> = {
  aberta: { bg: "rgba(76,125,255,0.12)", color: "#4c7dff" },
  "em diagnostico": { bg: "rgba(76,125,255,0.12)", color: "#4c7dff" },
  pending: { bg: "rgba(76,125,255,0.12)", color: "#4c7dff", label: "Aberta" },

  "em reparo": { bg: "rgba(255,189,46,0.14)", color: "#ffbd2e" },
  in_repair: { bg: "rgba(255,189,46,0.14)", color: "#ffbd2e", label: "Em Reparo" },

  "aguardando aprovacao": { bg: "rgba(122,169,255,0.14)", color: "#7aa9ff" },

  pronta: { bg: "rgba(39,201,63,0.16)", color: "#3fdb5a" },
  ready: { bg: "rgba(39,201,63,0.16)", color: "#3fdb5a", label: "Pronta" },

  entregue: { bg: "rgba(255,255,255,0.08)", color: "#a9b3ac" },
  delivered: { bg: "rgba(255,255,255,0.08)", color: "#a9b3ac", label: "Entregue" },

  cancelada: { bg: "rgba(255,255,255,0.08)", color: "#ff7a5c" },
  cancelled: { bg: "rgba(255,255,255,0.08)", color: "#ff7a5c", label: "Cancelada" },
};

function normalize(status: string): string {
  return status
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

export interface StatusBadgeProps {
  status?: string;
  label?: string;
  style?: CSSProperties;
  className?: string;
}

export function StatusBadge({ status, label, style, className }: StatusBadgeProps) {
  const key = status ? normalize(status) : "";
  const config = STATUS_MAP[key] ?? DEFAULT_STYLE;
  const text = label ?? config.label ?? status ?? "—";

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "100px",
        padding: "4px 10px",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: 1.2,
        backgroundColor: config.bg,
        color: config.color,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </span>
  );
}
