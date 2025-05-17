import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./material3.css"; // Material 3 Design System
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <App />
  </ThemeProvider>
);
