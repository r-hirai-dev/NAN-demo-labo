import { describe, expect, it } from "vitest";
import { approved, placeholder } from "@/content/provenance";

describe("provenance helpers", () => {
  it("marks a value wrapped with approved() as approved", () => {
    const field = approved("real fact");

    expect(field).toEqual({ value: "real fact", provenance: "approved" });
  });

  it("marks a value wrapped with placeholder() as placeholder", () => {
    const field = placeholder("not yet approved");

    expect(field).toEqual({ value: "not yet approved", provenance: "placeholder" });
  });
});
