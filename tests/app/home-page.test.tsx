import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { profile } from "@/content/profile";

describe("HomePage", () => {
  it("renders the placeholder handle with a visible placeholder marker", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(profile.handle.value);
    // Every field on the current Home page is a placeholder (STORY-002 adds
    // approved content), so the boundary marker must be present at least once.
    expect(screen.getAllByText("Placeholder").length).toBeGreaterThan(0);
  });
});
