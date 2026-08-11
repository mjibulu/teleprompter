import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";
import { App } from "./App";

describe("Online Teleprompter", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("recovers the session script and keeps reading controls synchronized", async () => {
    const user = userEvent.setup();
    window.sessionStorage.setItem(
      "teleprompter:script:v1",
      "Recovered script with five useful words.",
    );
    render(<App />);

    const editor = await screen.findByRole("textbox", {
      name: "Script text",
    });
    expect(editor).toHaveValue("Recovered script with five useful words.");

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Alignment" }),
      "left",
    );
    await user.click(screen.getByRole("button", { name: /Mirror text/u }));
    const stageScript = screen.getByText(
      "Recovered script with five useful words.",
      { selector: ".teleprompter-script" },
    );
    expect(stageScript).toHaveClass("mirrored");
    expect(stageScript).toHaveStyle({ textAlign: "left" });
  });

  it("plays, pauses, and responds to presentation shortcuts", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Countdown" }),
      "0",
    );
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

    fireEvent.keyDown(window, { code: "Space", key: " " });
    expect(screen.getByRole("button", { name: "Resume" })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "m" });
    expect(screen.getByRole("button", { name: /Mirror text/u })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("keeps the stage available when fullscreen is rejected", async () => {
    const user = userEvent.setup();
    render(<App />);
    const stage = screen.getByLabelText("Teleprompter reading stage");
    Object.defineProperty(stage.parentElement, "requestFullscreen", {
      configurable: true,
      value: vi.fn().mockRejectedValue(new Error("blocked")),
    });

    await user.click(screen.getByRole("button", { name: "Fullscreen" }));
    expect(stage).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fullscreen" })).toBeEnabled();
  });
});
