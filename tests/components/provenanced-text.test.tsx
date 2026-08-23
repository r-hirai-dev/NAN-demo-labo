import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProvenancedText } from "@/components/content/provenanced-text";
import { approved, placeholder } from "@/content/provenance";

describe("ProvenancedText", () => {
  it("renders the value without a placeholder badge when the fact is approved", () => {
    render(<ProvenancedText field={approved("Approved fact")} />);

    expect(screen.getByText("Approved fact")).toBeInTheDocument();
    expect(screen.queryByText("Placeholder")).not.toBeInTheDocument();
  });

  it("renders a visible placeholder badge when the fact is a placeholder", () => {
    render(<ProvenancedText field={placeholder("Unapproved fact")} />);

    expect(screen.getByText("Unapproved fact")).toBeInTheDocument();
    expect(screen.getByText("Placeholder")).toBeInTheDocument();
  });
});
