import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectsPage from "@/app/projects/page";
import { projectEntries } from "@/content/projects";

describe("ProjectsPage", () => {
  it("renders every fact from each project entry", () => {
    render(<ProjectsPage />);

    for (const project of projectEntries) {
      // Placeholder wording can repeat across entries, so assert presence rather
      // than uniqueness.
      expect(screen.getAllByText(project.name.value).length).toBeGreaterThan(0);
      expect(screen.getAllByText(project.summary.value).length).toBeGreaterThan(0);
    }
  });

  it("renders a visible placeholder marker for every placeholder field", () => {
    render(<ProjectsPage />);

    const placeholderFieldCount = projectEntries.reduce((count, project) => {
      const fields = [project.name, project.summary, project.href];
      return count + fields.filter((field) => field.provenance === "placeholder").length;
    }, 0);

    expect(screen.getAllByText("Placeholder")).toHaveLength(placeholderFieldCount);
  });

  it("never renders a placeholder project destination as a clickable link", () => {
    render(<ProjectsPage />);

    // Every current project entry is a placeholder, so no anchor should exist at all,
    // and none of the placeholder URLs should appear as an href anywhere in the page.
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    for (const project of projectEntries) {
      if (project.href.provenance === "placeholder") {
        expect(document.querySelector(`a[href="${project.href.value}"]`)).toBeNull();
      }
    }
  });
});
