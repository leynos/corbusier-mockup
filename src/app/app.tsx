/** @file Application root wiring shared providers and the initial route shell. */

import type { JSX } from "react";
import { CommandPalette } from "./features/command-palette/command-palette";
import { CommandPaletteProvider } from "./features/command-palette/command-palette-provider";
import { ThemeProvider } from "./providers/theme-provider";
import { AppRoutes } from "./routes/app-routes";

/**
 * Entry point for the mockup SPA.
 *
 * @example
 * ```tsx
 * import App from "./app/app";
 *
 * export function Bootstrap() {
 *   return <App />;
 * }
 * ```
 */
export default function App(): JSX.Element {
  return (
    <ThemeProvider>
      <CommandPaletteProvider>
        <AppRoutes />
        <CommandPalette />
      </CommandPaletteProvider>
    </ThemeProvider>
  );
}
