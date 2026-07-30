import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Tool } from "../tool/Tool";

type Theme = "light" | "dark";

function preferredTheme(): Theme {
  return typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function App() {
  const [theme, setTheme] = useState<Theme>(preferredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="site-title" href="./" aria-label="Online Teleprompter home">
          Online Teleprompter
        </a>
        <button
          className="icon-button"
          type="button"
          aria-label={`Use ${theme === "light" ? "dark" : "light"} theme`}
          onClick={() =>
            setTheme((current) => (current === "light" ? "dark" : "light"))
          }
        >
          {theme === "light" ? <Moon aria-hidden /> : <Sun aria-hidden />}
        </button>
      </header>

      <main>
        <section className="tool-introduction" aria-labelledby="tool-title">
          <p className="eyebrow">Browser-local utility</p>
          <h1 id="tool-title">Online Teleprompter</h1>
          <p>Read a script at a controlled pace with adjustable typography, mirroring, focus mode, fullscreen presentation, and keyboard controls.</p>
        </section>

        <section className="tool-workspace" aria-label="Tool workspace">
          <Tool />
        </section>

        <details className="information-section">
          <summary>How to use this tool</summary>
          <div className="information-content">
            <ol>
            <li>{"Enter or paste the script and adjust its reading and display settings."}</li>
            <li>{"Start the countdown, then pause, resume, or restart the scrolling presentation."}</li>
            <li>{"Use focus, mirror, guide, fullscreen, or keyboard controls as needed."}</li>
            </ol>
          </div>
        </details>
      </main>

      <footer className="site-footer">
        <span>MIT licensed.</span>
        <a href="https://eburp.com/">Originally developed for eBURP</a>
      </footer>
    </div>
  );
}
