// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
} from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import Series from "../src/pages/Series/Series";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function showSeries() {
  return render(
    <MemoryRouter initialEntries={["/collections/inlight"]}>
      <Link to="/collections/serhii-kyiv">Another series</Link>
      <Routes>
        <Route path="/collections/:slug" element={<Series />} />
      </Routes>
    </MemoryRouter>,
  );
}

it("ignores a stale response even if the old fetch does not honour cancellation", async () => {
  let finishOld!: (response: Response) => void;
  const fetch = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          finishOld = resolve;
        }),
    )
    .mockResolvedValueOnce(
      Response.json({ resources: [{ public_id: "new-photo" }] }),
    );
  vi.stubGlobal("fetch", fetch);
  showSeries();
  const oldSignal = fetch.mock.calls[0][1].signal as AbortSignal;
  fireEvent.click(screen.getByText("Another series"));
  await screen.findByRole("button", { name: "Open Serhii Kyiv — photo 1" });
  expect(oldSignal.aborted).toBe(true);
  await act(async () => {
    finishOld(Response.json({ resources: [{ public_id: "old-photo" }] }));
  });
  expect(
    screen.getByAltText("Serhii Kyiv — photo 1").getAttribute("src"),
  ).toContain("new-photo");
  expect(screen.queryByAltText("Inlight — photo 1")).toBeNull();
});

it("allows retry after a failed photo list request", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockRejectedValueOnce(new Error("Network"))
      .mockResolvedValueOnce(
        Response.json({ resources: [{ public_id: "portrait" }] }),
      ),
  );
  showSeries();
  await screen.findByRole("alert");
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  await screen.findByRole("button", { name: "Open Inlight — photo 1" });
  expect(screen.queryByRole("alert")).toBeNull();
});

it("shows an empty state for a series without photos", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ resources: [] })),
  );
  showSeries();
  await screen.findByText("Photographs will be added to this series soon.");
});

it("rejects malformed photo metadata without crashing", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ resources: [null] })),
  );
  showSeries();
  await screen.findByRole("alert");
});
