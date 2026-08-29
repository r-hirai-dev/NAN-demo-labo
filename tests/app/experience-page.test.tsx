import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExperiencePage from "@/app/experience/page";
import { experienceEntries } from "@/content/experience";

describe("ExperiencePage", () => {
  it("renders every fact from each experience entry", () => {
    render(<ExperiencePage />);

    for (const entry of experienceEntries) {
      // Placeholder wording can repeat across entries, so assert presence rather
      // than uniqueness.
      expect(screen.getAllByText(entry.role.value).length).toBeGreaterThan(0);
      expect(screen.getAllByText(entry.organization.value).length).toBeGreaterThan(0);
      expect(screen.getAllByText(entry.period.value).length).toBeGreaterThan(0);
      expect(screen.getAllByText(entry.summary.value).length).toBeGreaterThan(0);
    }
  });

  it("renders a visible placeholder marker for every placeholder field", () => {
    render(<ExperiencePage />);

    const placeholderFieldCount = experienceEntries.reduce((count, entry) => {
      const fields = [entry.role, entry.organization, entry.period, entry.summary];
      return count + fields.filter((field) => field.provenance === "placeholder").length;
    }, 0);

    expect(screen.getAllByText("Placeholder")).toHaveLength(placeholderFieldCount);
  });
});
