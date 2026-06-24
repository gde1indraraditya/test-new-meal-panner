import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FamilyBadge from "../FamilyBadge";

describe("FamilyBadge", () => {
  it("renders the code", () => {
    render(<FamilyBadge code="AA" />);
    expect(screen.getByText("AA")).toBeInTheDocument();
  });

  it("renders emoji when provided", () => {
    render(<FamilyBadge code="AA" emoji="👶" />);
    expect(screen.getByText("👶")).toBeInTheDocument();
  });

  it("does not render emoji when not provided", () => {
    render(<FamilyBadge code="AA" />);
    expect(screen.queryByText(/^[^\w\s]$/)).toBeNull();
  });

  it("applies sm size class", () => {
    const { container } = render(<FamilyBadge code="AA" size="sm" />);
    const span = container.firstChild as HTMLElement;
    expect(span.className).toContain("text-xs");
  });

  it("applies md size class by default", () => {
    const { container } = render(<FamilyBadge code="AA" />);
    const span = container.firstChild as HTMLElement;
    expect(span.className).toContain("text-sm");
  });
});
