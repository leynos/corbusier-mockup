import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { HeaderBar } from "../src/app/layout/header-bar";
import { axe } from "./utils/axe";
import { renderWithProviders } from "./utils/render-with-providers";

describe("HeaderBar accessibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("meets axe rules with inline theme and language controls", async () => {
    const { container } = renderWithProviders(<HeaderBar />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
