// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "../src/components/ContactForm/ContactForm";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
async function fillForm() {
  const user = userEvent.setup();
  render(<ContactForm />);
  await user.type(screen.getByLabelText("Your name", { exact: false }), "Anna");
  await user.type(
    screen.getByLabelText("How can I contact you?", { exact: false }),
    "@anna",
  );
  await user.click(
    screen.getByRole("button", { name: "Portrait", exact: true }),
  );
  await user.click(
    screen.getByRole("checkbox", {
      name: "I agree to be contacted regarding this request.",
    }),
  );
  return user;
}

it("preserves the inquiry when delivery fails", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        Response.json(
          { error: "Please contact me directly." },
          { status: 502 },
        ),
      ),
  );
  const user = await fillForm();
  await user.click(screen.getByRole("button", { name: "Send request" }));
  await screen.findByText("Please contact me directly.");
  expect(
    (screen.getByLabelText("Your name", { exact: false }) as HTMLInputElement)
      .value,
  ).toBe("Anna");
});

it("does not show success for an unexpected HTTP 200 response", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response("<html>fallback</html>")),
  );
  const user = await fillForm();
  await user.click(screen.getByRole("button", { name: "Send request" }));
  await screen.findByText(
    "We could not confirm your request. Please contact me directly.",
  );
  expect(
    (screen.getByLabelText("Your name", { exact: false }) as HTMLInputElement)
      .value,
  ).toBe("Anna");
});

it("prevents duplicate submissions while delivery is in progress, then resets on confirmed success", async () => {
  let finish!: (response: Response) => void;
  const fetch = vi.fn(
    () =>
      new Promise<Response>((resolve) => {
        finish = resolve;
      }),
  );
  vi.stubGlobal("fetch", fetch);
  const user = await fillForm();
  const form = screen
    .getByRole("button", { name: "Send request" })
    .closest("form")!;
  await user.click(screen.getByRole("button", { name: "Send request" }));
  fireEvent.submit(form);
  expect(fetch).toHaveBeenCalledOnce();
  expect(
    (screen.getByRole("button", { name: "Sending..." }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);
  finish(Response.json({ success: true }));
  await screen.findByText("Thank you. Your request has been sent.");
  expect(
    (screen.getByLabelText("Your name", { exact: false }) as HTMLInputElement)
      .value,
  ).toBe("");
});
