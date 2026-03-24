/** @file Test utility that wraps `render` from `@testing-library/react` with
 * `ThemeProvider` and `CommandPaletteProvider`, providing the common context
 * required by most component tests.
 *
 * Usage: call `renderWithProviders(<MyComponent />)` instead of `render(…)`.
 */

import { type RenderOptions, type RenderResult, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

import { CommandPaletteProvider } from "../../src/app/features/command-palette/command-palette-provider";
import { ThemeProvider } from "../../src/app/providers/theme-provider";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {}

function ProviderStack({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CommandPaletteProvider>{children}</CommandPaletteProvider>
    </ThemeProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderResult {
  return render(ui, {
    wrapper: ProviderStack,
    ...options,
  });
}
