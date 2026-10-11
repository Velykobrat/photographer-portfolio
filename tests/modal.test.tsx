// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../src/components/Modal/Modal";

afterEach(cleanup);
const props = () => ({
  image: "photo.jpg",
  alt: "Portrait",
  current: 1,
  total: 3,
  onClose: vi.fn(),
  onNext: vi.fn(),
  onPrevious: vi.fn(),
});

it("keeps Tab and Shift+Tab inside the gallery and restores background interaction", async () => {
  const user = userEvent.setup();
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root);
  const trigger = document.createElement("button");
  root.appendChild(trigger);
  trigger.focus();
  const view = render(<Modal {...props()} />, { container: root });
  const close = screen.getByRole("button", { name: "Close image" });
  const next = screen.getByRole("button", { name: "Next image" });
  expect(document.activeElement).toBe(close);
  expect(root.inert).toBe(true);
  await user.tab({ shift: true });
  expect(document.activeElement).toBe(next);
  await user.tab();
  expect(document.activeElement).toBe(close);
  await user.tab();
  await user.tab();
  expect(document.activeElement).toBe(next);
  await user.tab();
  expect(document.activeElement).toBe(close);
  view.unmount();
  expect(root.inert).toBe(false);
  expect(document.body.style.overflow).toBe("");
  root.remove();
});

it("restores the persistent opener after unmount", () => {
  const opener = document.createElement("button");
  document.body.appendChild(opener);
  opener.focus();
  const view = render(<Modal {...props()} />);
  view.unmount();
  expect(document.activeElement).toBe(opener);
  opener.remove();
});

it("uses current callbacks for keyboard navigation and Escape", () => {
  const initial = props();
  const updated = props();
  const view = render(<Modal {...initial} />);
  view.rerender(<Modal {...updated} />);
  fireEvent.keyDown(document, { key: "ArrowRight" });
  fireEvent.keyDown(document, { key: "ArrowLeft" });
  fireEvent.keyDown(document, { key: "Escape" });
  expect(updated.onNext).toHaveBeenCalledOnce();
  expect(updated.onPrevious).toHaveBeenCalledOnce();
  expect(updated.onClose).toHaveBeenCalledOnce();
  expect(initial.onClose).not.toHaveBeenCalled();
});

it("ignores vertical gestures and navigates on horizontal swipes", () => {
  const callbacks = props();
  render(<Modal {...callbacks} />);
  const wrapper = screen.getByAltText("Portrait").parentElement!;
  fireEvent.touchStart(wrapper, { touches: [{ clientX: 100, clientY: 100 }] });
  fireEvent.touchEnd(wrapper, {
    changedTouches: [{ clientX: 30, clientY: 250 }],
  });
  expect(callbacks.onNext).not.toHaveBeenCalled();
  fireEvent.touchStart(wrapper, { touches: [{ clientX: 100, clientY: 100 }] });
  fireEvent.touchEnd(wrapper, {
    changedTouches: [{ clientX: 30, clientY: 110 }],
  });
  expect(callbacks.onNext).toHaveBeenCalledOnce();
});
