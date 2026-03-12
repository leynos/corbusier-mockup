import { type RenderOptions, type RenderResult, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

import { ThemeProvider } from "../../src/app/providers/theme-provider";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {}

function ProviderStack({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
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
