/** @file Tests for the sign-in screen. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { SignInScreen } from "../src/app/features/auth/sign-in-screen";
import { renderWithProviders } from "./utils/render-with-providers";

describe("SignInScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the email and password fields", () => {
    renderWithProviders(<SignInScreen />);
    expect(screen.getByLabelText(/email address/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
  });

  it("renders the submit button", () => {
    renderWithProviders(<SignInScreen />);
    expect(screen.getByRole("button", { name: /sign in to workspace/i })).toBeTruthy();
  });

  it("renders the brand name", () => {
    renderWithProviders(<SignInScreen />);
    expect(screen.getByText("CORBUSIER")).toBeTruthy();
  });
});
