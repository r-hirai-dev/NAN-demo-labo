import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { profile } from "@/content/profile";

describe("HomePage", () => {
  it("renders the placeholder handle with a visible placeholder marker", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(profile.handle.value);
    // オーナーが実データを承認するまで、現在の Home ページの各フィールドはすべて
    // プレースホルダーであるため、境界マーカーが少なくとも1つは表示されるはず。
    expect(screen.getAllByText("Placeholder").length).toBeGreaterThan(0);
  });
});
