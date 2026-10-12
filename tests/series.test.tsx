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
function showSeries(language = '') {
  return render(
    <MemoryRouter initialEntries={[`${language}/collections/inlight`]}>
      <Link to="/collections/serhii-kyiv">Another series</Link>
      <Routes>
        <Route path="/collections/:slug" element={<Series />} />
        <Route path="/uk/collections/:slug" element={<Series />} />
        <Route path="/collections" element={<h1>English portfolio</h1>} />
        <Route path="/uk/collections" element={<h1>Українське портфоліо</h1>} />
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

function touch(x: number, y = 300, identifier = 0) {
  return { clientX: x, clientY: y, identifier };
}

function swipePage(target: HTMLElement, endX = 180, endY = 310) {
  fireEvent.touchStart(target, { touches: [touch(60)] });
  fireEvent.touchMove(target, { touches: [touch(endX, endY)] });
  fireEvent.touchEnd(target, { touches: [], changedTouches: [touch(endX, endY)] });
}

it.each(['', '/uk'])('returns to the localized portfolio after a right swipe (%s)', async language => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ resources: [{ public_id: 'portrait' }] })));
  showSeries(language);
  const card = await screen.findByRole('button', { name: /Open Inlight/ });
  // A swipe can begin over a photograph anywhere down the page.
  swipePage(card);
  expect(screen.getByRole('heading', { name: language ? 'Українське портфоліо' : 'English portfolio' })).toBeTruthy();
  expect(screen.queryByRole('dialog')).toBeNull();
});

it.each([[20, 300], [180, 500], [100, 300]])('ignores left, vertical and short gestures (%s, %s)', async (x, y) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ resources: [] })));
  showSeries();
  await screen.findByText('Photographs will be added to this series soon.');
  swipePage(screen.getByRole('main'), x, y);
  expect(screen.getByRole('heading', { name: 'Inlight' })).toBeTruthy();
});

it('ignores cancelled gestures and multitouch', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ resources: [] })));
  showSeries();
  await screen.findByText('Photographs will be added to this series soon.');
  const main = screen.getByRole('main');
  fireEvent.touchStart(main, { touches: [touch(60)] });
  fireEvent.touchCancel(main);
  fireEvent.touchEnd(main, { touches: [], changedTouches: [touch(180)] });
  expect(screen.getByRole('heading', { name: 'Inlight' })).toBeTruthy();
  fireEvent.touchStart(main, { touches: [touch(60)] });
  fireEvent.touchMove(main, { touches: [touch(100), touch(120, 300, 1)] });
  fireEvent.touchEnd(main, { touches: [], changedTouches: [touch(180)] });
  expect(screen.getByRole('heading', { name: 'Inlight' })).toBeTruthy();
});

it('keeps photo swipes inside the viewer and disables page swipes while it is open', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ resources: [{ public_id: 'a' }, { public_id: 'b' }] })));
  showSeries();
  fireEvent.click(await screen.findByRole('button', { name: 'Open Inlight — photo 1' }));
  const image = screen.getByRole('dialog').querySelector('img')!;
  swipePage(image);
  expect(screen.getByRole('dialog').querySelector('img')!.alt).toBe('Inlight — photo 2');
  swipePage(screen.getByRole('main'));
  expect(screen.getByRole('heading', { name: 'Inlight' })).toBeTruthy();
  expect(screen.getByRole('dialog')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Close image' }));
  swipePage(screen.getByRole('main'));
  expect(screen.getByRole('heading', { name: 'English portfolio' })).toBeTruthy();
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
