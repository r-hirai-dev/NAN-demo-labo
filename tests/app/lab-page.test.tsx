import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LabPage from "@/app/lab/page";

describe("LabPage", () => {
  it("renders the page heading", () => {
    render(<LabPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Lab" })).toBeInTheDocument();
  });

  it("carries no links while its content is unapproved", () => {
    render(<LabPage />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(document.querySelector("a")).toBeNull();
  });
});
