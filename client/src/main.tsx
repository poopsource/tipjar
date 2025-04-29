import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TipContextProvider } from "./context/TipContext";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <TipContextProvider>
      <App />
    </TipContextProvider>
  </ThemeProvider>
);
