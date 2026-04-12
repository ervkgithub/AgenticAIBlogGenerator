import { createGlobalStyle } from "styled-components";

export const theme = {
  colors: {
    bg: "#06131f",
    bgAccent: "#0b2338",
    panel: "rgba(6, 19, 31, 0.82)",
    panelStrong: "#10273d",
    line: "rgba(255, 255, 255, 0.08)",
    text: "#eef6fb",
    muted: "#8eacbf",
    cyan: "#41d9ff",
    green: "#53f2a1",
    amber: "#ffcb6b",
    red: "#ff6f91"
  },
  shadows: {
    panel: "0 18px 45px rgba(0, 0, 0, 0.25)"
  },
  radius: {
    lg: "28px",
    md: "20px",
    sm: "14px"
  }
};

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #__next {
    margin: 0;
    min-height: 100%;
    font-family: "Segoe UI", "Helvetica Neue", sans-serif;
    background:
      radial-gradient(circle at top left, rgba(65, 217, 255, 0.14), transparent 32%),
      radial-gradient(circle at top right, rgba(83, 242, 161, 0.1), transparent 28%),
      linear-gradient(160deg, #05101a 0%, #081a29 46%, #02070b 100%);
    color: ${({ theme }) => theme.colors.text};
  }

  body {
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }
`;
