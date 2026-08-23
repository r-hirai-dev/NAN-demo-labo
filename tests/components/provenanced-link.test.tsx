import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProvenancedLink } from "@/components/content/provenanced-link";
import { approved, placeholder } from "@/content/provenance";

describe("ProvenancedLink", () => {
  it("renders a real anchor when the destination fact is approved", () => {
    render(
      <ProvenancedLink field={approved("https://example.com/real-project")}>
        View project
      </ProvenancedLink>
    );

    const link = screen.getByRole("link", { name: "View project" });
    expect(link).toHaveAttribute("href", "https://example.com/real-project");
    expect(screen.queryByText("Placeholder")).not.toBeInTheDocument();
  });

  it("never renders a clickable link for a placeholder destination", () => {
    render(
      <ProvenancedLink field={placeholder("https://example.com/placeholder-project")}>
        View project
      </ProvenancedLink>
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("View project")).toBeInTheDocument();
    expect(screen.getByText("Placeholder")).toBeInTheDocument();
  });
});
