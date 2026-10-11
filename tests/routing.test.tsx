// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "../src/App";

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(cleanup);

it.each([
  "/missing-page",
  "/collections/missing-series",
  "/journal/missing-article",
])(
  "shows a useful not-found screen at %s and clears noindex when leaving",
  async (path) => {
    window.history.replaceState({}, "", path);
    render(<App />);
    await screen.findByRole("heading", { name: "Page not found" });
    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute("content"),
    ).toBe("noindex, follow");
    fireEvent.click(
      screen.getByRole("link", { name: "Explore the portfolio →" }),
    );
    await screen.findByRole("heading", { name: "Portfolio", exact: true });
    await waitFor(() =>
      expect(
        document.querySelector('meta[name="robots"]')?.getAttribute("content"),
      ).toBe("index, follow"),
    );
  },
);

it("resets scroll on navigation between main pages", async () => {
  window.history.replaceState({}, "", "/contacts");
  render(<App />);
  vi.mocked(window.scrollTo).mockClear();
  fireEvent.click(screen.getByRole("link", { name: "Journal", exact: true }));
  await screen.findByRole("heading", { name: "Journal", exact: true });
  expect(window.scrollTo).toHaveBeenCalledWith({
    top: 0,
    left: 0,
    behavior: "instant",
  });
});
