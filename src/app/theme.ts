import { createTheme, type MantineColorsTuple } from "@mantine/core";

// rn.ninja design tokens
const accentBlue: MantineColorsTuple = [
  "#eef3ff",
  "#d6e2ff",
  "#aec6ff",
  "#85a8ff",
  "#4c7dff",
  "#3766f0",
  "#2955d9",
  "#1e46c2",
  "#1638a3",
  "#0f2b85",
];

const dangerCoral: MantineColorsTuple = [
  "#ffece7",
  "#ffd7cc",
  "#ffb3a0",
  "#ff9678",
  "#ff7a5c",
  "#f5674a",
  "#db5740",
  "#b84636",
  "#95382b",
  "#732a20",
];

const warningAmber: MantineColorsTuple = [
  "#fff8e1",
  "#ffedb3",
  "#ffe085",
  "#ffd35c",
  "#ffbd2e",
  "#e6a821",
  "#cc9319",
  "#a67512",
  "#805a0d",
  "#594009",
];

const infoBlue: MantineColorsTuple = [
  "#eaf1ff",
  "#d3e2ff",
  "#aac6ff",
  "#95b7ff",
  "#7aa9ff",
  "#5f91e6",
  "#4a79cc",
  "#3861a6",
  "#2a4a80",
  "#1c3459",
];

const greenSuccess: MantineColorsTuple = [
  "#e7fbec",
  "#c6f5d1",
  "#93edac",
  "#66e587",
  "#3fdb5a",
  "#33c34d",
  "#28a840",
  "#1e8a32",
  "#166b26",
  "#0e4c1a",
];

export const theme = createTheme({
  primaryColor: "accent",
  primaryShade: 4,
  autoContrast: true,
  luminanceThreshold: 0.6,
  colors: {
    accent: accentBlue,
    danger: dangerCoral,
    warning: warningAmber,
    info: infoBlue,
    success: greenSuccess,
  },
  fontFamily: "'Space Grotesk', sans-serif",
  fontFamilyMonospace: "'JetBrains Mono', monospace",
  headings: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: "600",
  },
  defaultRadius: "md",
  radius: {
    xs: "6px",
    sm: "8px",
    md: "8px",
    lg: "14px",
    xl: "14px",
  },
  black: "#0b0d0c",
  white: "#eef2ee",
  other: {
    bgDarkest: "#0b0d0c",
    bgPanel: "#12140f",
    bgPanelAlt: "#0f110d",
    textPrimary: "#eef2ee",
    textSecondary: "#a9b3ac",
    textMuted: "#7d8880",
    textMutedDark: "#5f6a62",
    accent: "#4c7dff",
    danger: "#ff7a5c",
    warning: "#ffbd2e",
    success: "#3fdb5a",
    successAlt: "#7aa0ff",
    info: "#7aa9ff",
    radiusPill: "100px",
    sidebarBg: "#0f110d",
    sidebarWidth: "252px",
    sidebarWidthCollapsed: "76px",
    borderSubtle: "rgba(255,255,255,0.06)",
    borderPanel: "rgba(255,255,255,0.07)",
    borderInput: "rgba(255,255,255,0.08)",
  },
  components: {
    Card: {
      defaultProps: {
        radius: "lg",
      },
    },
    Paper: {
      defaultProps: {
        radius: "lg",
      },
    },
    Button: {
      defaultProps: {
        radius: "sm",
      },
    },
    Badge: {
      defaultProps: {
        radius: "100px",
      },
    },
  },
});
